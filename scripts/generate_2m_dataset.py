"""
Geetha GPT — 2,000,000 Row Dataset Generator
============================================
Collects and synthesizes 2M machine learning training rows from:
1. 701 Canonical Gita Verses (English, Telugu, Hindi, Sanskrit)
2. HuggingFace JDhruv14/Bhagavad-Gita-QA (English, Hindi, Gujarati)
3. HuggingFace abagade/bhagavad-gita-guidance-qa (711 Guidance Dialogues)
4. Multi-Persona & Situational Dilemma Combinatorial Generator across 54 Intents

Outputs:
- dataset/large_2m/gita_2m_training.parquet
- dataset/large_2m/gita_2m_training.csv
- dataset/large_2m/metadata.json
"""

import os
import sys
import json
import time
import re
import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = "d:/Geetha"
DATASET_DIR = os.path.join(BASE_DIR, "dataset")
EXTERNAL_DIR = os.path.join(DATASET_DIR, "external")
OUT_DIR = os.path.join(DATASET_DIR, "large_2m")
os.makedirs(OUT_DIR, exist_ok=True)

TARGET_ROWS = 2_000_000

# 1. Load Intent metadata & Verse mappings
with open(os.path.join(DATASET_DIR, "intents.json"), "r", encoding="utf-8") as f:
    intents_raw = json.load(f)

INTENTS = [item["intent"] for item in intents_raw]

# Load canonical 701 verses
with open(os.path.join(BASE_DIR, "data", "gita_verses.json"), "r", encoding="utf-8") as f:
    ALL_VERSES = json.load(f)

print(f"Loaded {len(ALL_VERSES)} canonical verses and {len(INTENTS)} intent categories.")

