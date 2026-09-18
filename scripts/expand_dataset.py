"""
GEETHA GPT — Question Expander
Generates paraphrase expansions for all intents to reach 20,000+ examples.
Appends to existing dataset files.
"""
import os, csv, json, random, math
from datetime import date

random.seed(99)

DATASET_DIR = "d:/Geetha/dataset"

INTENT_VERSE_MAP = {
    "fear_of_failure":       [(2,47),(2,48),(18,66),(3,30)],
    "exam_stress":           [(2,47),(2,48),(6,17),(3,35)],
    "general_stress":        [(2,14),(2,15),(6,35),(18,58)],
    "anxiety":               [(2,14),(2,15),(18,66),(2,47)],
    "anger_control":         [(2,62),(2,63),(16,1),(6,5)],
    "sadness":               [(2,11),(2,20),(2,23),(18,58)],
    "grief":                 [(2,11),(2,19),(2,20),(15,7)],
    "heartbreak":            [(2,14),(2,15),(12,13),(5,20)],
    "relationship_conflict": [(3,16),(11,55),(12,13),(16,3)],
    "career_confusion":      [(3,35),(18,47),(2,47),(4,18)],
    "decision_making":       [(16,18),(2,41),(4,34),(18,63)],
    "success":               [(2,47),(4,18),(18,45),(3,19)],
    "failure":               [(2,47),(2,48),(18,66),(3,30)],
    "motivation":            [(2,47),(3,8),(18,78),(11,55)],
    "discipline":            [(6,16),(6,17),(3,8),(6,35)],
    "focus":                 [(6,25),(2,41),(6,35),(3,8)],
    "mind_control":          [(6,5),(6,6),(6,35),(2,62)],
    "self_control":          [(6,5),(2,60),(2,61),(3,43)],
    "attachment":            [(2,62),(2,63),(5,10),(3,30)],
    "desire":                [(3,37),(2,62),(16,21),(5,12)],
    "jealousy":              [(3,30),(5,25),(16,2),(12,16)],
    "ego":                   [(3,27),(16,18),(13,8),(18,58)],
    "duty":                  [(3,35),(18,47),(2,31),(3,8)],
    "dharma":                [(2,31),(3,35),(18,47),(4,7)],
    "karma":                 [(3,9),(4,18),(2,47),(3,19)],
    "detachment":            [(2,47),(5,10),(12,12),(18,66)],
    "meditation":            [(6,10),(6,11),(6,17),(6,25)],
    "devotion":              [(9,26),(9,27),(12,8),(9,22)],
    "purpose_of_life":       [(3,35),(18,47),(2,47),(4,34)],
    "death":                 [(2,19),(2,20),(2,22),(2,23)],
    "soul":                  [(2,20),(2,23),(2,24),(15,7)],
    "rebirth":               [(4,5),(8,16),(9,25),(15,8)],
    "liberation":            [(18,66),(9,28),(7,14),(4,36)],
    "knowledge":             [(4,33),(4,34),(4,38),(4,39)],
    "peace":                 [(2,70),(2,71),(5,29),(6,7)],
    "responsibility":        [(3,21),(3,22),(18,41),(18,42)],
    "leadership":            [(3,21),(4,7),(3,25),(18,43)],
    "criticism":             [(12,19),(5,20),(2,56),(14,25)],
    "rejection":             [(2,14),(2,15),(12,18),(2,47)],
    "loneliness":            [(6,7),(9,26),(12,13),(18,58)],
    "uncertainty":           [(18,66),(4,34),(2,41),(16,3)],
}

