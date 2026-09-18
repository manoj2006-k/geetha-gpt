"""
Geetha GPT — ML Model Training & Evaluation Pipeline
Trains TF-IDF + Logistic Regression / Linear Classifier on Gita Question-Intent Dataset
Evaluates on 80/20 Train-Test Split (Accuracy, Precision, Recall, F1, Confusion Matrix)
Exports portable model bundle for offline in-browser execution.
"""
import os
import json
import csv
import numpy as np
import pandas as pd
import sys

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, classification_report, confusion_matrix

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = "d:/Geetha"
DATA_DIR = os.path.join(BASE_DIR, "data")
JS_DATA_DIR = os.path.join(BASE_DIR, "assets", "js", "data")

def clean_text(text):
    text = text.lower()
    text = "".join([c if c.isalnum() or c.isspace() else " " for c in text])
    tokens = [w for w in text.split() if len(w) > 1]
    return " ".join(tokens)

def train_and_evaluate():
    csv_file = os.path.join(DATA_DIR, "training_questions.csv")
    df = pd.read_csv(csv_file)
    print(f"Loaded {len(df)} samples across {df['intent'].nunique()} intents.")

    df["clean_question"] = df["question"].apply(clean_text)

    X = df["clean_question"].tolist()
    y = df["intent"].tolist()

    # 80/20 Train/Test Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    print(f"Training set: {len(X_train)} samples | Test set: {len(X_test)} samples")

    # TF-IDF Vectorizer
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        sublinear_tf=True,
        min_df=1
    )
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)

    # Train Logistic Regression
    clf = LogisticRegression(C=10.0, max_iter=1000, random_state=42)
    clf.fit(X_train_tfidf, y_train)

    # Evaluate
    y_pred = clf.predict(X_test_tfidf)

    acc = accuracy_score(y_test, y_pred)
    prec_w, rec_w, f1_w, _ = precision_recall_fscore_support(y_test, y_pred, average="weighted", zero_division=0)
    prec_m, rec_m, f1_m, _ = precision_recall_fscore_support(y_test, y_pred, average="macro", zero_division=0)
    cm = confusion_matrix(y_test, y_pred, labels=clf.classes_).tolist()
    report = classification_report(y_test, y_pred, output_dict=True, zero_division=0)

    print("\n=================================================================")
    print("                ML MODEL EVALUATION METRICS REPORT              ")
    print("=================================================================")
    print(f"  • Test Accuracy:        {acc * 100:.2f}%")
    print(f"  • Weighted Precision:   {prec_w * 100:.2f}%")
    print(f"  • Weighted Recall:      {rec_w * 100:.2f}%")
    print(f"  • Weighted F1-Score:    {f1_w * 100:.2f}%")
    print(f"  • Macro F1-Score:       {f1_m * 100:.2f}%")
    print("=================================================================\n")

    # Save metrics report
    metrics_summary = {
        "dataset_total_samples": len(df),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "num_classes": len(clf.classes_),
        "accuracy": acc,
        "weighted_precision": prec_w,
        "weighted_recall": rec_w,
        "weighted_f1": f1_w,
        "macro_f1": f1_m,
        "classes": clf.classes_.tolist(),
        "confusion_matrix": cm,
        "classification_report": report
    }

    metrics_file = os.path.join(DATA_DIR, "evaluation_metrics.json")
    with open(metrics_file, "w", encoding="utf-8") as f:
        json.dump(metrics_summary, f, ensure_ascii=False, indent=2)
    print(f"Saved evaluation metrics to {metrics_file}")

    # Retrain on full dataset for maximum deployment accuracy
    full_vectorizer = TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True, min_df=1)
    X_full_tfidf = full_vectorizer.fit_transform(X)
    full_clf = LogisticRegression(C=10.0, max_iter=1000, random_state=42)
    full_clf.fit(X_full_tfidf, y)

    # Prepare Verse Corpus Index for Cosine Similarity
    with open(os.path.join(DATA_DIR, "gita_verses.json"), "r", encoding="utf-8") as f:
        verses = json.load(f)

    verse_docs = []
    for v in verses:
        doc = f"{v['chapter']}.{v['verse']} {' '.join(v.get('topics', []))} {v.get('translation', '')} {v.get('meaning', '')} {v.get('practicalApplication', '')}"
        verse_docs.append(clean_text(doc))

    verse_vectorizer = TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True, max_features=1500)
    verse_matrix = verse_vectorizer.fit_transform(verse_docs)

    # Export Model Bundle (Ensure JSON serializable native types)
    vocab = {str(k): int(v) for k, v in full_vectorizer.vocabulary_.items()}
    idf = [float(x) for x in full_vectorizer.idf_]
    classes = [str(c) for c in full_clf.classes_]
    coef = [[float(val) for val in row] for row in full_clf.coef_]
    intercept = [float(x) for x in full_clf.intercept_]

    verse_vocab = {str(k): int(v) for k, v in verse_vectorizer.vocabulary_.items()}
    verse_idf = [float(x) for x in verse_vectorizer.idf_]

    # Load intents metadata
    with open(os.path.join(DATA_DIR, "intents.json"), "r", encoding="utf-8") as f:
        intents_meta = json.load(f)

    model_bundle = {
        "vocabulary": vocab,
        "idf": idf,
        "classes": classes,
        "coefficients": coef,
        "intercept": intercept,
        "verse_vocabulary": verse_vocab,
        "verse_idf": verse_idf,
        "intents": {item["intent"]: item for item in intents_meta}
    }

    # Save to data/ml_model_bundle.json
    bundle_json_path = os.path.join(DATA_DIR, "ml_model_bundle.json")
    with open(bundle_json_path, "w", encoding="utf-8") as f:
        json.dump(model_bundle, f, ensure_ascii=False, indent=2)
    print(f"Exported JSON model bundle to {bundle_json_path}")

    # Export to JS for browser offline execution
    js_model_path = os.path.join(JS_DATA_DIR, "mlModelData.js")
    js_content = f"// Geetha GPT — Pre-Trained ML Intent & TF-IDF Model Weights\nexport const ML_MODEL_DATA = {json.dumps(model_bundle, ensure_ascii=False)};\n"
    with open(js_model_path, "w", encoding="utf-8") as f:
        f.write(js_content)
    print(f"Exported JS model weights to {js_model_path}")

if __name__ == "__main__":
    train_and_evaluate()
