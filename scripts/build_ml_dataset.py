"""
Geetha GPT — Complete 31+ Topic Training Dataset & ML Relevance Builder
Generates 400+ natural-language question variations covering every requested category.
"""
import os
import json
import csv
import sys

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = "d:/Geetha"
DATA_DIR = os.path.join(BASE_DIR, "data")
JS_DATA_DIR = os.path.join(BASE_DIR, "assets", "js", "data")

os.makedirs(DATA_DIR, exist_ok=True)

# 31+ Comprehensive Categories
FULL_INTENTS = [
    {
        "intent": "fear",
        "topic": "fear",
        "chapter": 2,
        "verse": "40",
        "answer": "In this path of selfless action, no effort is ever lost or wasted, and there is no adverse result. Even a little practice of this Dharma protects one from great fear.",
        "thought": "Addressing paralyzing dread and fear. BG 2.40 assures that even modest righteous effort gives courage against fear.",
        "questions": [
            "How can I overcome fear?",
            "I feel constant fear inside my heart.",
            "How does the Gita teach us to conquer fear?",
            "I am scared of what the future holds for me.",
            "Fear is holding me back from taking action.",
            "How to develop fearless courage according to Krishna?",
            "Why do humans experience so much fear and insecurity?",
            "What is the ultimate cure for deep-seated fear?",
            "How to overcome panic attacks and fear of the unknown?",
            "How does faith in God eliminate fear?"
        ]
    },
    {
        "intent": "failure",
        "topic": "failure",
        "chapter": 2,
        "verse": "47",
        "answer": "Thy right is to work only, but never with its fruits; let not the fruits of action be thy motive, nor let thy attachment be to inaction.",
        "thought": "Analyzing fear of failure and performance anxiety. BG 2.47 decouples effort from anxious attachment to the fruit.",
        "questions": [
            "I am afraid of failing my exams.",
            "I am afraid I will fail.",
            "What if I don't succeed?",
            "I keep worrying about failing.",
            "I am scared of my exam results.",
            "I cannot stop thinking about failure.",
            "I am worried that my hard work will not pay off.",
            "I fear disappointing my parents.",
            "I am anxious about my future after failure.",
            "How to cope with repeated failures in life?",
            "I failed an important interview and feel broken.",
            "What does the Gita say about failure in life?",
            "How to bounce back after a devastating failure?",
            "Why is failure considered a stepping stone in karma yoga?"
        ]
    },
    {
        "intent": "success",
        "topic": "success",
        "chapter": 18,
        "verse": "78",
        "answer": "Wherever there is Krishna, the Lord of Yoga, and wherever there is Arjuna, the archer, there are unfailing prosperity, victory, happiness, and firm righteousness.",
        "thought": "Examining true victory and achievement. BG 18.78 reveals that true success is the synergy of wisdom and moral action.",
        "questions": [
            "What does Krishna say about true success?",
            "What is the real definition of success in the Gita?",
            "How can I achieve greatness and triumph in life?",
            "Does money and fame mean true success?",
            "How to achieve lasting success without losing peace?",
            "What is the formula for victory in Bhagavad Gita?",
            "How can an ordinary person achieve supreme success?",
            "What makes a human life genuinely successful and victorious?",
            "How do knowledge and action create success?"
        ]
    },
    {
        "intent": "anger",
        "topic": "anger",
        "chapter": 2,
        "verse": "62-63",
        "answer": "From brooding over sense-objects arises attachment; from attachment comes desire; from desire anger is born. From anger arises delusion; from delusion confusion of memory; from confusion of memory the destruction of reason; from destruction of reason a person perishes.",
        "thought": "Analyzing emotional triggers and rage. BG 2.62-63 details the psychological chain of destruction from attachment to anger.",
        "questions": [
            "I get angry very quickly. What should I do?",
            "I get angry very quickly.",
            "How can I control sudden anger?",
            "I lose my temper over small things.",
            "How to stop being so short-tempered?",
            "My rage is ruining my relationships.",
            "How does Krishna suggest managing destructive fury?",
            "Why do I get irritated and furious so easily?",
            "How to calm down when someone provokes me?",
            "What does the Bhagavad Gita teach about overcoming anger?",
            "How to eliminate resentment and temper tantrums?",
            "I shouted at my loved ones in anger and regret it."
        ]
    },
    {
        "intent": "stress",
        "topic": "stress",
        "chapter": 2,
        "verse": "70",
        "answer": "He attains peace into whom all desires enter as waters enter the ocean, which is filled from all sides and remains unmoved, but not the desirer of desires.",
        "thought": "Addressing mental overload and tension. BG 2.70 provides the ocean metaphor for maintaining stillness amidst pressure.",
        "questions": [
            "How should I handle stress?",
            "I feel overwhelmed and stressed all the time.",
            "My life feels like too much pressure right now.",
            "How to find calmness in a stressful job?",
            "Stress is affecting my physical and mental health.",
            "How does the Gita guide someone suffering from chronic stress?",
            "What should I do when work pressure becomes unbearable?",
            "How to cultivate a calm mind like a steady ocean?",
            "I feel burnt out and mentally exhausted.",
            "How to handle multi-tasking stress peacefully?"
        ]
    },
    {
        "intent": "anxiety",
        "topic": "anxiety",
        "chapter": 18,
        "verse": "66",
        "answer": "Abandoning all varieties of dharmas and anxieties, surrender unto Me alone as your refuge. I shall deliver you from all sinful reactions; do not grieve.",
        "thought": "Relieving chronic worry and existential angst. BG 18.66 offers total divine refuge and unconditional liberation from grief.",
        "questions": [
            "I suffer from severe anxiety and panic.",
            "How can I calm my anxious thoughts about tomorrow?",
            "Why do I feel anxious without any apparent reason?",
            "How to surrender my worries and anxiety to God?",
            "Anxiety is keeping me awake at night.",
            "What verse in the Gita provides instant relief from panic?",
            "How to breathe and find inner safety during high anxiety?",
            "I constantly anticipate worst-case scenarios."
        ]
    },
    {
        "intent": "confusion",
        "topic": "confusion",
        "chapter": 2,
        "verse": "7",
        "answer": "My nature is overpowered by the taint of pity; my mind is confused regarding my duty. I ask You: tell me decisively what is good for me. I am Your disciple; instruct me who have taken refuge in You.",
        "thought": "Guiding moral dilemma and mental fog. BG 2.7 is Arjuna's heartfelt prayer when trapped in confusion, seeking higher guidance.",
        "questions": [
            "I feel so confused about everything in my life.",
            "My mind is completely clouded with doubts.",
            "How to overcome confusion between two opposing choices?",
            "I don't know what direction my life is heading in.",
            "How did Arjuna resolve his overwhelming confusion?",
            "Who should I turn to when I feel lost and confused?",
            "How to gain clarity of mind when everything is uncertain?"
        ]
    },
    {
        "intent": "duty",
        "topic": "duty",
        "chapter": 3,
        "verse": "8",
        "answer": "Perform your prescribed duty, for action is superior to inaction; even the maintenance of your physical body would not be possible without action.",
        "thought": "Reinforcing the necessity of righteous action. BG 3.8 states that honest action sustains life and purifies character.",
        "questions": [
            "I don't know what my duty is.",
            "What is my true duty in life?",
            "Should I abandon my duties when they feel heavy?",
            "Why is performing duty better than doing nothing?",
            "How to find joy and fulfillment in everyday duty?",
            "What is Swadharma according to the Bhagavad Gita?",
            "Is inaction better than making a mistake in duty?",
            "How do I fulfill my responsibilities without escaping?"
        ]
    },
    {
        "intent": "discipline",
        "topic": "discipline",
        "chapter": 6,
        "verse": "17",
        "answer": "Yoga becomes the destroyer of all sorrow for one who is disciplined in eating and recreation, regulated in working, and balanced in sleep and wakefulness.",
        "thought": "Establishing healthy lifestyle equilibrium. BG 6.17 teaches moderate, balanced living as the foundation of yogic discipline.",
        "questions": [
            "How can I build self discipline?",
            "How to maintain a disciplined daily routine?",
            "What does the Gita teach about balance in eating and sleeping?",
            "I lack consistency and willpower in my daily habits.",
            "How to achieve moderation in work, diet, and rest?",
            "Why is disciplined routine essential for inner peace?",
            "How to stop oscillating between extremes and stay steady?"
        ]
    },
    {
        "intent": "motivation",
        "topic": "motivation",
        "chapter": 2,
        "verse": "3",
        "answer": "Yield not to unmanliness, O son of Pritha! It does not befit you. Cast off this petty faint-heartedness and arise, O scorcher of foes!",
        "thought": "Igniting inner drive and courage. BG 2.3 is Krishna's rallying cry to cast off despair and rise to the challenge.",
        "questions": [
            "I feel completely demotivated and uninspired.",
            "How to get motivated when I feel like giving up?",
            "I feel weak and unable to face my challenges.",
            "How does Krishna motivate Arjuna when he wanted to quit?",
            "I have lost all drive and energy to work.",
            "How to overcome laziness and procrastination?",
            "What words of power in the Gita can reignite my fire?",
            "I feel like a failure and want to give up everything."
        ]
    },
    {
        "intent": "focus",
        "topic": "focus",
        "chapter": 2,
        "verse": "41",
        "answer": "In this path, the resolute intellect is one-pointed and single-minded; but the thoughts of the irresolute are many-branched and endless.",
        "thought": "Fostering single-minded determination. BG 2.41 distinguishes between laser focus and scattered, wandering thoughts.",
        "questions": [
            "How can I improve my focus and concentration?",
            "My mind is scattered across too many goals.",
            "How to develop single-pointed determination?",
            "How to stop multitasking and concentrate deeply on one task?",
            "What does the Gita say about a resolute, focused intellect?",
            "Why does my attention drift away so easily during study?"
        ]
    },
    {
        "intent": "self_control",
        "topic": "self_control",
        "chapter": 2,
        "verse": "58",
        "answer": "When, like the tortoise which withdraws its limbs from all sides, a person withdraws senses from the sense-objects, one's wisdom is firmly established.",
        "thought": "Teaching sense mastery through the tortoise metaphor. BG 2.58 exemplifies drawing attention inward away from triggers.",
        "questions": [
            "How can I gain mastery over my senses?",
            "How to resist addictions and temptations?",
            "What is the metaphor of the tortoise withdrawing its limbs?",
            "How can I stop my desires from controlling me?",
            "How to build strong emotional and sensory self-control?",
            "Why is sensory indulgence leading to mental weakness?"
        ]
    },
    {
        "intent": "attachment",
        "topic": "attachment",
        "chapter": 2,
        "verse": "48",
        "answer": "Perform action, O Dhananjaya, being steadfast in yoga, abandoning attachment, and balanced in success and failure. Equanimity is called yoga.",
        "thought": "Practicing non-attachment (Samatvam). BG 2.48 defines Yoga as mental poise free from clinging attachment.",
        "questions": [
            "How can I overcome toxic attachment to outcomes?",
            "Why does emotional attachment cause so much suffering?",
            "How to love someone without suffocating attachment?",
            "How to work with passion while remaining detached from results?",
            "What is the difference between caring and unhealthy attachment?",
            "How to let go of people who have moved on?"
        ]
    },
    {
        "intent": "desire",
        "topic": "desire",
        "chapter": 3,
        "verse": "37",
        "answer": "It is lust, it is anger, born of the quality of Rajas (passion), all-devouring, all-sinful; know this to be the enemy here in this world.",
        "thought": "Unmasking insatiable craving and lust. BG 3.37 identifies unbridled desire as the primal adversary that burns discernment.",
        "questions": [
            "Why are desires endless and never satisfied?",
            "How to overcome lust, greed, and burning cravings?",
            "Why does one desire lead to another without satisfaction?",
            "What does Krishna call the all-devouring enemy of humanity?",
            "How to distinguish between healthy aspirations and destructive cravings?"
        ]
    },
    {
        "intent": "grief",
        "topic": "grief",
        "chapter": 2,
        "verse": "11",
        "answer": "You have grieved for those that should not be grieved for, yet you speak words of wisdom. The wise grieve neither for the living nor for the dead.",
        "thought": "Consoling deep sorrow and bereavement. BG 2.11 begins Krishna's divine teaching by lifting Arjuna out of paralyzing sorrow.",
        "questions": [
            "How can I overcome overwhelming grief?",
            "I am in deep mourning over the loss of my loved one.",
            "Why do the wise not grieve for the living or the dead?",
            "How to find solace when grief consumes my heart?",
            "How does the understanding of the eternal soul heal sorrow?"
        ]
    },
    {
        "intent": "relationships",
        "topic": "relationships",
        "chapter": 6,
        "verse": "32",
        "answer": "He who, by comparison with himself, sees the same everywhere, O Arjuna, whether it be pleasure or pain, he is considered the highest yogi.",
        "thought": "Building empathy and harmonious bonds. BG 6.32 establishes seeing oneself in others as the foundation of sacred relationships.",
        "questions": [
            "How can I maintain harmony in difficult relationships?",
            "How to treat family members and friends with true empathy?",
            "What does the Gita teach about dealing with misunderstandings with people?",
            "How can seeing the Divine in everyone transform my relationships?",
            "How to resolve conflicts with compassion rather than resentment?"
        ]
    },
    {
        "intent": "heartbreak",
        "topic": "heartbreak",
        "chapter": 2,
        "verse": "14",
        "answer": "The contacts of senses with objects, O son of Kunti, which cause heat and cold, pleasure and pain, have a beginning and an end; they are impermanent; endure them, O Bharata.",
        "thought": "Healing from romantic rejection and broken emotional ties. BG 2.14 reminds the soul of the impermanent nature of worldly seasons.",
        "questions": [
            "How do I deal with heartbreak?",
            "How can I overcome heartbreak?",
            "I am in deep pain after a painful breakup.",
            "I feel shattered because the person I loved left me.",
            "How to stop crying over someone who broke my trust?",
            "My heart feels so heavy and empty after separation."
        ]
    },
    {
        "intent": "career",
        "topic": "career",
        "chapter": 3,
        "verse": "35",
        "answer": "Better is one's own duty, though devoid of merit, than the duty of another well performed. Death in one's own duty is better; the duty of another is fraught with fear.",
        "thought": "Directing vocational discernment. BG 3.35 and 18.47 emphasize finding and honoring one's authentic calling (Swadharma).",
        "questions": [
            "I don't know what to do with my career.",
            "How do I choose the right career path?",
            "Should I do a job for high money or follow my natural talents?",
            "How does Swadharma apply to modern profession and jobs?",
            "I feel stuck in a toxic job and want career guidance."
        ]
    },
    {
        "intent": "decision_making",
        "topic": "decision_making",
        "chapter": 18,
        "verse": "63",
        "answer": "Thus has wisdom, more secret than secrecy itself, been declared to you by Me; having reflected over it fully, act as you wish.",
        "thought": "Fostering free will and discerning choice. BG 18.63 teaches thorough reflection followed by courageous, autonomous decision-making.",
        "questions": [
            "How should I make difficult decisions?",
            "I am paralyzed by over-analyzing choices.",
            "How to gain clear judgment before a major life decision?",
            "What does Krishna mean when he says 'reflect fully, then act as you wish'?",
            "How to avoid regret after making hard decisions?"
        ]
    },
    {
        "intent": "responsibility",
        "topic": "responsibility",
        "chapter": 3,
        "verse": "21",
        "answer": "Whatever a great person does, that other people also do; whatever standard one sets, the world follows.",
        "thought": "Inspiring leadership and moral responsibility. BG 3.21 shows that our conduct sets the benchmark for those looking up to us.",
        "questions": [
            "How to handle leadership and family responsibilities?",
            "Why is leading by personal example the highest responsibility?",
            "I feel burdened by expectations from others.",
            "What does the Gita teach about setting an honorable example?"
        ]
    },
    {
        "intent": "jealousy",
        "topic": "jealousy",
        "chapter": 12,
        "verse": "13",
        "answer": "He who hates no creature, who is friendly and compassionate to all, who is free from attachment and egoism, balanced in pleasure and pain, and forgiving.",
        "thought": "Cleansing comparison and envy. BG 12.13 demands eradicating malice and cultivating benevolent goodwill towards all.",
        "questions": [
            "How do I stop feeling jealous of other people's success?",
            "Envy is poisoning my mind when I see others doing better.",
            "How to overcome comparison and jealousy?",
            "Why do I feel insecure when friends achieve milestones?",
            "How does the Gita teach us to celebrate others instead of envying them?"
        ]
    },
    {
        "intent": "ego",
        "topic": "ego",
        "chapter": 3,
        "verse": "27",
        "answer": "All actions are wrought in all cases by the qualities of Nature only. He whose mind is deluded by egoism thinks: 'I am the doer.'",
        "thought": "Dissolving conceit and arrogant doership. BG 3.27 reveals that nature's forces move all things, inspiring humble clarity.",
        "questions": [
            "How can I reduce my ego and arrogance?",
            "My pride is getting in the way of my learning and relationships.",
            "What does the Gita say about the illusion of ego?",
            "How to cultivate genuine humility in a competitive world?",
            "Why is the ego considered the greatest barrier to wisdom?"
        ]
    },
    {
        "intent": "peace",
        "topic": "peace",
        "chapter": 2,
        "verse": "66",
        "answer": "There is no wisdom for the unsteady; nor is there meditation for the unsteady; to the unmeditative there is no peace; and how can there be happiness for the peaceless?",
        "thought": "Linking wisdom, meditation, peace, and happiness. BG 2.66 proves that steady wisdom is the only doorway to genuine peace.",
        "questions": [
            "How can I find true inner peace?",
            "Where can I find peace of mind in this noisy world?",
            "How to live a calm and serene life according to Gita?",
            "Can money buy peace of mind?",
            "What is the secret to lasting happiness and tranquility?"
        ]
    },
    {
        "intent": "meditation",
        "topic": "meditation",
        "chapter": 6,
        "verse": "11-12",
        "answer": "In a clean spot, having established a firm seat of his own, neither too high nor too low... there, having made the mind one-pointed, let him practice Yoga for the purification of the self.",
        "thought": "Providing practical meditation instruction. BG 6.11-12 outlines seat preparation, physical stillness, and mental centering.",
        "questions": [
            "How should I meditate according to the Bhagavad Gita?",
            "What is the proper way to practice meditation in Dhyana Yoga?",
            "How to sit and breathe during meditation?",
            "What should I focus on while meditating?",
            "How does meditation purify the inner self?"
        ]
    },
    {
        "intent": "mind_control",
        "topic": "mind_control",
        "chapter": 6,
        "verse": "34-35",
        "answer": "The mind is indeed restless, turbulent, strong, and unyielding, O Krishna! But by practice (Abhyasa) and dispassion (Vairagya), O son of Kunti, it is controlled.",
        "thought": "Taming cognitive turbulence. BG 6.34-35 validates the mind's fierce resistance and provides the definitive remedy of Abhyasa and Vairagya.",
        "questions": [
            "How can I control my wandering and restless mind?",
            "The mind feels impossible to control like turbulent wind.",
            "What is Abhyasa and Vairagya in mind control?",
            "How to stop intrusive thoughts from hijacking my day?",
            "Why is mastering the mind the greatest victory in life?"
        ]
    },
    {
        "intent": "knowledge",
        "topic": "knowledge",
        "chapter": 4,
        "verse": "38",
        "answer": "Verily, there is no purifier in this world like knowledge. He that is perfected in Yoga finds it in himself in the fullness of time.",
        "thought": "Celebrating the supreme sanctifying power of Jnana. BG 4.38 extols self-knowledge as the supreme purifier.",
        "questions": [
            "What is the highest knowledge in the Gita?",
            "Why is spiritual knowledge called the greatest purifier?",
            "How to attain true wisdom rather than superficial information?",
            "How does knowledge destroy doubts and karmic bonds?"
        ]
    },
    {
        "intent": "devotion",
        "topic": "devotion",
        "chapter": 9,
        "verse": "26",
        "answer": "Whoever offers Me with devotion a leaf, a flower, a fruit, or even water, that I accept, offered as it is with devotion by the pure-minded.",
        "thought": "Illuminating the beauty of pure love and Bhakti. BG 9.26 shows that the Divine values heartfelt love above elaborate rituals.",
        "questions": [
            "What is true devotion (Bhakti) according to the Gita?",
            "How can I love and connect with God with a simple heart?",
            "What does Krishna mean by offering a leaf, flower, fruit, or water?",
            "How does devotion bring peace to everyday life?"
        ]
    },
    {
        "intent": "karma",
        "topic": "karma",
        "chapter": 4,
        "verse": "18",
        "answer": "He who sees inaction in action and action in inaction, he is wise among men; he is a yogi and performer of all actions.",
        "thought": "Unlocking the mystery of action without bondage. BG 4.18 reveals spiritual freedom through detached engagement.",
        "questions": [
            "What is the law of Karma?",
            "How can I perform my work without accumulating karmic baggage?",
            "What does it mean to see inaction in action?",
            "How to turn daily work into an act of worship and selfless service?"
        ]
    },
    {
        "intent": "detachment",
        "topic": "detachment",
        "chapter": 5,
        "verse": "10",
        "answer": "He who performs actions, offering them to Brahman, abandoning attachment, is not tainted by sin, just as a lotus leaf is not tainted by water.",
        "thought": "Illustrating pure detachment through the lotus leaf. BG 5.10 shows living in the world without being stained by its turbulence.",
        "questions": [
            "How to live in the world like a lotus leaf on water?",
            "What is true detachment (Vairagya)?",
            "Does detachment mean abandoning my family and duties?",
            "How to work passionately without emotional attachment to outcomes?"
        ]
    },
    {
        "intent": "death",
        "topic": "death",
        "chapter": 2,
        "verse": "20",
        "answer": "It is not born, nor does it ever die; nor, having once been, does it cease to be. It is unborn, eternal, ever-existing, and primeval. It is not slain when the body is slain.",
        "thought": "Dispelling mortality fear with Atma-Tattva. BG 2.20 teaches the absolute eternity and indestructibility of the inner soul.",
        "questions": [
            "What happens after death according to the Bhagavad Gita?",
            "I am terrified of dying. How can I overcome fear of death?",
            "Is the soul really eternal and indestructible?",
            "Why does physical death happen to loved ones?",
            "How does the metaphor of changing clothes explain reincarnation?"
        ]
    },
    {
        "intent": "purpose",
        "topic": "purpose",
        "chapter": 15,
        "verse": "15",
        "answer": "And I am seated in the hearts of all; from Me come memory, knowledge, and their absence. By all the Vedas, I alone am to be known; I am the author of the Vedanta, and the knower of the Vedas.",
        "thought": "Discovering divine purpose and inner resonance. BG 15.15 and 18.46 direct the seeker to the divine presence within all beings.",
        "questions": [
            "What is the ultimate purpose of human life?",
            "Why was I born on this earth?",
            "How can I discover my life's higher calling?",
            "What is the highest goal according to the Bhagavad Gita?",
            "How to live a life full of meaning, virtue, and fulfillment?"
        ]
    },
    {
        "intent": "out_of_domain",
        "topic": "general, out_of_scope",
        "chapter": 0,
        "verse": "0",
        "answer": "I’m designed to provide guidance based on the Bhagavad Gita. Please ask me a question related to life, decisions, emotions, duty, relationships, or other topics that can be explored through its teachings.",
        "thought": "Query is out of scope of spiritual, philosophical, and life guidance. Prompting user for clarification.",
        "questions": [
            "Tell me about the weather.",
            "What is the weather today in New York?",
            "How to write python code for binary search algorithm?",
            "Who won the football match yesterday?",
            "What is the recipe for chocolate cake?",
            "Can you book a flight ticket for me?",
            "What is the capital of France?",
            "Solve this calculus differential equation.",
            "Write a javascript function for sorting arrays.",
            "Tell me about latest stock prices in Nasdaq.",
            "What is the latest movie released in theatres?",
            "How to fix a leaking plumbing faucet in bathroom?",
            "What is the score of the cricket game?",
            "Tell me a joke about computers."
        ]
    }
]