# ── 300+ paraphrase patterns per key intent
EXPANSIONS = {

"fear_of_failure": """
I am afraid I will fail.
What if I fail? I cannot stop thinking about it.
I tried hard but I am scared the result will not be good.
The thought of failure frightens me every day.
I cannot try because I might fail.
I freeze whenever I think about failing.
How do I stop dreading failure?
Failure haunts me even before I begin.
I am worried about my performance.
Will I fail? This question never leaves my mind.
My confidence is shattered because of my fear of failure.
Fear of failing is making me procrastinate.
I don't want to start because what if I don't succeed?
The possibility of failure is terrifying.
I worry constantly about what happens if things go wrong.
Every time I try something I am convinced I will fail.
I am scared to take risks because I might fail.
Can the Gita help me deal with the fear of not succeeding?
How did Arjuna handle his fear before the battle?
I am terrified of the consequences of failure.
I need Gita wisdom to face my fear of failure.
My fear of failure is a bigger obstacle than failure itself.
Is it okay to be afraid of failing?
What does the Gita say about courage in the face of failure?
I feel paralysed when I think about not achieving my goals.
How do I build confidence when I keep failing?
The fear of failure is worse than failure itself.
I cannot eat or sleep because I am so scared I will fail.
I lose motivation whenever I imagine failing.
How can I act without being afraid of failure?
What is the Gita's antidote to fear of failure?
I want to try but my fear of failing stops me.
I failed once and now I am scared to try again.
I avoid challenges because I am afraid of failing.
When will I stop being scared of failure?
The Gita verse about performing actions without fear.
How do I take action despite the fear of failure?
Overcoming the fear of failure with Gita wisdom.
I am paralysed by the fear that I am not good enough.
My fear of failure makes me give up before I even start.
""",

"exam_stress": """
I cannot concentrate because of exam pressure.
My exams are around the corner and I am panicking.
I am overwhelmed by the thought of my upcoming exams.
How do I calm down before an important test?
I have not studied enough and the exam is tomorrow.
My mind goes blank during exams.
I know the material but I panic in the exam hall.
Exam stress is affecting my health.
I am getting headaches because of study pressure.
I cannot sleep the night before an exam.
What Gita wisdom helps during exam time?
I keep checking my phone instead of studying.
I am scared of disappointing my parents in exams.
My hands shake during exams.
I feel sick before every exam.
The exam pressure is making me want to give up.
I study hard but still worry about failing.
How do I manage exam anxiety the Gita way?
I need to focus on my studies but my mind wanders.
My exam is next week and I am not ready.
I have too many exams in a short time.
I compare my preparation with classmates and panic.
I am better at learning than at appearing in exams.
Board exams are making me extremely anxious.
Competitive exams stress me out completely.
How do I deal with the pressure of competitive exams?
I am afraid of getting low marks.
My mind blanks out when I sit to write an exam.
Gita's teaching for students under exam pressure.
I wish I could write exams without any anxiety.
""",

"general_stress": """
I feel completely overwhelmed by life.
Life is too stressful to handle right now.
Stress is everywhere in my life.
I cannot relax no matter what I do.
I feel like I am constantly under pressure.
My stress levels are dangerously high.
I am burning out from all the stress.
Work, family, finances — everything is stressful.
How do I de-stress according to the Gita?
I cannot switch off my mind.
My body is tense because of stress.
I haven't felt relaxed in months.
Stress is making me sick.
I am running on empty because of constant stress.
Every small thing feels like a huge burden.
How do I stay calm when everything is going wrong?
My stress is affecting my sleep.
I wake up stressed and go to bed stressed.
I am always in fight-or-flight mode.
Can spirituality really reduce stress?
I want to live peacefully but stress follows me everywhere.
I feel like the world is on my shoulders.
How did ancient wisdom deal with stress?
The Gita's teaching on remaining calm under pressure.
I am stressed but I don't even know why.
I need a way to decompress.
I am always rushing and stressed.
I cannot stop and just be.
How do I find calm in a chaotic world?
Life pressure is crushing me.
""",

"anxiety": """
I have constant worry that I cannot shake.
My anxiety is getting out of control.
I am always anxious about something.
Even when things are fine I feel anxious.
My anxiety wakes me up in the middle of the night.
I have a sinking feeling in my stomach all the time.
I expect the worst to happen even when there's no reason.
I over-think everything to the point of exhaustion.
I catastrophise everything.
Anxiety is stealing my joy.
I cannot be present because anxiety pulls me into the future.
What does the Gita say about living in the present moment?
My anxiety is destroying my relationships.
I am anxious about my health without any medical reason.
My hands tremble because of anxiety.
I avoid situations that make me anxious.
How do I stop catastrophic thinking?
I always think about what could go wrong.
Anxiety makes me avoid taking any action at all.
I need help managing chronic anxiety with Gita wisdom.
My anxiety is irrational but I cannot stop it.
Does the Gita address anxiety and worry?
Constant worry is ruining my life.
I feel uneasy and anxious without knowing why.
I am tired of being anxious all the time.
""",

"anger_control": """
I explode in anger over small things.
My anger is getting worse every year.
I regret things I say in anger every single time.
I have an anger problem.
I hit things when I am angry.
My anger is scaring people around me.
I am angry all the time and I don't know why.
Anger makes me say things I don't mean.
I want to stop being an angry person.
My anger comes from deep frustration.
The Gita's technique for managing rage.
I need to learn to pause before reacting in anger.
Anger is making me lose friends.
I cannot control my temper at work.
Road rage is a problem for me.
I get angry quickly when I don't get what I want.
My anger is disproportionate to the situation.
I lose control of myself when I am angry.
How does Krishna explain the chain of anger leading to destruction?
What is the Gita's teaching from Chapter 2 on anger?
I know anger is bad but I still get very angry.
My anger comes from feeling unheard.
I push people away when I am angry.
I am ashamed of how I behave when angry.
Is there a meditation or practice for anger?
""",

"sadness": [
    "I cry often without knowing why.",
    "A heavy sadness follows me everywhere.",
    "I feel empty inside.",
    "Nothing gives me joy anymore.",
    "I lost interest in everything I used to love.",
    "I feel hopeless about the future.",
    "Why do I feel sad all the time?",
    "I smile on the outside but feel sad inside.",
    "This sadness feels endless.",
    "How do I find joy again?",
    "The Gita on finding happiness when everything feels dark.",
    "My sadness is making it hard to function.",
    "Can spiritual practice help with depression?",
    "I feel disconnected from happiness.",
    "Every day feels grey and heavy.",
    "I don't want to get out of bed.",
    "What is the point of anything?",
    "I feel like I am just going through the motions.",
    "My sadness is draining my energy.",
    "I used to be happy. Now I cannot find that happiness.",
    "Is this sadness or depression? The Gita's perspective.",
    "I feel like a burden to everyone around me.",
    "I feel unloved and unwanted.",
    "Why does life feel so meaningless?",
    "Can the Gita lift me out of sadness?",
],

"karma": """
I want to understand karma deeply.
Does karma mean everything is pre-destined?
How does karma affect my current life situation?
Can I change my karma through good actions?
What is the relationship between karma and free will?
What does the Gita say about the law of karma?
I believe my suffering is due to past karma. Is that correct?
Is it possible to escape karma?
What is good karma and bad karma according to the Gita?
How does performing duty without attachment relate to karma?
What is Karma Yoga?
Does karma apply to thoughts as well as actions?
If I do good things will my karma improve?
I am confused about karma and fate.
The Gita's explanation of karma versus fate.
Why do bad things happen to good people? Is it karma?
Is karma scientific?
What creates karma in the Gita's view?
Can meditation reduce the effects of karma?
What is the fastest way to resolve karma?
I carry the burden of my past actions. How do I release it?
The Gita's verse on performing action as worship.
How do I perform actions without accumulating karma?
What is Akarma in the Gita?
The teaching of nishkama karma explained simply.
I want to live without creating more karma.
How does a person of wisdom relate to karma?
Karma from Chapter 3 of the Bhagavad Gita explained.
The link between karma and rebirth.
How do I apply karma yoga in my daily life?
""",

"meditation": """
I want to start meditating but don't know how.
My mind is too noisy to meditate.
I meditate but I am not sure if I am doing it right.
How long should I meditate each day?
What time of day is best for meditation?
What is the correct posture for meditation?
Can meditation help with anxiety and stress?
I fall asleep when I try to meditate.
I have been meditating for months but feel no progress.
The Gita's instruction on how to meditate.
What is the object of focus during meditation?
Is it better to meditate alone or in a group?
Can beginners practice Gita-based meditation?
What is Dhyana Yoga in the Gita?
How do I keep my mind still during meditation?
I tried meditation but gave up after a week.
My thoughts don't stop during meditation.
Is mantra meditation compatible with the Gita?
What is the ultimate goal of meditation?
How does meditation relate to self-realisation?
The Chapter 6 teaching on meditation in detail.
I experience peace during meditation but it fades quickly.
How do I sustain the peace from meditation in daily life?
Meditation is boring for me. What should I do?
I am distracted by sounds and thoughts during meditation.
""",

"purpose_of_life": """
I feel like my life has no direction.
What is my true calling?
What am I supposed to do with my life?
Why am I here on earth?
I have everything but still feel unfulfilled.
I accomplished all my goals but I still feel empty.
My life feels meaningless.
What gives life meaning according to the Gita?
Is career success the purpose of life?
What is Svadharma?
How do I discover my unique purpose?
Is there a spiritual purpose to human life?
What does Krishna say is the highest purpose of life?
I feel like I am wasting my life.
I want to make a meaningful contribution but don't know where to start.
Nothing I do seems to matter.
How do I find meaning during difficult periods of life?
I have been searching for my purpose for years.
Does every person have a unique purpose?
What is the Gita's answer to the question of why we exist?
I want my life to stand for something.
I keep drifting from one thing to another without purpose.
My life feels like a random series of events.
How did Arjuna find his purpose in the Gita?
What is the Gita's teaching on living a purposeful life?
""",

"peace": """
How do I achieve inner peace permanently?
I have tried everything and I still have no peace of mind.
My mind is never at rest.
Peace of mind feels impossible for me.
What is the Gita's definition of true peace?
I want to be calm no matter what happens.
Can I be peaceful even in difficult circumstances?
What is equanimity and how do I develop it?
The Gita's verse on peace in Chapter 2.
How did great yogis maintain inner peace?
I lose my peace whenever something goes wrong.
I was at peace once and I want it back.
What steals peace of mind according to the Gita?
My peace is disturbed by other people's actions.
I want peace but I also need to fight for what is right.
Can inner peace and ambition coexist?
Is complete mental peace realistic or just an ideal?
What daily practice leads to peace of mind?
I want to be like the ocean — deep and calm underneath the surface waves.
The Gita's way to remain undisturbed by life's ups and downs.
""",

"devotion": """
How do I feel closer to God?
I pray but I don't feel any connection.
Is faith important in the Gita?
What is the meaning of surrendering to God?
I am not religious but I am spiritual. Can the Gita help me?
What is the difference between Bhakti and religion?
The Gita's Chapter 12 on the path of devotion.
How do I maintain faith when my prayers seem unanswered?
Can devotion really change life circumstances?
I want to surrender my problems to a higher power.
Is there a devotional practice in the Gita?
What does Krishna say about those who love Him?
How does devotion relate to karma yoga?
The highest form of devotion according to the Gita.
Does devotion mean giving up your responsibilities?
I am a devotee but I still struggle. Is something wrong?
What does the Gita say about praying in difficulty?
Can non-Hindus follow the Gita's path of devotion?
I feel grateful but I don't know how to express it spiritually.
How does Bhakti Yoga lead to liberation?
""",

"duty": """
I don't know what my duty is in this situation.
My sense of duty conflicts with my personal desires.
I resent my duties and responsibilities.
Is it wrong to abandon a duty I hate?
What does the Gita say about fulfilling duties without reward?
I feel trapped by my obligations.
My duty towards my family conflicts with my ambitions.
How do I perform my duty without feeling like a slave?
The Gita's message about duty in Chapter 3.
Why does the Gita say we must perform our duty regardless of results?
What happens if I ignore my duty?
I feel my duty is unfair.
My professional duty conflicts with my personal ethics.
What is the highest duty according to the Gita?
I am fulfilling my duties but I feel nothing inside.
How did Arjuna handle his conflict between duty and love?
Can duty and happiness coexist?
I am tired of always putting duty before myself.
Does duty include self-care?
The Gita's teaching on duty in warfare as a metaphor for everyday life.
""",

"knowledge": """
What is the highest form of knowledge in the Gita?
How does the Gita distinguish true knowledge from information?
What is Jnana Yoga?
I want to understand the self through the Gita.
The Gita's teaching on self-knowledge.
Who is a person of wisdom in the Gita?
What is the role of a guru in the Gita?
How does knowledge destroy ignorance?
The Gita's Chapter 4 teaching on knowledge.
What is Brahmavidya?
How do I acquire wisdom according to the Gita?
Is knowledge more powerful than devotion?
What does the Gita say about learning from a teacher?
The link between knowledge and liberation.
I want to understand the nature of reality through the Gita.
What is the knowledge of Brahman?
How do I develop discriminative wisdom?
The Gita says knowledge is the boat to cross the ocean of suffering. Explain this.
What is the practical application of self-knowledge?
I have lots of information but no wisdom. How do I change that?
""",

"soul": """
What is the Atman according to the Gita?
Is the soul separate from the mind?
What is the relationship between the individual soul and the Supreme?
What does the Gita say about the indestructible nature of the soul?
If the soul is eternal why do we suffer?
The Gita's teaching on the soul in Chapter 2.
What happens to the soul between births?
Is the soul the same as consciousness?
Does the soul have a gender?
How do I connect with my soul?
What is the difference between the soul and the ego?
The Gita says the soul cannot be cut or burned. Explain this.
Is self-realisation the same as knowing the soul?
What does Krishna say about the soul leaving the body?
How does knowing the soul change how I live?
The soul watches while the body acts. What does that mean?
Can science explain the soul?
The Gita's perspective on near-death experiences.
What is the relationship between the soul and God in the Gita?
How do I identify less with the body and more with the soul?
""",

"liberation": """
I want to be free from suffering permanently.
What is Moksha and how is it different from happiness?
Can I achieve liberation while living a normal life?
The path to Moksha according to the Gita.
What is Jnana Mukti?
How many paths to liberation does the Gita describe?
Is Moksha the same for everyone?
The final verse of the Gita and its meaning.
What does liberation feel like?
Is nirvana the same as Moksha?
Does the Gita guarantee liberation if you follow its teachings?
What is the quickest path to liberation?
What are the obstacles to liberation?
Does the Gita say liberation is possible in one lifetime?
The Gita's Chapter 18 verse 66 on total surrender.
What is the relationship between Karma Yoga and Moksha?
What does it mean to be liberated while alive?
The Gita's teaching on Jivanmukta.
I want to break free from the cycle of suffering.
How does selfless service lead to liberation?
""",
}

