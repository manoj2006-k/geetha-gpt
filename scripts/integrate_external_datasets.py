"""
Geetha GPT — Integrate External HuggingFace Datasets into Training Pipelines
1. JDhruv14/Bhagavad-Gita-QA
2. abagade/bhagavad-gita-guidance-qa

Outputs:
- dataset/gita_questions_external.csv (for ML classifier training)
- gita_finetuning_dataset.jsonl (augmented with external dialogues & QA pairs)
"""

import os
import re
import csv
import json
import sys
import pandas as pd

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = "d:/Geetha"
DATASET_DIR = os.path.join(BASE_DIR, "dataset")
EXTERNAL_DIR = os.path.join(DATASET_DIR, "external")
DATA_DIR = os.path.join(BASE_DIR, "data")

# Load existing intent definitions and verse mappings
with open(os.path.join(DATASET_DIR, "intents.json"), "r", encoding="utf-8") as f:
    INTENTS_DATA = json.load(f)

INTENT_KEYS = [item["intent"] for item in INTENTS_DATA]

# Chapter/Verse to Intent mapping based on existing dataset
VERSE_TO_INTENT = {
    (1, 1): "moral_dilemma", (1, 28): "grief", (1, 47): "sadness",
    (2, 11): "sadness", (2, 14): "general_stress", (2, 15): "general_stress",
    (2, 20): "soul", (2, 22): "death", (2, 23): "soul", (2, 31): "duty",
    (2, 40): "fear", (2, 41): "focus", (2, 47): "fear_of_failure",
    (2, 48): "failure", (2, 50): "career_confusion", (2, 55): "inner_peace",
    (2, 56): "anxiety", (2, 62): "anger_control", (2, 63): "anger_control",
    (3, 8): "duty", (3, 9): "karma", (3, 19): "success", (3, 21): "leadership",
    (3, 27): "ego", (3, 30): "jealousy", (3, 35): "career_confusion",
    (3, 37): "desire", (3, 43): "self_control",
    (4, 7): "dharma", (4, 8): "dharma", (4, 18): "success", (4, 34): "decision_making", (4, 38): "knowledge",
    (5, 10): "detachment", (5, 12): "desire", (5, 20): "heartbreak", (5, 25): "inner_peace",
    (6, 5): "mind_control", (6, 6): "mind_control", (6, 10): "meditation",
    (6, 16): "discipline", (6, 17): "exam_stress", (6, 25): "focus", (6, 35): "general_stress",
    (7, 7): "divine_nature", (7, 14): "liberation", (7, 16): "devotion",
    (8, 5): "death", (8, 16): "rebirth",
    (9, 22): "anxiety", (9, 26): "devotion", (9, 27): "devotion",
    (10, 8): "devotion", (10, 20): "purpose_of_life", (10, 41): "divine_nature",
    (11, 32): "time_management", (11, 33): "motivation", (11, 55): "motivation",
    (12, 8): "devotion", (12, 13): "relationship_conflict", (12, 14): "relationship_conflict",
    (13, 8): "ego", (13, 28): "equality",
    (14, 5): "gunas_psychology", (14, 20): "liberation",
    (15, 1): "purpose_of_life", (15, 7): "soul", (15, 15): "knowledge",
    (16, 1): "fear", (16, 2): "non_violence", (16, 3): "forgiveness", (16, 18): "ego", (16, 21): "desire",
    (17, 3): "faith", (17, 15): "speech_control",
    (18, 45): "success", (18, 47): "career_confusion", (18, 58): "sadness",
    (18, 63): "decision_making", (18, 65): "devotion", (18, 66): "fear_of_failure", (18, 78): "motivation"
}

# Chapter-level default intent if exact verse is not mapped
CHAPTER_DEFAULT_INTENT = {
    1: "moral_dilemma",
    2: "karma",
    3: "duty",
    4: "dharma",
    5: "detachment",
    6: "meditation",
    7: "divine_nature",
    8: "soul",
    9: "devotion",
    10: "divine_nature",
    11: "motivation",
    12: "devotion",
    13: "knowledge",
    14: "gunas_psychology",
    15: "purpose_of_life",
    16: "ego",
    17: "faith",
    18: "liberation"
}

def get_intent_for_verse(ch, v):
    return VERSE_TO_INTENT.get((ch, v), CHAPTER_DEFAULT_INTENT.get(ch, "duty"))