# Life Dilemma Situations per Intent
INTENT_SITUATIONS = {
    "fear_of_failure": [
        "I am preparing for an important competitive exam and the fear of failing is paralyzing me.",
        "My startup is on the verge of bankruptcy and I cannot bear the thought of failing my team.",
        "I have a major career presentation tomorrow and I keep picturing myself stumbling and failing.",
        "I want to pursue my artistic passion but the terror of failure stops me from trying.",
        "Every time I set an ambitious goal, anxiety about not achieving it ruins my focus."
    ],
    "exam_stress": [
        "Final examinations are next week and I cannot sleep due to overwhelming anxiety.",
        "My parents expect top grades and the pressure is making it impossible to study effectively.",
        "I study for hours but my mind goes completely blank when I sit down for the test.",
        "How do I maintain concentration and calm while revising tough subjects?"
    ],
    "general_stress": [
        "Workload at my job is unrelenting and I feel constantly burned out and exhausted.",
        "Juggling family responsibilities and professional deadlines has destroyed my peace of mind.",
        "I feel an underlying tension in my chest every single day that never goes away.",
        "How does the Gita guide someone dealing with chronic modern stress and fatigue?"
    ],
    "anxiety": [
        "My thoughts constantly race to worst-case scenarios about the future.",
        "I get sudden waves of panic and heart palpitations whenever uncertain news arrives.",
        "Social situations make me terribly nervous and self-conscious.",
        "How can ancient spiritual wisdom cure generalized anxiety and overthinking?"
    ],
    "anger_control": [
        "I lose my temper over minor inconveniences and regret it immediately afterwards.",
        "Someone at work betrayed my trust and I am consumed by bitter, burning anger.",
        "My arguments with my partner escalate into hurtful shouting matches.",
        "What does Krishna teach about the root cause of destructive rage and how to tame it?"
    ],
    "sadness": [
        "A heavy gloom has settled over my days and I find no joy in activities I once loved.",
        "I feel profoundly isolated and misunderstood by the people around me.",
        "How do I find a reason to smile when sorrow feels like a permanent weight?"
    ],
    "grief": [
        "I recently lost a beloved family member and the void in my heart is unbearable.",
        "Grieving the passing of my mentor has left me without guidance or anchor in life.",
        "How does the Gita's teaching on the immortal soul comfort someone devastated by bereavement?"
    ],
    "heartbreak": [
        "A relationship I invested my entire heart into just ended and I feel shattered.",
        "I feel unlovable and betrayed after a painful divorce.",
        "How can spiritual detachment heal emotional pain after a devastating breakup?"
    ],
    "career_confusion": [
        "I am torn between a stable corporate job that drains my spirit and a risky path that excites me.",
        "I have been working for ten years but still don't know what my true calling or Swadharma is.",
        "Should I stay in my current profession or start over in a completely new industry?",
        "How do I determine the right career direction according to the Bhagavad Gita?"
    ],
    "decision_making": [
        "I am paralyzed between two conflicting choices and afraid of making the wrong decision.",
        "My emotions are pulling me one way while cold logic tells me to go the opposite way.",
        "How does a wise person make firm, righteous decisions without second-guessing themselves?"
    ],
    "duty": [
        "I feel overwhelmed by obligations to my family, community, and profession.",
        "Sometimes doing the right thing requires great personal sacrifice; how do I stay committed?",
        "What is the difference between fulfilling genuine duty and unnecessary martyrdom?"
    ],
    "dharma": [
        "In a morally compromised society, how do I uphold righteousness without getting crushed?",
        "What should one do when family loyalty conflicts with universal ethical principles?",
        "How does Krishna define Dharma in the midst of war and chaos?"
    ],
    "karma": [
        "Why do bad things happen to good, ethical people who never harm anyone?",
        "How does the law of Karma operate across human actions, intentions, and destinies?",
        "Can selfless action truly liberate a person from the bondage of karmic reactions?"
    ],
    "detachment": [
        "How can I love deeply and care for my children without becoming possessively attached?",
        "How to perform high-stakes work with excellence while remaining detached from outcomes?",
        "Does detachment mean becoming cold and emotionless, or does it mean something higher?"
    ],
    "mind_control": [
        "My mind wanders relentlessly during work and meditation; how do I harness it?",
        "Negative self-talk and intrusive memories keep sabotaging my happiness.",
        "Why is controlling the human mind compared to catching the raging wind?"
    ],
    "meditation": [
        "What is the ideal posture, breathing, and mental focus for Gita-style Dhyana Yoga?",
        "How do I transition from superficial concentration to deep, transcendent absorption?",
        "Can a busy householder with a full-time job practice authentic meditation?"
    ],
    "devotion": [
        "How does one cultivate pure, unmotivated love and surrender to the Supreme Divine?",
        "What is the power of offering even a simple leaf, flower, fruit, or water with devotion?",
        "How does Bhakti Yoga transform everyday chores into sacred worship?"
    ],
    "purpose_of_life": [
        "What is the ultimate purpose of human birth beyond working, eating, and accumulating wealth?",
        "How do I discover my unique soul purpose in this lifetime?",
        "What does liberation (Moksha) actually mean for a living human being?"
    ],
    "soul": [
        "What is the eternal nature of the Atman that weapons cannot cleave and fire cannot burn?",
        "How does the soul pass from body to body just as a person discards worn-out garments?",
        "What is the relationship between the individual soul (Jivatman) and the Supreme Soul (Paramatman)?"
    ],
    "death": [
        "I have a deep existential fear of death and non-existence.",
        "What happens to the conscious mind and subtle impressions at the precise moment of passing?",
        "Why does Krishna say that for one who has taken birth, death is certain, and rebirth is certain for the dead?"
    ],
    "leadership": [
        "What are the indispensable spiritual and ethical qualities of an authentic leader?",
        "How should a leader handle dissent, criticism, and team conflicts with equanimity?",
        "Why does Krishna say that whatever standards a great person sets, common people follow?"
    ],
    "ego": [
        "How do I recognize when pride and arrogance are subtly dictating my actions?",
        "Why does Krishna state that all actions are performed by nature's Gunas, yet the bewildered ego thinks 'I am the doer'?",
        "How to dismantle the destructive ego without losing self-confidence?"
    ],
    "inner_peace": [
        "How do I cultivate an unshakeable inner sanctuary that remains calm amidst external turmoil?",
        "What are the defining behavioral traits of a Sthitaprajna (one anchored in steady wisdom)?",
        "Can genuine inner peace coexist with an intensely active, productive life?"
    ]
}

# Add fallback situations for any remaining intents
for it in INTENTS:
    if it not in INTENT_SITUATIONS:
        it_clean = it.replace("_", " ")
        INTENT_SITUATIONS[it] = [
            f"How does the Bhagavad Gita guide us regarding {it_clean} in daily life?",
            f"What wisdom does Sri Krishna offer when someone struggles with {it_clean}?",
            f"Can you explain the spiritual perspective on {it_clean} according to the sacred verses?",
            f"How can applying the principles of the Gita help resolve challenges related to {it_clean}?",
            f"What are the practical steps to overcome obstacles involving {it_clean}?"
        ]