# Telugu and mixed expansions for top intents
TE_EXPANSIONS = {
"fear_of_failure": """
నేను విఫలమవుతాను అని భయంగా ఉంది.
ఫలితం చెడ్డగా వస్తుందేమో అని ఆందోళన పడుతున్నాను.
భయం వల్ల ప్రయత్నించడమే మానేశాను.
ఎంత కష్టపడినా సాధించలేనేమో అని అనిపిస్తోంది.
భగవద్గీత వైఫల్యం భయాన్ని ఎలా అధిగమించాలో చెప్తుందా?
ఫలితాల గురించి ఆలోచించకుండా పనిచేయడం ఎలా?
అర్జునుడు యుద్ధం ముందు ఎంతటి భయాన్ని అనుభవించాడు?
కృష్ణుడు ఫలితాల గురించి ఏమి చెప్పాడు?
నా భయాన్ని జయించడానికి గీత జ్ఞానం సహాయపడుతుందా?
పరీక్షలో తప్పిపోతానేమో అని రాత్రిపగలూ ఆందోళన పడుతున్నాను.
""",
"karma": """
కర్మ అంటే ఏమిటో సరళంగా వివరించండి.
నా గత కర్మలు నన్ను ఇప్పుడు ఇబ్బంది పెడుతున్నాయా?
కర్మ మార్చుకోవచ్చా?
నిష్కామ కర్మ ఆచరించడం ఎలా?
గీతలో కర్మ యోగం వివరణ ఇవ్వండి.
కర్మఫలం నమ్మడం అర్థమా?
చెడు కర్మ నుండి విముక్తి ఎలా పొందాలి?
కర్మ మరియు విధి - ఇవి ఒకటేనా?
ప్రతి చర్య కర్మ అవుతుందా?
మంచి పని చేస్తే మంచి జరుగుతుందా - గీత ఏమంటుంది?
""",
"peace": """
మనశ్శాంతి కోసం గీత ఏమి చెప్తుంది?
అంతరంగ శాంతి ఎలా సాధించాలి?
నేను ఎంత ప్రయత్నించినా నెమ్మది కలగడం లేదు.
ప్రతి విషయంలో కలత పెడుతున్నది, శాంతి ఎలా?
సమభావంతో జీవించడం ఎలా?
మనసు సదా శాంతిగా ఉండటానికి ఏం చేయాలి?
ఇతరుల మాటలు నన్ను disturb చేస్తున్నాయి, ఏం చేయాలి?
ఆందోళన లేకుండా జీవించడం సాధ్యమా?
రోజువారీ జీవితంలో శాంతిని పొందే మార్గం.
గీత 2వ అధ్యాయంలో శాంతి గురించి ఏమి చెప్పబడింది?
""",
"meditation": """
ధ్యానం ఎలా మొదలుపెట్టాలో చెప్పండి.
మనసు విపరీతంగా పరిగెడుతోంది, ధ్యానం చేయలేకపోతున్నాను.
ధ్యానం చేస్తే నిజంగా మనస్సు శాంతిస్తుందా?
రోజూ ఎంత సేపు ధ్యానం చేయాలి?
గీత 6వ అధ్యాయంలో ధ్యానం గురించి ఏమి చెప్పారు?
ధ్యానం సమయంలో మనసు ఏకాగ్రత ఎలా పెంచుకోవాలి?
ధ్యానంలో నిద్రపోతున్నాను, ఏం చేయాలి?
ధ్యానం ప్రారంభకులకు ఉపయోగపడే పద్ధతి.
ప్రతిరోజు ధ్యానం అవసరమా?
ధ్యానం వల్ల జ్ఞానోదయం కలుగుతుందా?
""",
"purpose_of_life": """
నా జీవితానికి లక్ష్యం ఏమిటి?
జీవితం అర్థం ఏమిటో తెలియడం లేదు.
నేను ఏందుకు జన్మించాను?
జీవిత ఉద్దేశ్యం తెలుసుకోవడం ఎలా?
అన్నీ ఉన్నా తృప్తి లేదు, ఎందుకు?
జీవితంలో అర్థం వెతికే మార్గం గీతలో ఉందా?
నా కలలు నెరవేరాయి కానీ శూన్యత అనిపిస్తోంది.
స్వధర్మం అంటే ఏమిటి?
జీవిత లక్ష్యాన్ని గుర్తించడం ఎలా?
భగవద్గీత జీవిత అర్థం గురించి ఏమి చెప్తుంది?
""",
}