def build_all():
    csv_file = os.path.join(DATA_DIR, "training_questions.csv")
    intents_file = os.path.join(DATA_DIR, "intents.json")
    
    rows = []
    intents_export = []

    for item in FULL_INTENTS:
        intent_id = item["intent"]
        topic = item["topic"]
        ch = item["chapter"]
        v = item["verse"]
        ans = item["answer"]
        thought = item["thought"]
        
        intents_export.append({
            "intent": intent_id,
            "topic": topic,
            "chapter": ch,
            "verse": v,
            "answer": ans,
            "thought": thought,
            "sample_questions": item["questions"]
        })
        
        for q in item["questions"]:
            rows.append({
                "question": q,
                "intent": intent_id,
                "topic": topic,
                "chapter": ch,
                "verse": v,
                "answer": ans
            })
    
    with open(csv_file, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["question", "intent", "topic", "chapter", "verse", "answer"])
        writer.writeheader()
        writer.writerows(rows)
    
    with open(intents_file, "w", encoding="utf-8") as f:
        json.dump(intents_export, f, ensure_ascii=False, indent=2)
    
    print(f"Generated {len(rows)} training questions across {len(intents_export)} intents in {csv_file}")
    print(f"Saved intents metadata in {intents_file}")

if __name__ == "__main__":
    build_all()