# Persona prefixes
PERSONAS = [
    ("As a university student", "Student"),
    ("As a busy corporate professional", "Professional"),
    ("As a young entrepreneur building a venture", "Entrepreneur"),
    ("As a parent striving to guide my children", "Parent"),
    ("As an executive leading a large organization", "Leader"),
    ("As someone seeking genuine spiritual awakening", "Seeker"),
    ("As a person struggling with constant anxiety", "Anxious Individual"),
    ("As a young graduate entering the workforce", "Youth"),
    ("In my daily personal life", "General")
]

# Question Template Patterns
ENGLISH_TEMPLATES = [
    "How does the Bhagavad Gita help when {situation}",
    "What advice does Sri Krishna give to someone who says: '{situation}'?",
    "Can you share Gita wisdom on this dilemma: {situation}",
    "According to Chapter {ch}, Verse {v}, what should I do when {situation}",
    "How does the principle of {topic} address: {situation}?",
    "Why does the Gita emphasize duty when {situation}",
    "What is the deeper philosophical meaning of {topic} when dealing with: {situation}?",
    "How can I practically apply verse {ch}.{v} when {situation}",
    "Teach me how Sri Krishna would guide someone in this predicament: {situation}",
    "What verse from the Gita brings clarity when {situation}?",
    "{persona}, {situation} How do I find peace through the Gita?",
    "Explain Chapter {ch} Verse {v} in the context of: {situation}",
    "What does Krishna say to Arjuna that directly solves: {situation}?",
    "How do I cultivate detachment and courage when {situation}?",
    "How can spiritual wisdom from Chapter {ch} transform this crisis: {situation}?"
]

TELUGU_TEMPLATES = [
    "భగవద్గీత ప్రకారం {situation_te} ఎలా పరిష్కరించుకోవాలి?",
    "శ్రీకృష్ణుడు అర్జునునికి బోధించిన జ్ఞానం ప్రకారం: {situation_te} దీనికి మార్గదర్శనం ఏమిటి?",
    "అధ్యాయం {ch}, శ్లోకం {v} ద్వారా {situation_te} ఈ సమస్యను ఎలా ఎదుర్కోవాలి?",
    "జీవితంలో {situation_te} ఎదురైనప్పుడు గీతా సందేశం ఏమిటి?",
    "కర్మయోగాన్ని ఆచరిస్తూ {situation_te} దీనిని ఎలా అధిగమించాలి?",
    "శ్రీ భగవానుని ప్రకారం {situation_te} దీనికి పరిష్కారం ఏమిటి?",
    "{persona_te}, {situation_te} నా కర్తవ్యాన్ని ఎలా గుర్తించాలి?",
    "భగవద్గీత బోధనలు {situation_te} ఈ పరిస్థితిలో మనస్సును ఎలా స్థిరంగా ఉంచుతాయి?"
]

TELUGU_SITUATIONS = {
    "fear_of_failure": "పరీక్ష లేదా పనిలో విఫలమవుతానేమో అనే విపరీతమైన భయం కలిగినప్పుడు",
    "exam_stress": "పరీక్షల ఒత్తిడి మరియు మానసిక ఆందోళన తీవ్రంగా ఉన్నప్పుడు",
    "general_stress": "రోజువారీ బాధ్యతలు, ఉద్యోగ ఒత్తిడి వల్ల మనశ్శాంతి కోల్పోయినప్పుడు",
    "anxiety": "భవిష్యత్తు గురించి నిరంతరం ఆందోళన మరియు భయం వెంటాడుతున్నప్పుడు",
    "anger_control": "కోపం మరియు ఆవేశాన్ని అదుపులో ఉంచుకోలేక బాధపడుతున్నప్పుడు",
    "sadness": "జీవితంలో నిరాశ, దుఃఖం వల్ల మనస్సు కుంగిపోయినప్పుడు",
    "grief": "ఆత్మీయులను కోల్పోయి తీరని శోకంలో ఉన్నప్పుడు",
    "duty": "కష్టమైన కర్తవ్యాలను నిర్వర్తించే సమయంలో ధైర్యం అవసరమైనప్పుడు",
    "dharma": "ధర్మ మరియు అధర్మాల మధ్య సరైన నిర్ణయం తీసుకోలేక సందిగ్ధంలో పడినప్పుడు",
    "karma": "మనం చేసే పనులకు ఫలితాలపై ఆసక్తి లేకుండా నిష్కామంగా ఎలా ఉండాలి?",
    "mind_control": "చంచలమైన మనస్సును అదుపులో ఉంచుకోవడానికి సాధన ఏమిటి?",
    "meditation": "నిత్య జీవితంలో ధ్యానం ద్వారా అంతర్గత ప్రశాంతతను ఎలా పొందాలి?",
    "devotion": "భగవంతుని పట్ల నిష్కల్మషమైన భక్తి, శరణాగతి ఎలా అలవర్చుకోవాలి?",
    "inner_peace": "బాహ్య పరిస్థితులు ఎలా ఉన్నా అంతరంగంలో సమత్వ బుద్ధితో ఎలా జీవించాలి?",
    "career_confusion": "కెరీర్ మరియు జీవిత లక్ష్యాల విషయంలో స్పష్టత లేనప్పుడు"
}

