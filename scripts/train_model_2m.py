"""
Geetha GPT — 2,000,000 Sample Model Training Pipeline
=====================================================
Trains on the 2,000,000 row dataset from dataset/large_2m/gita_2m_training.parquet.
Uses TF-IDF + SGDClassifier (log_loss / probabilistic logistic regression).

Features:
- Fast chunked/vectorized training on 2M examples
- 90/10 Train/Test split (1,800,000 train / 200,000 test)
- Comprehensive evaluation metrics
- Compact float export for browser and server models
"""

import os
import sys
import json
import time
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import SGDClassifier
from sklearn.metrics import (accuracy_score, precision_recall_fscore_support,
                             classification_report)

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = "d:/Geetha"
DATASET_DIR = os.path.join(BASE_DIR, "dataset")
LARGE_2M_DIR = os.path.join(DATASET_DIR, "large_2m")
DATA_DIR = os.path.join(BASE_DIR, "data")
JS_DATA_DIR = os.path.join(BASE_DIR, "assets", "js", "data")

def clean_text(text):
    text = str(text).lower()
    text = "".join([c if c.isalnum() or c.isspace() else " " for c in text])
    return " ".join(w for w in text.split() if len(w) > 1)

def main():
    print("=" * 65)
    print("  GEETHA GPT — 2,000,000 ROW MODEL TRAINING PIPELINE")
    print("=" * 65)

    # ── 1. Load Parquet Dataset
    parquet_path = os.path.join(LARGE_2M_DIR, "gita_2m_training.parquet")
    print(f"\n[1/5] Loading 2M dataset from {parquet_path}...")
    t0 = time.time()
    df = pd.read_parquet(parquet_path, columns=["question", "intent", "language"])
    load_time = time.time() - t0
    print(f"      Loaded {len(df):,} rows in {load_time:.2f}s")
    print(f"      Unique intents: {df['intent'].nunique()}")
    print(f"      Languages: {df['language'].value_counts().to_dict()}")

    # ── 2. Train / Test Split (90% / 10% -> 1.8M / 200K)
    print("\n[2/5] Performing Train/Test Split (90/10)...")
    t0 = time.time()
    X = df["question"].tolist()
    y = df["intent"].tolist()

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.10, random_state=42, stratify=y
    )
    print(f"      Train: {len(X_train):,} samples | Test: {len(X_test):,} samples ({time.time() - t0:.2f}s)")

    # ── 3. Feature Extraction & Training
    print("\n[3/5] Fitting TF-IDF Vectorizer (max_features=5000)...")
    t0 = time.time()
    vectorizer = TfidfVectorizer(
        max_features=5000,
        ngram_range=(1, 2),
        sublinear_tf=True,
        min_df=5,
        analyzer="word"
    )
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)
    print(f"      TF-IDF feature matrix: {X_train_tfidf.shape} ({time.time() - t0:.2f}s)")

    print("\n[4/5] Training SGDClassifier (log_loss, L2 regularization)...")
    t0 = time.time()
    clf = SGDClassifier(
        loss="log_loss",
        penalty="l2",
        alpha=1e-5,
        max_iter=30,
        random_state=42,
        n_jobs=-1
    )
    clf.fit(X_train_tfidf, y_train)
    train_time = time.time() - t0
    print(f"      Training complete in {train_time:.2f}s ({len(X_train)/train_time:,.0f} samples/sec)")

    # ── 4. Evaluate on 200,000 Test Set
    print("\n[5/5] Evaluating on 200,000 test samples...")
    t0 = time.time()
    y_pred = clf.predict(X_test_tfidf)
    eval_time = time.time() - t0

    acc = accuracy_score(y_test, y_pred)
    prec_w, rec_w, f1_w, _ = precision_recall_fscore_support(
        y_test, y_pred, average="weighted", zero_division=0)
    prec_m, rec_m, f1_m, _ = precision_recall_fscore_support(
        y_test, y_pred, average="macro", zero_division=0)

    print("\n" + "=" * 65)
    print("  2M MODEL EVALUATION RESULTS (200,000 TEST SAMPLES)")
    print("=" * 65)
    print(f"  Test Accuracy:        {acc * 100:.2f}%")
    print(f"  Weighted Precision:   {prec_w * 100:.2f}%")
    print(f"  Weighted Recall:      {rec_w * 100:.2f}%")
    print(f"  Weighted F1:          {f1_w * 100:.2f}%")
    print(f"  Macro F1:             {f1_m * 100:.2f}%")
    print(f"  Classes:              {len(clf.classes_)}")
    print(f"  Evaluation Time:      {eval_time:.2f}s")
    print("=" * 65)

    # ── 5. Retrain on FULL 2M Dataset & Export Model Bundle
    print("\nRetraining on FULL 2,000,000 dataset for production deployment...")
    t0 = time.time()
    full_vec = TfidfVectorizer(
        max_features=5000,
        ngram_range=(1, 2),
        sublinear_tf=True,
        min_df=5,
        analyzer="word"
    )
    X_full_tfidf = full_vec.fit_transform(X)
    full_clf = SGDClassifier(
        loss="log_loss",
        penalty="l2",
        alpha=1e-5,
        max_iter=30,
        random_state=42,
        n_jobs=-1
    )
    full_clf.fit(X_full_tfidf, y)
    print(f"Full retraining complete in {time.time() - t0:.2f}s")

    # Build Verse Retrieval Index
    print("Indexing verse corpus for semantic retrieval...")
    verses_path = os.path.join(BASE_DIR, "data", "gita_verses.json")
    with open(verses_path, "r", encoding="utf-8") as f:
        verses = json.load(f)

    verse_docs = []
    for v in verses:
        trans = v.get("englishTranslation") or v.get("translation", "")
        meaning = v.get("englishExplanation") or v.get("meaning", "")
        practical = v.get("practicalApplication", "")
        topics = " ".join(v.get("topics", []))
        doc = f"{v['chapter']}.{v['verse']} {topics} {trans} {meaning} {practical}"
        verse_docs.append(clean_text(doc))

    verse_vec = TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True, max_features=2000)
    verse_vec.fit(verse_docs)

    # Load intents metadata
    intents_path = os.path.join(DATASET_DIR, "intents.json")
    with open(intents_path, "r", encoding="utf-8") as f:
        intents_meta = json.load(f)

    if isinstance(intents_meta, list):
        intents_dict = {item["intent"]: item for item in intents_meta}
    else:
        intents_dict = intents_meta

    # Serialize compact model bundle (round floats to 4 decimals for lightweight bundle)
    vocab = {str(k): int(v) for k, v in full_vec.vocabulary_.items()}
    idf = [round(float(x), 4) for x in full_vec.idf_]
    classes = [str(c) for c in full_clf.classes_]
    coef = [[round(float(val), 4) for val in row] for row in full_clf.coef_]
    intercept = [round(float(x), 4) for x in full_clf.intercept_]
    v_vocab = {str(k): int(v) for k, v in verse_vec.vocabulary_.items()}
    v_idf = [round(float(x), 4) for x in verse_vec.idf_]

    model_bundle = {
        "vocabulary": vocab,
        "idf": idf,
        "classes": classes,
        "coefficients": coef,
        "intercept": intercept,
        "verse_vocabulary": v_vocab,
        "verse_idf": v_idf,
        "intents": intents_dict,
        "model_info": {
            "algorithm": "TF-IDF + SGDClassifier (Log Loss)",
            "accuracy": float(acc),
            "f1_weighted": float(f1_w),
            "f1_macro": float(f1_m),
            "classes": int(len(classes)),
            "training_samples": int(len(df)),
            "test_samples": int(len(y_test)),
            "vocabulary_size": int(len(vocab)),
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }
    }

    # Save data/evaluation_metrics.json
    metrics = {
        "dataset_total_samples": len(df),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "num_classes": int(len(classes)),
        "accuracy": float(acc),
        "weighted_precision": float(prec_w),
        "weighted_recall": float(rec_w),
        "weighted_f1": float(f1_w),
        "macro_f1": float(f1_m),
        "classes": classes,
        "training_time_seconds": round(train_time, 2)
    }
    metrics_path = os.path.join(DATA_DIR, "evaluation_metrics.json")
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(metrics, f, ensure_ascii=False, indent=2)
    print(f"\n  Saved Metrics: {metrics_path}")

    # Save data/ml_model_bundle.json
    bundle_path = os.path.join(DATA_DIR, "ml_model_bundle.json")
    with open(bundle_path, "w", encoding="utf-8") as f:
        json.dump(model_bundle, f, ensure_ascii=False, indent=2)
    bundle_size_mb = os.path.getsize(bundle_path) / (1024 * 1024)
    print(f"  Saved JSON Model: {bundle_path} ({bundle_size_mb:.2f} MB)")

    # Save assets/js/data/mlModelData.js
    os.makedirs(JS_DATA_DIR, exist_ok=True)
    js_path = os.path.join(JS_DATA_DIR, "mlModelData.js")
    js_content = (
        "// Geetha GPT — 2M-Sample Trained ML Intent & Retrieval Model Weights\n"
        "// Auto-generated by scripts/train_model_2m.py — DO NOT EDIT MANUALLY\n"
        f"export const ML_MODEL_DATA = {json.dumps(model_bundle, ensure_ascii=False)};\n"
    )
    with open(js_path, "w", encoding="utf-8") as f:
        f.write(js_content)
    js_size_mb = os.path.getsize(js_path) / (1024 * 1024)
    print(f"  Saved JS Browser Model: {js_path} ({js_size_mb:.2f} MB)")

    print("\n" + "=" * 65)
    print("  MODEL TRAINING ON 2,000,000 SAMPLES COMPLETE!")
    print("=" * 65)

if __name__ == "__main__":
    main()
