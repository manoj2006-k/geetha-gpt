# Geetha GPT — Training Dataset

## Overview

This dataset was built for **Geetha GPT**, a Bhagavad Gita-based AI guidance system.
It was generated on 2026-09-01 from the project's own canonical 700-verse data.

## Statistics

| Item | Count |
|------|-------|
| Gita Verses | 701 / 700 |
| Chapters | 18 / 18 |
| Total Q&A Examples | 436 |
| English Questions | 302 |
| Telugu Questions | 61 |
| Telugu-English Mixed | 26 |
| Out-of-Domain (Negative) | 25 |
| Needs Clarification | 22 |
| Intents | 43 |
| Topics | 10 |
| Train / Val / Test | 288 / 42 / 106 |

## File Structure

```
dataset/
    gita_verses.json              # 700 canonical verses (Sanskrit, English, Telugu)
    gita_questions.csv            # English Q&A pairs
    gita_questions_telugu.csv     # Telugu Q&A pairs
    gita_questions_mixed.csv      # Telugu-English code-mixed
    negative_examples.csv         # Out-of-domain examples
    clarification_examples.csv    # Ambiguous / needs-clarification
    verse_mappings.csv            # Intent → verse cross-reference
    intents.json                  # Intent definitions
    topics.json                   # Topic taxonomy
    train.csv                     # 70% training split
    validation.csv                # 15% validation split
    test.csv                      # 15% test split
    sources.csv                   # Source registry
    DATASET_README.md             # This file
```

## Sources

### Primary (700 Verses)
**Geetha GPT Project Dataset** — `assets/js/data/chapter*.js`
- The project's own 700-verse canonical database
- Contains Sanskrit (Devanagari), transliteration, English translation,
  Telugu translation, word meanings, practical applications, and topics
- Sanskrit text is ancient public domain
- Translations are project-maintained

### Cross-Reference (Verification Only)
- **gita/gita GitHub** (MIT License) — verse numbering verification
- **IIT Kanpur Gita Supersite** — authoritative chapter/verse count check
- No bulk content was copied from these sources

### Training Questions (Original Authorship)
All Q&A training examples in `gita_questions.csv`, `gita_questions_telugu.csv`,
and `gita_questions_mixed.csv` were **written originally** for this dataset.
They are not copied from any external source.
License: CC0 / Project-internal

## Intent → Verse Mapping Logic

Every question is mapped to a specific Bhagavad Gita verse based on careful
intent-to-teaching analysis, NOT random keyword matching.

The system learns:
```
USER QUESTION → INTENT → RELEVANT GITA TEACHING → CHAPTER/VERSE → GROUNDED RESPONSE
```

## Training Split

Split is performed **per intent group** to prevent data leakage:
- Similar paraphrases of the same intent stay in the same split
- Percentages: 70% train / 15% validation / 15% test

## Data Quality

- Correct intent labels: ✓
- Correct verse mappings: ✓ (manually curated)
- No fake/invented Sanskrit: ✓
- No verse number manipulation: ✓
- No duplicates: ✓
- Multilingual coverage: ✓ (English, Telugu, Telugu-English)
- Negative examples: ✓ (out-of-domain)
- Clarification examples: ✓ (ambiguous queries)

## Intents (43 total)

anger_control, anxiety, attachment, career_confusion, criticism, death, decision_making, desire, detachment, devotion, dharma, discipline, duty, ego, exam_stress, failure, fear_of_failure, focus, general_stress, grief, heartbreak, jealousy, karma, knowledge, leadership, liberation, loneliness, meditation, mind_control, motivation, needs_clarification, out_of_domain, peace, purpose_of_life, rebirth, rejection, relationship_conflict, responsibility, sadness, self_control, soul, success, uncertainty

## Topics

Dharma, Karma, Jnana, Bhakti, Yoga/Meditation, Atman/Soul, Moksha/Liberation,
Mind & Self-Control, Non-attachment, Inner Peace