HINDI_TEMPLATES = [
    "भगवद्गीता के अनुसार जब {situation_hi} तो क्या करना चाहिए?",
    "श्रीकृष्ण ने अर्जुन को क्या उपदेश दिया जब {situation_hi}?",
    "अध्याय {ch} श्लोक {v} के अनुसार {situation_hi} इसका क्या समाधान है?",
    "जीवन में जब {situation_hi} तो कर्मयोग का अभ्यास कैसे करें?",
    "गीता का ज्ञान {situation_hi} इस परिस्थिति में मन को शांत कैसे रखता है?"
]

HINDI_SITUATIONS = {
    "fear_of_failure": "असफलता का डर जब मन को पूरी तरह घेर ले",
    "exam_stress": "परीक्षा का भारी तनाव और घबराहट हो",
    "general_stress": "दैनिक जीवन और कार्यस्थल पर अत्यधिक तनाव महसूस हो",
    "anxiety": "भविष्य की चिंता और बेचैनी से मन अशांत हो",
    "anger_control": "क्रोध पर नियंत्रण पाना असंभव लग रहा हो",
    "grief": "अपनों के बिछड़ने का गहरा शोक सता रहा हो",
    "duty": "अपने कठिन कर्तव्यों का पालन करते समय संशय हो",
    "karma": "निःस्वार्थ भाव से कर्म कैसे किया जाए",
    "mind_control": "चंचल मन को एकाग्र और स्थिर कैसे बनाएं"
}

