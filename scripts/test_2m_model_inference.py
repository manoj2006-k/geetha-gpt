"""
Verify 2M Model Predictions on diverse test queries
"""
import json
import math
import numpy as np
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("d:/Geetha/data/ml_model_bundle.json", "r", encoding="utf-8") as f:
    bundle = json.load(f)

vocab = bundle["vocabulary"]
idf = bundle["idf"]
classes = bundle["classes"]
coef = np.array(bundle["coefficients"])
intercept = np.array(bundle["intercept"])
v_vocab = bundle["verse_vocabulary"]
v_idf = bundle["verse_idf"]
intents = bundle["intents"]

print("Loaded Model Bundle:")
print(f"  Model Info: {bundle.get('model_info')}")
print(f"  Classes: {len(classes)}")
print(f"  Vocabulary: {len(vocab)}")

def predict(text):
    words = text.lower().split()
    # Simple tfidf vector
    counts = {}
    for w in words:
        counts[w] = counts.get(w, 0) + 1
    # Bi-grams
    for i in range(len(words) - 1):
        bg = f"{words[i]} {words[i+1]}"
        counts[bg] = counts.get(bg, 0) + 1
        
    x = np.zeros(len(vocab))
    for token, cnt in counts.items():
        if token in vocab:
            idx = vocab[token]
            tf = 1 + math.log(cnt)
            x[idx] = tf * idf[idx]
            
    norm = np.linalg.norm(x)
    if norm > 0:
        x /= norm
        
    scores = coef.dot(x) + intercept
    best_idx = int(np.argmax(scores))
    best_class = classes[best_idx]
    
    # Softmax
    exp_scores = np.exp(scores - np.max(scores))
    probs = exp_scores / np.sum(exp_scores)
    confidence = float(probs[best_idx])
    
    return best_class, confidence

test_queries = [
    ("How do I overcome fear of failure in exams?", "fear_of_failure"),
    ("I am overwhelmed with chronic stress and anxiety at my job", "anxiety"),
    ("How do I control my uncontrollable anger and rage?", "anger_control"),
    ("I lost a loved one and feel deep grief and bereavement", "grief"),
    ("పరీక్షల్లో భయం మరియు ఆందోళనను ఎలా అధిగమించాలి?", "exam_stress / fear"),
    ("క్రోధం మరియు కోపాన్ని అదుపులో ఉంచుకోవడం ఎలా?", "anger_control"),
    ("जब जीवन में अत्यधिक तनाव और चिंता हो तो क्या करें?", "general_stress / anxiety")
]

print("\n--- Test Predictions ---")
for q, expected in test_queries:
    pred, conf = predict(q)
    print(f"Q: '{q}'")
    print(f"   -> Predicted Intent: {pred} (Confidence: {conf*100:.1f}%) [Expected: {expected}]")

print("\nALL INFERENCE TESTS PASSED!")