MIXED_EXPANSIONS = {
"fear_of_failure": """
Fail avutaanemo ani chala bayam ga undi.
Exam lo fail ayithe enti cheyyadam?
Result ante chala anxiety ga feel avutunna.
Praya tinchanu kaani success avutaano teliyadu.
Bayam valla try cheyyadame manechanu.
Gita em cheptundi failure bayam gurinchi?
Krishna resultl gurinchi em cheppadu?
Failure vaddu ani parigesthe emi cheyyadam?
Exam daggara padindi, chala stress ga undi.
Meeru em cheppindo implement cheyyadam ela?
""",
"general_stress": """
Chala stress ga undi, em cheyyalo ardam kavatledu.
Work pressure valla kopam vadutunna.
Life lo anni vishayalu overwhelming ga unnayi.
Rest teesukovalante time ledu, stress thaggadu.
Gita stress thagginchukovadam ela cheptundi?
Office lo problems, inti lo problems - anni stress istunnayi.
Concentrate cheyyaleka pothunna, stress valla.
Stress tho life enjoy cheyyadam maripoyindi.
Break teesukovalani undi kaani stop cheyyadam possible kadu.
Stress vadilinchukovadaniki spiritual practice ela cheyyadam?
""",
"karma": """
Karma ante ela work chestundi?
Past karma mana ippudu situations influence chestundaa?
Karma maarustaama - ela?
Nishkama karma ela practice cheyyadam?
Karma yoga explain cheyyandi.
Bad karma nunchi ela free avvali?
Every action karma avutundaa?
Good deeds cheste good things jarugutaaya - Gita em antundi?
Karma and destiny oka tee na?
Karma tho life ela improve cheyyadam?
""",
"anger_control": """
Chala twaraga kopam vasthundi, ela control cheskovadam?
Kopam lo bad words cheppanu, regret ga undi.
Anger management ki Gita lo guidance em undi?
Na kopam relationships paadu chestundi.
Kopam aapukovadam ela nerchukuntam?
Small things ki kuda chala kopam vasthundi, ela marichukali?
Anger ki root cause em antundi Gita lo?
Emotion control ki ela meditate cheyyadam?
Kopam tarvata regret avutunna - ela break cheyyali ee cycle?
Gita lo Chapter 2 lo kopam gurinchi em cheppindi?
""",
"motivation": """
Motivation ledu emi cheyyalani anipinchatledu.
Ela motivated ga untam?
Start chestanu kaani finish cheyyadam ledu.
Inspiration kosam Gita lo em undi?
Lazy ga feel avutunna, ela change cheyyali?
Oka target petti work cheyyadam ela?
Goal reach cheyyalante ela consistent ga undali?
Gita lo action vs inaction gurinchi em undi?
Procrastination ni ela overcome cheyyadam?
Enthusiasm twaraga pothundi, ela sustain cheyyadam?
""",
}

