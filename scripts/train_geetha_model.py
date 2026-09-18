"""
Geetha GPT — Unified Model Training Pipeline
=============================================
Uses the expanded dataset from d:/Geetha/dataset/
Trains TF-IDF + Logistic Regression intent classifier.
Exports:
  - data/evaluation_metrics.json   (metrics report)
  - data/ml_model_bundle.json      (JSON weights for server-side use)
  - assets/js/data/mlModelData.js  (JS weights for browser offline use)

USAGE:
  python scripts/train_geetha_model.py
"""

import os, sys, json, csv
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (accuracy_score, precision_recall_fscore_support,
                              classification_report, confusion_matrix)

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR    = "d:/Geetha"
DATASET_DIR = os.path.join(BASE_DIR, "dataset")
DATA_DIR    = os.path.join(BASE_DIR, "data")
JS_DATA_DIR = os.path.join(BASE_DIR, "assets", "js", "data")

def clean_text(text):
    text = text.lower()
    text = "".join([c if c.isalnum() or c.isspace() else " " for c in text])
    return " ".join(w for w in text.split() if len(w) > 1)

def load_dataset():
    """Load from the new dataset/ directory, merge all languages."""
    dfs = []
    files = [
        ("gita_questions.csv",          "English"),
        ("gita_questions_external.csv", "English"),
        ("gita_questions_telugu.csv",    "Telugu"),
        ("gita_questions_mixed.csv",     "Telugu-English"),
        ("negative_examples.csv",        "English"),
        ("clarification_examples.csv",   "English"),
    ]
    for fname, lang in files:
        fpath = os.path.join(DATASET_DIR, fname)
        if os.path.exists(fpath):
            df = pd.read_csv(fpath)
            df["language"] = lang
            dfs.append(df)
            print(f"  Loaded {len(df):5d} rows  ← {fname}")

    combined = pd.concat(dfs, ignore_index=True)

    # Drop rows with empty question or intent
    combined = combined.dropna(subset=["question", "intent"])
    combined = combined[combined["question"].str.strip() != ""]
    combined = combined[combined["intent"].str.strip() != ""]

    # Remove duplicates
    before = len(combined)
    combined = combined.drop_duplicates(subset=["question"])
    after = len(combined)
    if before > after:
        print(f"  Removed {before - after} duplicate questions")

    return combined