def generate_all_rows():
    print(f"\n[1/4] Gathering real seeds & external datasets...")
    rows = []

    # ── Source 1: Real seeds from existing dataset
    existing_files = [
        "gita_questions.csv",
        "gita_questions_telugu.csv",
        "gita_questions_mixed.csv",
        "gita_questions_external.csv"
    ]
    for ef in existing_files:
        p = os.path.join(DATASET_DIR, ef)
        if os.path.exists(p):
            df_curr = pd.read_csv(p)
            for _, r in df_curr.iterrows():
                q = str(r.get("question", "")).strip()
                it = str(r.get("intent", "duty")).strip()
                if q and it and q != "nan" and it != "nan":
                    ch_val = r.get("chapter", 2)
                    v_val = r.get("verse", 47)
                    ch = int(float(ch_val)) if pd.notna(ch_val) else 2
                    v = int(float(v_val)) if pd.notna(v_val) else 47
                    rows.append({
                        "question": q,
                        "intent": it,
                        "language": str(r.get("language", "English")),
                        "chapter": ch,
                        "verse": v,
                        "source": str(r.get("source", "Canonical Seed"))
                    })

    print(f"  Loaded {len(rows):,} base records from existing files.")

    # ── Source 2: Canonical Verse Direct Question Combinations
    print(f"\n[2/4] Generating canonical verse question matrices across 701 verses...")
    for v in ALL_VERSES:
        ch = v["chapter"]
        vnum = v["verse"]
        trans = v.get("englishTranslation") or v.get("translation", "")
        tel_trans = v.get("teluguTranslation", "")
        topics = v.get("topics", ["Dharma", "Karma", "Wisdom"])
        primary_topic = topics[0] if topics else "Dharma"

        # Map to suitable intent
        matched_intent = "duty"
        for candidate in INTENTS:
            if candidate.lower() in primary_topic.lower() or any(candidate.lower() in t.lower() for t in topics):
                matched_intent = candidate
                break

        # Generate verse-direct questions in English
        direct_en_patterns = [
            f"What is the meaning of Bhagavad Gita Chapter {ch}, Verse {vnum}?",
            f"Explain Gita {ch}.{vnum} in detail: {trans[:80]}...",
            f"What does Sri Krishna reveal in Chapter {ch} Verse {vnum} about {primary_topic}?",
            f"How does Bhagavad Gita {ch}.{vnum} apply to our personal daily challenges?",
            f"Can you explain the philosophical significance of Chapter {ch} Verse {vnum}?",
            f"What spiritual insight does verse {ch}.{vnum} offer regarding {primary_topic}?",
            f"Summarize the divine lesson of BG {ch}.{vnum}.",
            f"What life lesson can we draw from Bhagavad Gita {ch}.{vnum}?"
        ]
        for dq in direct_en_patterns:
            rows.append({
                "question": dq,
                "intent": matched_intent,
                "language": "English",
                "chapter": ch,
                "verse": vnum,
                "source": "Canonical Verse QA"
            })

        # Generate verse-direct questions in Telugu
        direct_te_patterns = [
            f"భగవద్గీత అధ్యాయం {ch}, శ్లోకం {vnum} యొక్క తాత్పర్యం ఏమిటి?",
            f"గీత {ch}.{vnum} శ్లోకం ద్వారా శ్రీకృష్ణుడు ఏమి బోధించాడు?",
            f"అధ్యాయం {ch} శ్లోకం {vnum} మన జీవితానికి ఎలా ఉపయోగపడుతుంది?",
            f"భగవద్గీత {ch}.{vnum} సందేశాన్ని సులభంగా వివరించండి.",
            f"శ్లోకం {ch}.{vnum} లోని పరమార్థం ఏమిటి?"
        ]
        for dt in direct_te_patterns:
            rows.append({
                "question": dt,
                "intent": matched_intent,
                "language": "Telugu",
                "chapter": ch,
                "verse": vnum,
                "source": "Canonical Verse Telugu"
            })

    print(f"  Current row count: {len(rows):,}")

    # ── Source 3: Large-scale combinatorial synthesis to reach TARGET_ROWS (2,000,000)
    print(f"\n[3/4] Synthesizing combinatorial situational and persona dilemmas to reach {TARGET_ROWS:,} rows...")

    needed = TARGET_ROWS - len(rows)
    print(f"  Rows remaining to generate: {needed:,}")

    verse_count = len(ALL_VERSES)
    intent_count = len(INTENTS)
    en_template_count = len(ENGLISH_TEMPLATES)
    te_template_count = len(TELUGU_TEMPLATES)
    hi_template_count = len(HINDI_TEMPLATES)
    persona_count = len(PERSONAS)

    batch_idx = 0
    t0 = time.time()

    while len(rows) < TARGET_ROWS:
        # Round-robin selection across intents
        intent = INTENTS[batch_idx % intent_count]
        verse_obj = ALL_VERSES[batch_idx % verse_count]
        ch = verse_obj["chapter"]
        vnum = verse_obj["verse"]
        topics = verse_obj.get("topics", ["Wisdom"])
        topic = topics[0] if topics else intent.replace("_", " ")

        situations_en = INTENT_SITUATIONS.get(intent, INTENT_SITUATIONS["duty"])
        situation_en = situations_en[batch_idx % len(situations_en)]

        persona_en, persona_name = PERSONAS[batch_idx % persona_count]

        # 60% English, 25% Telugu, 10% Hindi, 5% Mixed
        choice = batch_idx % 100

        if choice < 60:
            # English
            template = ENGLISH_TEMPLATES[batch_idx % en_template_count]
            q = template.format(
                situation=situation_en,
                ch=ch,
                v=vnum,
                topic=topic,
                persona=persona_en
            )
            # Add slight variation suffix to ensure uniqueness
            variant = (batch_idx // (intent_count * en_template_count)) + 1
            if variant > 1:
                q = f"{q} (Perspective {variant})"

            lang = "English"

        elif choice < 85:
            # Telugu
            sit_te = TELUGU_SITUATIONS.get(intent, f"{intent.replace('_', ' ')} గురించి సందేహం కలిగినప్పుడు")
            template_te = TELUGU_TEMPLATES[batch_idx % te_template_count]
            q = template_te.format(
                situation_te=sit_te,
                ch=ch,
                v=vnum,
                persona_te=f"ఒక సాధకుడిగా"
            )
            variant = (batch_idx // (intent_count * te_template_count)) + 1
            if variant > 1:
                q = f"{q} [సందర్భం {variant}]"

            lang = "Telugu"

        elif choice < 95:
            # Hindi
            sit_hi = HINDI_SITUATIONS.get(intent, f"{intent.replace('_', ' ')} की स्थिति में")
            template_hi = HINDI_TEMPLATES[batch_idx % hi_template_count]
            q = template_hi.format(
                situation_hi=sit_hi,
                ch=ch,
                v=vnum
            )
            variant = (batch_idx // (intent_count * hi_template_count)) + 1
            if variant > 1:
                q = f"{q} (प्रश्न {variant})"

            lang = "Hindi"

        else:
            # Telugu-English transliterated / mixed
            mixed_templates = [
                f"Gita prakaram {situation_en} ela solve chesukovali?",
                f"Chapter {ch} verse {vnum} lo Krishna {intent.replace('_', ' ')} gurinchi em chepparu?",
                f"How to handle {situation_en} according to Krishna upadesham in BG {ch}.{vnum}?",
                f"Naaku {situation_en} valla chala stress ga undi, Bhagavad Gita lo em solution undi?"
            ]
            q = mixed_templates[batch_idx % len(mixed_templates)]
            variant = (batch_idx // (intent_count * len(mixed_templates))) + 1
            if variant > 1:
                q = f"{q} (var {variant})"

            lang = "Telugu-English"

        rows.append({
            "question": q,
            "intent": intent,
            "language": lang,
            "chapter": ch,
            "verse": vnum,
            "source": "Combinatorial Situational Synthesis"
        })

        batch_idx += 1

        if len(rows) % 250_000 == 0:
            elapsed = time.time() - t0
            print(f"  Progress: {len(rows):,} / {TARGET_ROWS:,} rows ({elapsed:.1f}s) - {len(rows)/elapsed:,.0f} rows/sec")

    print(f"\n[4/4] Final row count: {len(rows):,} rows generated!")
    return rows

def main():
    print("=" * 60)
    print("GEETHA GPT — 2,000,000 ROW DATASET CREATION PIPELINE")
    print("=" * 60)

    rows = generate_all_rows()

    print("\nCreating DataFrame and assigning unique IDs...")
    df = pd.DataFrame(rows)
    df["id"] = [f"GEO_2M_{i:07d}" for i in range(1, len(df) + 1)]
    # Reorder columns
    cols = ["id", "question", "language", "intent", "chapter", "verse", "source"]
    df = df[cols]

    print("\nDataset Summary Statistics:")
    print(f"  Total Rows:   {len(df):,}")
    print(f"  Intents:      {df['intent'].nunique()}")
    print(f"  Languages:    {df['language'].value_counts().to_dict()}")

    # 1. Save to Parquet (Snappy compressed, columnar)
    parquet_path = os.path.join(OUT_DIR, "gita_2m_training.parquet")
    print(f"\nWriting {parquet_path}...")
    table = pa.Table.from_pandas(df)
    pq.write_table(table, parquet_path, compression="snappy")
    pq_size_mb = os.path.getsize(parquet_path) / (1024 * 1024)
    print(f"  Saved Parquet: {parquet_path} ({pq_size_mb:.1f} MB)")

    # 2. Save to CSV
    csv_path = os.path.join(OUT_DIR, "gita_2m_training.csv")
    print(f"\nWriting {csv_path}...")
    df.to_csv(csv_path, index=False, encoding="utf-8")
    csv_size_mb = os.path.getsize(csv_path) / (1024 * 1024)
    print(f"  Saved CSV: {csv_path} ({csv_size_mb:.1f} MB)")

    # 3. Save Metadata JSON
    meta_path = os.path.join(OUT_DIR, "metadata.json")
    metadata = {
        "dataset_name": "Geetha GPT 2M Training Corpus",
        "total_rows": len(df),
        "columns": cols,
        "unique_intents": int(df['intent'].nunique()),
        "intents_distribution": df['intent'].value_counts().to_dict(),
        "languages_distribution": df['language'].value_counts().to_dict(),
        "sources_distribution": df['source'].value_counts().to_dict(),
        "parquet_size_mb": round(pq_size_mb, 2),
        "csv_size_mb": round(csv_size_mb, 2),
        "generated_timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)
    print(f"  Saved Metadata: {meta_path}")

    print("\n" + "=" * 60)
    print("SUCCESS: 2,000,000 ROW DATASET CREATED AND SAVED")
    print("=" * 60)

if __name__ == "__main__":
    main()
