"""Final Dataset Validation Report"""
import csv, json, os

DATASET_DIR = "d:/Geetha/dataset"

def count_csv(fname):
    path = os.path.join(DATASET_DIR, fname)
    with open(path, "r", encoding="utf-8") as f:
        return sum(1 for _ in csv.DictReader(f))

def get_intents(fname):
    path = os.path.join(DATASET_DIR, fname)
    intents = set()
    with open(path, "r", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            intents.add(row["intent"])
    return intents

def main():
    verses = json.load(open(os.path.join(DATASET_DIR, "gita_verses.json"), encoding="utf-8"))
    by_ch = {}
    for v in verses:
        by_ch.setdefault(v["chapter"], []).append(v)

    expected = {1:47,2:72,3:43,4:42,5:29,6:47,7:30,8:28,9:34,
                10:42,11:55,12:20,13:35,14:27,15:20,16:24,17:28,18:78}

    en   = count_csv("gita_questions.csv")
    te   = count_csv("gita_questions_telugu.csv")
    mx   = count_csv("gita_questions_mixed.csv")
    neg  = count_csv("negative_examples.csv")
    clar = count_csv("clarification_examples.csv")
    train = count_csv("train.csv")
    val   = count_csv("validation.csv")
    test  = count_csv("test.csv")

    all_intents = get_intents("train.csv") | get_intents("validation.csv") | get_intents("test.csv")

    total_q = en + te + mx + neg + clar

    print("=" * 60)
    print("  GEETHA GPT — FINAL DATASET REPORT")
    print("=" * 60)
    print(f"\n  Gita verses:    {len(verses)} / 700")
    print(f"  Chapters:       {len(by_ch)} / 18")
    print()
    for ch in range(1, 19):
        n = len(by_ch.get(ch, []))
        exp = expected[ch]
        mark = "OK" if n == exp else "FAIL"
        print(f"    Chapter {ch:2d}: {n}/{exp} {mark}")

    empty_sanskrit = sum(1 for v in verses if not v.get("sanskrit","").strip())
    empty_en = sum(1 for v in verses if not v.get("english_translation","").strip())
    empty_te = sum(1 for v in verses if not v.get("telugu_translation","").strip())

    print(f"\n  Empty Sanskrit:        {empty_sanskrit}")
    print(f"  Empty English Trans:   {empty_en}")
    print(f"  Empty Telugu Trans:    {empty_te}")

    print(f"\n  English Q&A:           {en}")
    print(f"  Telugu Q&A:            {te}")
    print(f"  Telugu-English Mixed:  {mx}")
    print(f"  Negative (OOD):        {neg}")
    print(f"  Clarification:         {clar}")
    print(f"  Total Q&A examples:    {total_q}")
    print(f"\n  Train:                 {train}")
    print(f"  Validation:            {val}")
    print(f"  Test:                  {test}")
    print(f"\n  Intents:               {len(all_intents)}")

    print("\n" + "=" * 60)
    if len(verses) >= 700 and empty_sanskrit == 0 and total_q > 500:
        print("  DATASET VALIDATION: PASS")
    else:
        print("  DATASET VALIDATION: FAIL")
    print("=" * 60)

if __name__ == "__main__":
    main()