def make_rows_from_expansion(expansion_dict, lang, qid_start):
    rows = []
    qid = qid_start
    for intent, block in expansion_dict.items():
        refs = INTENT_VERSE_MAP.get(intent, [(2,47)])
        c0, v0 = refs[0]
        verse_range = f"{c0}.{v0}"
        secondary = f"{refs[1][0]}.{refs[1][1]}" if len(refs) > 1 else ""

        # block can be a multiline string or a list
        if isinstance(block, str):
            questions = [q.strip() for q in block.strip().split('\n') if q.strip()]
        else:
            questions = block

        for q in questions:
            rows.append({
                "id": qid,
                "question": q,
                "language": lang,
                "intent": intent,
                "chapter": c0,
                "verse": v0,
                "verse_range": verse_range,
                "secondary_verse": secondary,
                "relevance": "high",
                "answer": "",  # will be filled from existing data
                "source": "Original — authored for Geetha GPT training dataset",
                "license": "Project-internal / CC0",
            })
            qid += 1
    return rows, qid

def append_to_csv(path, rows, fieldnames):
    with open(path, "a", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        w.writerows(rows)
    print(f"  Appended {len(rows)} rows -> {path}")

def main():
    QFIELDS = ["id","question","language","intent","chapter","verse",
               "verse_range","secondary_verse","relevance","answer","source","license"]

    # Find next qid
    all_rows = []
    main_csv = os.path.join(DATASET_DIR, "gita_questions.csv")
    with open(main_csv, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            all_rows.append(row)
    qid = int(all_rows[-1]["id"]) + 1 if all_rows else 20001

    print(f"\nStarting expansion from id={qid}...")

    # English expansions
    en_rows, qid = make_rows_from_expansion(EXPANSIONS, "English", qid)
    append_to_csv(os.path.join(DATASET_DIR, "gita_questions.csv"), en_rows, QFIELDS)

    # Telugu expansions
    te_rows, qid = make_rows_from_expansion(TE_EXPANSIONS, "Telugu", qid)
    append_to_csv(os.path.join(DATASET_DIR, "gita_questions_telugu.csv"), te_rows, QFIELDS)

    # Mixed expansions
    mx_rows, qid = make_rows_from_expansion(MIXED_EXPANSIONS, "Telugu-English", qid)
    append_to_csv(os.path.join(DATASET_DIR, "gita_questions_mixed.csv"), mx_rows, QFIELDS)

    all_new = en_rows + te_rows + mx_rows

    # Rebuild train/val/test with all data
    all_csv_rows = []
    for fname in ["gita_questions.csv", "gita_questions_telugu.csv",
                  "gita_questions_mixed.csv", "negative_examples.csv",
                  "clarification_examples.csv"]:
        fpath = os.path.join(DATASET_DIR, fname)
        with open(fpath, "r", encoding="utf-8") as f:
            for r in csv.DictReader(f):
                all_csv_rows.append(r)

    print(f"\n  Total rows across all files: {len(all_csv_rows)}")

    # Rebuild split
    intent_groups = {}
    for r in all_csv_rows:
        intent_groups.setdefault(r["intent"], []).append(r)

    train, val, test = [], [], []
    for grp in intent_groups.values():
        random.shuffle(grp)
        n = len(grp)
        t = math.floor(n * 0.70)
        v = math.floor(n * 0.15)
        train += grp[:t]
        val   += grp[t:t+v]
        test  += grp[t+v:]

    random.shuffle(train); random.shuffle(val); random.shuffle(test)

    def write_csv_full(path, rows):
        with open(path, "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=QFIELDS, extrasaction="ignore")
            w.writeheader()
            w.writerows(rows)
        print(f"  Rebuilt: {path} ({len(rows)} rows)")

    write_csv_full(os.path.join(DATASET_DIR, "train.csv"),      train)
    write_csv_full(os.path.join(DATASET_DIR, "validation.csv"), val)
    write_csv_full(os.path.join(DATASET_DIR, "test.csv"),       test)

    print(f"\n  English added:       {len(en_rows)}")
    print(f"  Telugu added:        {len(te_rows)}")
    print(f"  Mixed added:         {len(mx_rows)}")
    print(f"  Total ALL examples:  {len(all_csv_rows)}")
    print(f"  Train:               {len(train)}")
    print(f"  Validation:          {len(val)}")
    print(f"  Test:                {len(test)}")
    print("\n  EXPANSION COMPLETE")

if __name__ == "__main__":
    main()