def process_jdhruv_dataset():
    """Process JDhruv14/Bhagavad-Gita-QA into training questions."""
    csv_path = os.path.join(EXTERNAL_DIR, "JDhruv14_Bhagavad_Gita_QA", "English", "english.csv")
    if not os.path.exists(csv_path):
        print(f"File not found: {csv_path}")
        return []

    df = pd.read_csv(csv_path)
    records = []
    qid_counter = 10000

    for _, row in df.iterrows():
        try:
            ch = int(row['chapter_no'])
            v = int(row['verse_no'])
        except (ValueError, TypeError):
            continue

        q = str(row['question']).strip()
        a = str(row['answer']).strip()
        if not q or not a or len(q) < 5:
            continue

        intent = get_intent_for_verse(ch, v)
        qid_counter += 1

        records.append({
            "id": f"JD_{qid_counter}",
            "question": q,
            "language": "English",
            "intent": intent,
            "chapter": ch,
            "verse": v,
            "verse_range": f"{ch}.{v}",
            "secondary_verse": "",
            "relevance": 1.0,
            "answer": a,
            "source": "JDhruv14/Bhagavad-Gita-QA (HuggingFace)",
            "license": "MIT"
        })

    print(f"Processed {len(records)} questions from JDhruv14 Bhagavad-Gita-QA")
    return records

def process_abagade_dataset():
    """Process abagade/bhagavad-gita-guidance-qa into training questions."""
    jsonl_path = os.path.join(EXTERNAL_DIR, "abagade_bhagavad_gita_guidance_qa", "guidance_dialogues.jsonl")
    if not os.path.exists(jsonl_path):
        print(f"File not found: {jsonl_path}")
        return []

    records = []
    qid_counter = 20000

    with open(jsonl_path, "r", encoding="utf-8") as f:
        for line in f:
            data = json.loads(line.strip())
            messages = data.get("messages", [])
            user_msg = next((m["content"] for m in messages if m.get("role") == "user"), "")
            asst_msg = next((m["content"] for m in messages if m.get("role") == "assistant"), "")

            if not user_msg or not asst_msg:
                continue

            # Extract chapter and verse if present in assistant response
            # Format typically: (Chapter X, Verse Y)
            m = re.search(r'Chapter\s*(\d+)[,\s]+Verse\s*(\d+)', asst_msg, re.IGNORECASE)
            if m:
                ch = int(m.group(1))
                v = int(m.group(2))
            else:
                ch, v = 2, 47

            intent = get_intent_for_verse(ch, v)
            qid_counter += 1

            records.append({
                "id": f"AB_{qid_counter}",
                "question": user_msg.strip(),
                "language": "English",
                "intent": intent,
                "chapter": ch,
                "verse": v,
                "verse_range": f"{ch}.{v}",
                "secondary_verse": "",
                "relevance": 1.0,
                "answer": asst_msg.strip(),
                "source": "abagade/bhagavad-gita-guidance-qa (HuggingFace)",
                "license": "Open Data"
            })

    print(f"Processed {len(records)} dialogues from abagade Bhagavad-Gita Guidance QA")
    return records

def update_finetuning_dataset(jdhruv_records, abagade_records):
    """Augment root gita_finetuning_dataset.jsonl with new dialogues and QA pairs."""
    finetune_path = os.path.join(BASE_DIR, "gita_finetuning_dataset.jsonl")
    system_prompt = "You are a knowledgeable and spiritual assistant specialized in the teachings of the Bhagavad Gita."

    existing_lines = 0
    if os.path.exists(finetune_path):
        with open(finetune_path, "r", encoding="utf-8") as f:
            existing_lines = sum(1 for _ in f)

    print(f"\nExisting fine-tuning dataset: {existing_lines} samples")

    # Add new pairs
    new_entries = []

    # 1. Abagade guidance dialogues (already high-quality conversational advice)
    for r in abagade_records:
        entry = {
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": r["question"]},
                {"role": "assistant", "content": r["answer"]}
            ]
        }
        new_entries.append(entry)

    # 2. JDhruv QA pairs
    for r in jdhruv_records:
        entry = {
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": r["question"]},
                {"role": "assistant", "content": r["answer"]}
            ]
        }
        new_entries.append(entry)

    # Append to gita_finetuning_dataset.jsonl
    with open(finetune_path, "a", encoding="utf-8") as f:
        for item in new_entries:
            f.write(json.dumps(item, ensure_ascii=False) + "\n")

    total_lines = existing_lines + len(new_entries)
    print(f"Added {len(new_entries)} new training pairs to {finetune_path}")
    print(f"Total fine-tuning dataset size: {total_lines} samples")

def main():
    print("=" * 60)
    print("INTEGRATING EXTERNAL DATASETS")
    print("=" * 60)

    jdhruv_records = process_jdhruv_dataset()
    abagade_records = process_abagade_dataset()

    all_external = jdhruv_records + abagade_records
    print(f"\nTotal external records ready: {len(all_external)}")

    # Write dataset/gita_questions_external.csv
    out_csv = os.path.join(DATASET_DIR, "gita_questions_external.csv")
    fieldnames = [
        "id", "question", "language", "intent", "chapter", "verse",
        "verse_range", "secondary_verse", "relevance", "answer", "source", "license"
    ]
    with open(out_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(all_external)

    print(f"Saved {len(all_external)} rows to {out_csv}")

    # Update LLM fine-tuning dataset
    update_finetuning_dataset(jdhruv_records, abagade_records)

    print("\n" + "=" * 60)
    print("INTEGRATION COMPLETE")
    print("=" * 60)

if __name__ == "__main__":
    main()