def main():
    print("\n" + "="*60)
    print("  GEETHA GPT — MODEL TRAINING")
    print("="*60)

    # ── 1. Load data
    print("\n[1/5] Loading dataset...")
    df = load_dataset()
    print(f"\n  Total samples: {len(df)}")
    print(f"  Intents:       {df['intent'].nunique()}")
    print(f"  Languages:     {df['language'].nunique()}")

    df["clean_question"] = df["question"].astype(str).apply(clean_text)
    X = df["clean_question"].tolist()
    y = df["intent"].tolist()

    # ── 2. Train/Test Split (80/20, stratified)
    print("\n[2/5] Splitting data 80/20...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"  Train: {len(X_train)} | Test: {len(X_test)}")

    # ── 3. TF-IDF + Logistic Regression
    print("\n[3/5] Training TF-IDF + Logistic Regression...")
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        sublinear_tf=True,
        min_df=2,
        max_features=3000,
        analyzer="word"
    )
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf  = vectorizer.transform(X_test)

    clf = LogisticRegression(C=10.0, max_iter=2000, random_state=42,
                              solver="lbfgs")
    clf.fit(X_train_tfidf, y_train)
    print("  Training complete.")

    # ── 4. Evaluate
    print("\n[4/5] Evaluating model...")
    y_pred = clf.predict(X_test_tfidf)
    acc    = accuracy_score(y_test, y_pred)
    prec_w, rec_w, f1_w, _ = precision_recall_fscore_support(
        y_test, y_pred, average="weighted", zero_division=0)
    prec_m, rec_m, f1_m, _ = precision_recall_fscore_support(
        y_test, y_pred, average="macro", zero_division=0)
    cm     = confusion_matrix(y_test, y_pred, labels=clf.classes_).tolist()
    report = classification_report(y_test, y_pred, output_dict=True, zero_division=0)

    print("\n" + "="*60)
    print("  EVALUATION RESULTS")
    print("="*60)
    print(f"  Accuracy (Test):        {acc*100:.2f}%")
    print(f"  Weighted Precision:     {prec_w*100:.2f}%")
    print(f"  Weighted Recall:        {rec_w*100:.2f}%")
    print(f"  Weighted F1:            {f1_w*100:.2f}%")
    print(f"  Macro F1:               {f1_m*100:.2f}%")
    print(f"  Classes:                {len(clf.classes_)}")
    print("="*60)

    # Save evaluation_metrics.json
    metrics = {
        "dataset_total_samples": len(df),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "num_classes": int(len(clf.classes_)),
        "accuracy": float(acc),
        "weighted_precision": float(prec_w),
        "weighted_recall": float(rec_w),
        "weighted_f1": float(f1_w),
        "macro_f1": float(f1_m),
        "classes": clf.classes_.tolist(),
        "confusion_matrix": cm,
        "classification_report": report,
    }
    os.makedirs(DATA_DIR, exist_ok=True)
    metrics_path = os.path.join(DATA_DIR, "evaluation_metrics.json")
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(metrics, f, ensure_ascii=False, indent=2)
    print(f"\n  Saved: {metrics_path}")

    # ── 5. Retrain on FULL dataset, export model bundle
    print("\n[5/5] Retraining on full data and exporting model bundle...")
    full_vec = TfidfVectorizer(ngram_range=(1,2), sublinear_tf=True, min_df=2, max_features=3000)
    X_full_tfidf = full_vec.fit_transform(X)
    full_clf = LogisticRegression(C=10.0, max_iter=2000, random_state=42,
                                   solver="lbfgs")
    full_clf.fit(X_full_tfidf, y)

    # Build verse corpus index for retrieval
    verses_path = os.path.join(DATASET_DIR, "gita_verses.json")
    if not os.path.exists(verses_path):
        verses_path = os.path.join(DATA_DIR, "gita_verses.json")

    with open(verses_path, "r", encoding="utf-8") as f:
        verses = json.load(f)

    verse_docs = []
    for v in verses:
        trans = v.get("english_translation") or v.get("translation","")
        meaning = v.get("english_explanation") or v.get("meaning","")
        practical = v.get("practical_en") or v.get("practicalApplication","")
        topics = " ".join(v.get("topics", []))
        doc = f"{v['chapter']}.{v['verse']} {topics} {trans} {meaning} {practical}"
        verse_docs.append(clean_text(doc))

    verse_vec = TfidfVectorizer(ngram_range=(1,2), sublinear_tf=True, max_features=2000)
    verse_vec.fit(verse_docs)

    # Load intent metadata
    intents_path = os.path.join(DATASET_DIR, "intents.json")
    if not os.path.exists(intents_path):
        intents_path = os.path.join(DATA_DIR, "intents.json")
    with open(intents_path, "r", encoding="utf-8") as f:
        intents_meta = json.load(f)

    # Serialize model bundle (compact floats to keep bundle lightweight)
    vocab      = {str(k): int(v) for k, v in full_vec.vocabulary_.items()}
    idf        = [round(float(x), 4) for x in full_vec.idf_]
    classes    = [str(c) for c in full_clf.classes_]
    coef       = [[round(float(val), 4) for val in row] for row in full_clf.coef_]
    intercept  = [round(float(x), 4) for x in full_clf.intercept_]
    v_vocab    = {str(k): int(v) for k, v in verse_vec.vocabulary_.items()}
    v_idf      = [round(float(x), 4) for x in verse_vec.idf_]

    if isinstance(intents_meta, list):
        intents_dict = {item["intent"]: item for item in intents_meta}
    else:
        intents_dict = intents_meta

    bundle = {
        "vocabulary":      vocab,
        "idf":             idf,
        "classes":         classes,
        "coefficients":    coef,
        "intercept":       intercept,
        "verse_vocabulary": v_vocab,
        "verse_idf":       v_idf,
        "intents":         intents_dict,
        "model_info": {
            "algorithm": "TF-IDF + Logistic Regression",
            "accuracy":  float(acc),
            "f1_macro":  float(f1_m),
            "classes":   int(len(classes)),
            "samples":   int(len(df)),
        }
    }

    # Save JSON bundle
    bundle_path = os.path.join(DATA_DIR, "ml_model_bundle.json")
    with open(bundle_path, "w", encoding="utf-8") as f:
        json.dump(bundle, f, ensure_ascii=False, indent=2)
    size_kb = os.path.getsize(bundle_path) / 1024
    print(f"  Saved: {bundle_path} ({size_kb:.0f} KB)")

    # Export JS model for browser
    os.makedirs(JS_DATA_DIR, exist_ok=True)
    js_path = os.path.join(JS_DATA_DIR, "mlModelData.js")
    js_content = (
        "// Geetha GPT — Pre-Trained ML Intent & TF-IDF Model Weights\n"
        "// Auto-generated by scripts/train_geetha_model.py — DO NOT EDIT MANUALLY\n"
        f"export const ML_MODEL_DATA = {json.dumps(bundle, ensure_ascii=False)};\n"
    )
    with open(js_path, "w", encoding="utf-8") as f:
        f.write(js_content)
    js_size_kb = os.path.getsize(js_path) / 1024
    print(f"  Saved: {js_path} ({js_size_kb:.0f} KB)")

    print("\n" + "="*60)
    print("  TRAINING COMPLETE")
    print(f"  Accuracy:  {acc*100:.2f}%  |  F1 (Macro): {f1_m*100:.2f}%")
    print(f"  Intents:   {len(classes)}")
    print(f"  Dataset:   {len(df)} examples")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()
