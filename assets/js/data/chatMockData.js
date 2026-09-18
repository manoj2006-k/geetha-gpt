/**
 * Geetha GPT - Chat Mock Dataset & Intelligent Response Engine
 * Realistic AI dialogues, multi-step thought disclosure, embedded verse citations,
 * and dynamic keyword matching engine in English and Telugu.
 */

import { VERSES_DATA } from './versesData.js';

export const CHAT_SUGGESTIONS = [
  {
    en: "I am afraid of failing my exams.",
    te: "నాకు పరీక్షల్లో విఫలమవుతాననే భయం ఉంది.",
    topic: "fear"
  },
  {
    en: "How can I control sudden anger at people?",
    te: "నాకు వచ్చే తీవ్రమైన కోపాన్ని ఎలా అదుపు చేసుకోవాలి?",
    topic: "anger"
  },
  {
    en: "What does Krishna say about true success?",
    te: "నిజమైన విజయం గురించి శ్రీకృష్ణుడు ఏమి చెప్పాడు?",
    topic: "success"
  },
  {
    en: "How should I handle stress and burnout?",
    te: "తీవ్రమైన మానసిక ఒత్తిడిని ఎలా తగ్గించుకోవాలి?",
    topic: "stress"
  },
  {
    en: "How to focus a restless and wandering mind?",
    te: "చంచలమైన మనస్సును ఎలా ఏకాగ్రత వైపు తిప్పాలి?",
    topic: "discipline"
  },
  {
    en: "How do I overcome heartbreak and relationship pain?",
    te: "బంధాలలో కలిగే బాధ, మోసాన్ని ఎలా తట్టుకోవాలి?",
    topic: "relationships"
  }
];

export const MOCK_CONVERSATIONS = [
  {
    id: "exam-fear",
    matchKeywords: ["exam", "exams", "fail", "failing", "test", "study", "marks", "grade", "పరీక్ష", "విఫలం", "భయం"],
    thoughtProcess: {
      en: "Analyzing seeker's state of performance anxiety...\nCross-referencing Chapter 2 (Sankhya Yoga), specifically Verse 47 on detached duty...\nFormulating guidance on segregating controllable effort from future outcome...\nSynthesizing actionable study mental models...",
      te: "పరీక్షల భయంతో బాధపడుతున్న మనస్సును విశ్లేషిస్తున్నాను...\nసాంఖ్య యోగం (అధ్యాయం 2, శ్లోకం 47) నిష్కామ కర్మ సిద్ధాంతంతో అనుసంధానిస్తున్నాను...\nఫలితంపై చింత వీడి సన్నద్ధతపై దృష్టి పెట్టే విధంగా మార్గదర్శకత్వాన్ని రూపొందిస్తున్నాను..."
    },
    response: {
      en: "Fear of outcomes creates mental noise that directly degrades your ability to concentrate on the work in front of you.\n\nThe Bhagavad Gita teaches us that anxiety is born when we obsess over future results rather than the integrity of our present actions. When you enter an examination hall or prepare your syllabus, your sacred duty is 100% effort and craftsmanship. The final marks are governed by multiple cosmic and external variables that do not belong to you.\n\nBy releasing the burden of 'What if I fail?', you free up immense cognitive energy for memory, clarity, and calm execution.",
      te: "ఫలితంపై భయం మనస్సులో అశాంతిని సృష్టించి, చదువుపై ఏకాగ్రతను దెబ్బతీస్తుంది.\n\nభగవద్గీత మనకు బోధించే ప్రధాన సత్యం: మన చేతుల్లో ఉన్నది శ్రమించడం మాత్రమే, ఫలితం కాదు. పరీక్షల్లో విజయం వస్తుందా లేదా అనే భయాన్ని పక్కనబెట్టి, ప్రస్తుతం చేయాల్సిన అధ్యయనంపై సంపూర్ణ దృష్టిని కేంద్రీకరించాలి.\n\nభయాన్ని వీడినప్పుడే జ్ఞాపకశక్తి, మానసిక స్పష్టత అద్భుతంగా పనిచేస్తాయి."
    },
    verseId: "2-47",
    actionSteps: {
      en: [
        "Focus solely on understanding the current chapter or problem without calculating your hypothetical GPA.",
        "Take 5 deep breaths before studying to reset your nervous system into clarity.",
        "Say to yourself: 'My duty is sincere preparation. I surrender the results to Krishna.'"
      ],
      te: [
        "మార్కుల గురించి అతిగా ఆలోచించకుండా ప్రస్తుత పాఠ్యాంశాన్ని శ్రద్ధగా అర్థం చేసుకోండి.",
        "చదువు ప్రారంభించే ముందు 5 సార్లు ప్రశాంతంగా దీర్ఘశ్వాస తీసుకోండి.",
        "'శ్రమించడం నా కర్తవ్యం, ఫలితాన్ని భగవంతునికి అర్పిస్తున్నాను' అని మనస్సులో దృఢంగా అనుకోండి."
      ]
    }
  },
  {
    id: "anger-control",
    matchKeywords: ["anger", "angry", "rage", "temper", "furious", "irritated", "కోపం", "ఆవేశం", "క్రోధం"],
    thoughtProcess: {
      en: "Evaluating anger psychodynamics in the Gita...\nConsulting Chapter 2, Verses 62-63 (Ladder of Fall: Attachment -> Kama -> Krodha -> Moha -> Buddhi Nasha)...\nSynthesizing steps to preserve the intellect (Buddhi) from destruction...",
      te: "కోపం పుట్టే మానసిక ప్రక్రియను పరిశీలిస్తున్నాను...\nఅధ్యాయం 2 (శ్లోకాలు 62-63) లోని కామం నుండి క్రోధం, క్రోధం నుండి బుద్ధినాశనం సిద్ధాంతాన్ని పరిశీలిస్తున్నాను...\nఆవేశాన్ని అణచివేసే మార్గాలను సిద్ధం చేస్తున్నాను..."
    },
    response: {
      en: "Anger is not an isolated explosion; it is the child of frustrated desires and unmet expectations.\n\nWhen we intensely attach our happiness to people behaving exactly as we want, any deviation triggers rage. Krishna warns that anger blinds our memory, shatters our intellect (Buddhi), and causes irreparable damage to relationships and self-worth.\n\nMastery is not in suppressing anger after it boils, but in observing the attachment that birthed it.",
      te: "కోపం అకస్మాత్తుగా రాదు; మన కోరికలు, అంచనాలు నెరవేరనప్పుడు అది పుడుతుంది.\n\nఇతరులు మనకు నచ్చినట్లే ప్రవర్తించాలని ఆశించినప్పుడు కోపం వస్తుంది. శ్రీకృష్ణుడు హెచ్చరించినట్లు కోపం మనిషి వివేకాన్ని నాశనం చేస్తుంది, ఆవేశంలో తీసుకునే నిర్ణయాలు జీవితాన్ని పతనం చేస్తాయి.\n\nకోపం వచ్చినప్పుడు స్పందించకుండా క్షణం ఆలోచించడమే వివేకం."
    },
    verseId: "2-63",
    actionSteps: {
      en: [
        "Implement a strict 60-second silence rule whenever you feel provoked.",
        "Ask: 'What hidden expectation was disappointed that is making me angry?'",
        "Refuse to make major decisions or send messages while the emotional storm is raging."
      ],
      te: [
        "కోపం వచ్చినప్పుడు కనీసం ఒక నిమిషం పాటు పూర్తిగా మౌనంగా ఉండండి.",
        "'నా కోపానికి అసలైన కారణం ఏమిటి?' అని మిమ్మల్ని మీరు ప్రశ్నించుకోండి.",
        "ఆవేశంలో ఎలాంటి సందేశాలు పంపకండి, ముఖ్యమైన నిర్ణయాలు తీసుకోకండి."
      ]
    }
  },
  {
    id: "restless-mind",
    matchKeywords: ["focus", "mind", "wandering", "distracted", "distraction", "meditation", "discipline", "మనస్సు", "ఏకాగ్రత", "చంచలం"],
    thoughtProcess: {
      en: "Reflecting on Arjuna's struggle with mind control in Chapter 6 (Atma Samyama Yoga)...\nRetrieving Krishna's dual remedy: Abhyasa (Practice) and Vairagya (Detachment)...\nStructuring guidance on incremental focus cultivation...",
      te: "అధ్యాయం 6 (ఆత్మసంయమ యోగం) లో అర్జునుని మనోచాంచల్య ప్రశ్నను సమీక్షిస్తున్నాను...\nశ్రీకృష్ణుని దివ్య సమాధానం: 'అభ్యాసం' మరియు 'వైరాగ్యం' మార్గాలను సేకరిస్తున్నాను...\nనిరంతర సాధనతో ఏకాగ్రత పెంచుకునే మార్గాన్ని సూచిస్తున్నాను..."
    },
    response: {
      en: "Even Arjuna—the greatest warrior on earth—confessed that taming the mind felt as difficult as catching the raging wind. You are not alone in this battle.\n\nLord Krishna assured him that the mind can certainly be mastered using two wings: **Abhyasa** (patient, persistent daily practice) and **Vairagya** (releasing craving for distractions).\n\nWhenever the mind wanders away, do not be angry with yourself. Gently bring it back to your present task, again and again.",
      te: "గాండీవధారి అయిన అర్జునుడు కూడా 'మనస్సును అదుపు చేయడం గాలిని బంధించినంత కష్టం' అని వాపోయాడు. కాబట్టి మీ పోరాటం సహజమైనదే.\n\nఅయితే శ్రీకృష్ణుడు రెండు అద్భుతమైన మార్గాలను చూపించాడు: **అభ్యాసం** (నిరంతర సాధన) మరియు **వైరాగ్యం** (వృథా విషయాలపై ఆసక్తి తగ్గించుకోవడం).\n\nమనస్సు చెదిరిపోయిన ప్రతిసారీ విసుక్కోకుండా, ఓర్పుతో దాన్ని మళ్ళీ పనిపైకి మళ్లించండి."
    },
    verseId: "6-35",
    actionSteps: {
      en: [
        "Practice the Pomodoro technique: 25 minutes of single-task focus followed by 5 minutes of rest.",
        "Notice mind-wandering with curiosity rather than guilt, then gently guide attention back.",
        "Keep digital notifications strictly silenced during periods of deep work."
      ],
      te: [
        "ఒకేసారి ఒకే పనిపై 25 నిమిషాల పాటు పూర్తి దృష్టి పెట్టండి.",
        "మనస్సు పక్కకు వెళ్లినప్పుడు ఆందోళన చెందకుండా శాంతంగా తిరిగి పనిపై నిలపండి.",
        "ముఖ్యమైన పనులు చేసేటప్పుడు మొబైల్ నోటిఫికేషన్లను సైలెంట్ చేయండి."
      ]
    }
  },
  {
    id: "stress-burnout",
    matchKeywords: ["stress", "stressed", "burnout", "tired", "exhausted", "overwhelmed", "pressure", "ఒత్తిడి", "అలసట", "భారం"],
    thoughtProcess: {
      en: "Synthesizing ocean-mind philosophy from Chapter 2, Verse 70...\nExamining the detachment from dualities of heat/cold, pleasure/pain in Chapter 2, Verse 14...\nFormulating restorative spiritual principles...",
      te: "సముద్రం వంటి నిశ్చల మనస్సు (అధ్యాయం 2, శ్లోకం 70) సిద్ధాంతాన్ని సమీక్షిస్తున్నాను...\nసుఖదుఃఖాలు అనిత్యమైనవనే భావనను క్రోడీకరిస్తున్నాను...\nఒత్తిడి నివారణకు ప్రశాంతమైన దృక్పథాన్ని అందిస్తున్నాను..."
    },
    response: {
      en: "Stress occurs when we carry yesterday's regrets and tomorrow's anxieties into today's fragile vessel.\n\nThe Gita compares the wise soul to the vast ocean: countless rivers of demands and pressures flow into it day and night, yet the ocean remains steady, majestic, and unperturbed.\n\nYou do not need to eliminate work; you need to change your internal relationship with work by treating each action as a joyful offering rather than an existential race.",
      te: "గతించిన బాధలు, రేపటి గురించిన భయాలను నేటిపై మోపినప్పుడే ఒత్తిడి పుడుతుంది.\n\nభగవద్గీతలో స్థితప్రజ్ఞుడిని సముద్రంతో పోల్చారు: ఎన్నో నదులు నిరంతరం వచ్చి చేరినా సముద్రం ఎలా నిశ్చలంగా ఉంటుందో, అలాగే సమస్యలు ఎన్ని వచ్చినా ధీరుడు చలించడు.\n\nపనిని భారంగా భావించకుండా, సంతోషంతో ఒక కర్తవ్యంగా నిర్వర్తించండి."
    },
    verseId: "2-70",
    actionSteps: {
      en: [
        "Separate your self-worth from your daily to-do checklist.",
        "Spend 10 minutes in silent contemplation or prayer at dawn or dusk.",
        "Practice saying 'no' to non-essential commitments that scatter your energy."
      ],
      te: [
        "పనుల ఒత్తిడి మీ వ్యక్తిగత శాంతిని దెబ్బతీయకుండా చూసుకోండి.",
        "ఉదయం లేదా సాయంత్రం 10 నిమిషాలు ప్రశాంతంగా ధ్యానం చేయండి.",
        "అనవసరమైన విషయాలకు దూరంగా ఉంటూ మీ శక్తిని కాపాడుకోండి."
      ]
    }
  },
  {
    id: "heartbreak-relationships",
    matchKeywords: ["relationship", "heartbreak", "love", "breakup", "betrayal", "friend", "attachment", "బంధం", "ప్రేమ", "మోసం", "స్నేహం"],
    thoughtProcess: {
      en: "Analyzing attachment and possessiveness in relationships...\nReferencing Chapter 12, Verse 13 on universal friendliness (Maitri) and non-possessiveness (Nirmama)...\nOffering solace on spiritual self-completeness...",
      te: "అనుబంధాలు, మమకారాల వల్ల కలిగే బాధను విశ్లేషిస్తున్నాను...\nఅధ్యాయం 12, శ్లోకం 13 (అద్వేష్టా సర్వభూతానాం మైత్రః కరుణ ఏవ చ) ఆధారంగా వివరణ...\nఆత్మ సంతృప్తి మరియు క్షమాగుణం వైపు మార్గదర్శకత్వం..."
    },
    response: {
      en: "Much of relationship heartache comes not from love, but from possessive attachment (Moha). When we look to another mortal human being to provide the ultimate validation and completeness that only our inner divinity can give, disappointment is inevitable.\n\nTrue spiritual love is friendly (Maitra), compassionate (Karuna), and free from possessiveness (Nirmama). Forgive those who hurt you—not necessarily because they deserve it, but because your soul deserves peace.",
      te: "బంధాలలో వచ్చే ఎక్కువ బాధ ప్రేమ వల్ల కాదు, అతిగా సొంతం చేసుకోవాలనే మమకారం (మోహం) వల్ల వస్తుంది.\n\nమన పరిపూర్ణత మనలోనే ఉంది. నిజమైన ప్రేమలో స్వార్థం, ఆధిపత్యం ఉండవు; స్నేహం, కరుణ మాత్రమే ఉంటాయి. మీకు అన్యాయం చేసినవారిని క్షమించండి—మీ మనశ్శాంతి కోసం వారిని వదిలిపెట్టండి."
    },
    verseId: "12-13",
    actionSteps: {
      en: [
        "Send silent forgiveness and blessings to people who caused you grievance.",
        "Cultivate self-completeness through spiritual reading and connection with the Divine.",
        "Remember: people enter our lives for a season, reason, or cosmic lesson."
      ],
      te: [
        "బాధ కలిగించినవారి పట్ల ద్వేషాన్ని వీడి మనస్సును తేలిక చేసుకోండి.",
        "మిమ్మల్ని మీరు ప్రేమించుకోండి; ఆత్మవిశ్వాసాన్ని కోల్పోకండి.",
        "ప్రతి అనుభవం మనకు ఒక మంచి పాఠాన్ని నేర్పుతుందని గుర్తించండి."
      ]
    }
  },
  {
    id: "success-meaning",
    matchKeywords: ["success", "achieve", "goal", "winning", "wealth", "ambition", "విజయం", "లక్ష్యం", "గెలుపు", "సంపద"],
    thoughtProcess: {
      en: "Analyzing the Gita's formula for ultimate success...\nSynthesizing the synthesis in Chapter 18, Verse 78 (Yatra Yogeshwarah Krishno yatra Partho Dhanurdharah)...\nBalancing ethical vision with vigorous execution...",
      te: "భగవద్గీతలోని విజయ సూత్రాన్ని విశ్లేషిస్తున్నాను...\nఅధ్యాయం 18, శ్లోకం 78 (యత్ర యోగేశ్వరః కృష్ణో యత్ర పార్థో ధనుర్ధరః) ఆధారంగా మార్గదర్శకత్వం...\nజ్ఞానం మరియు శ్రమల కలయిక ప్రాధాన్యతను వివరిస్తున్నాను..."
    },
    response: {
      en: "The Bhagavad Gita presents the ultimate equation for undeniable victory: the synthesis of **divine wisdom/vision** (represented by Lord Krishna) and **flawless, dedicated human effort** (represented by the archer Arjuna).\n\nSuccess is not merely accumulating trophies, but becoming a master of your craft while maintaining moral integrity and tranquility of spirit. When your ambition serves a noble purpose, victory (Vijaya) and prosperity (Shri) naturally follow.",
      te: "భగవద్గీత అద్భుతమైన విజయ సూత్రాన్ని అందించింది: **దివ్య జ్ఞానం** (శ్రీకృష్ణుడు) మరియు **నిరంతర శ్రమ/నైపుణ్యం** (అర్జునుడు) కలిసిన చోట విజయం, సంపద, అభ్యుదయం తప్పక ఉంటాయి.\n\nవిజయం అంటే కేవలం ధన సంపాదన మాత్రమే కాదు; నైతిక విలువలతో కూడిన కృషి ద్వారా సమాజానికి మేలు చేయడమే అసలైన సార్థకత."
    },
    verseId: "18-78",
    actionSteps: {
      en: [
        "Align every big project with ethical principles and clear purpose.",
        "Master the technical execution of your work with relentless dedication.",
        "Treat setbacks as analytical feedback rather than personal defeats."
      ],
      te: [
        "మీ ప్రతి లక్ష్యాన్ని మంచి సంకల్పంతో, నిజాయితీతో ప్రారంభించండి.",
        "మీ రంగంలో నైపుణ్యాన్ని నిరంతరం మెరుగుపరుచుకోండి.",
        "అడ్డంకులను చూసి భయపడకుండా దృఢ సంకల్పంతో ముందడుగు వేయండి."
      ]
    }
  }
];

/**
 * Intelligent client-side fallback query responder
 */
export function getGeethaGPTResponse(query, lang = 'en') {
  const cleanQuery = query.toLowerCase().trim();
  
  // Find best pre-indexed conversation match
  for (const conv of MOCK_CONVERSATIONS) {
    if (conv.matchKeywords.some(kw => cleanQuery.includes(kw.toLowerCase()))) {
      return {
        thought: conv.thoughtProcess[lang] || conv.thoughtProcess.en,
        response: conv.response[lang] || conv.response.en,
        verse: VERSES_DATA.find(v => v.id === conv.verseId) || VERSES_DATA[0],
        actionSteps: conv.actionSteps[lang] || conv.actionSteps.en
      };
    }
  }

  // Dynamic fallback matching from verses database
  let matchedVerse = VERSES_DATA[0]; // Default 2-47
  
  if (cleanQuery.includes("soul") || cleanQuery.includes("death") || cleanQuery.includes("immortal") || cleanQuery.includes("చావు") || cleanQuery.includes("ఆత్మ")) {
    matchedVerse = VERSES_DATA.find(v => v.id === "2-14") || VERSES_DATA[0];
  } else if (cleanQuery.includes("surrender") || cleanQuery.includes("god") || cleanQuery.includes("bhakti") || cleanQuery.includes("శరణు") || cleanQuery.includes("భక్తి")) {
    matchedVerse = VERSES_DATA.find(v => v.id === "18-66") || VERSES_DATA[0];
  } else if (cleanQuery.includes("duty") || cleanQuery.includes("work") || cleanQuery.includes("karma") || cleanQuery.includes("కర్తవ్యం") || cleanQuery.includes("పని")) {
    matchedVerse = VERSES_DATA.find(v => v.id === "3-19") || VERSES_DATA[0];
  } else if (cleanQuery.includes("peace") || cleanQuery.includes("calm") || cleanQuery.includes("శాంతి")) {
    matchedVerse = VERSES_DATA.find(v => v.id === "2-70") || VERSES_DATA[0];
  } else if (cleanQuery.includes("lead") || cleanQuery.includes("example") || cleanQuery.includes("నాయకుడు")) {
    matchedVerse = VERSES_DATA.find(v => v.id === "3-21") || VERSES_DATA[0];
  }

  if (lang === 'te') {
    return {
      thought: `మీ ప్రశ్నకు సంబంధించిన దివ్య తత్వాన్ని విశ్లేషిస్తున్నాను...\nభగవద్గీతలోని సనాతన ధర్మ సూత్రాలతో సమన్వయం చేస్తున్నాను...\nఅధ్యాయం ${matchedVerse.chapter}, శ్లోకం ${matchedVerse.verse} ఆధారంగా మార్గదర్శకత్వాన్ని సిద్ధం చేస్తున్నాను...`,
      response: `మీరు అడిగిన ప్రశ్నకు భగవద్గీత శాశ్వతమైన జ్ఞానాన్ని అందిస్తుంది.\n\nజీవితంలో ఏ సంక్షోభం ఎదురైనా, బాహ్య పరిస్థితుల కంటే మన అంతర్గత స్పందనే ప్రధానం. శ్రీకృష్ణుడు అర్జునుడికి ఉపదేశించినట్లు, మోహాన్ని మరియు అయోమయాన్ని వీడి, మన కర్తవ్యంపై నిలబడటమే అన్ని సమస్యలకు పరిష్కారం.\n\nభగవద్గీతలోని ఈ క్రింది శ్లోకం మీ పరిస్థితికి దివ్య మార్గదర్శకంగా నిలుస్తుంది:`,
      verse: matchedVerse,
      actionSteps: [
        "పరిస్థితిని ప్రశాంతంగా, నిష్పాక్షికంగా పరిశీలించండి.",
        "భగవద్గీత శ్లోకాన్ని మననం చేస్తూ మనస్సును దృఢపరచుకోండి.",
        "ధర్మబద్ధమైన చర్యను ధైర్యంగా ప్రారంభించండి."
      ]
    };
  }

  return {
    thought: `Reflecting upon seeker's inquiry: "${query}"...\nConsulting the core philosophy of Bhagavad Gita on life navigation...\nSynthesizing relevant insights from Chapter ${matchedVerse.chapter}, Verse ${matchedVerse.verse}...`,
    response: `The Bhagavad Gita addresses the deep undercurrent of your question with timeless psychological clarity.\n\nEvery human crossroad invites us to elevate our consciousness above reactive emotion into the sanctuary of wisdom (Buddhi Yoga). Rather than being overwhelmed by circumstantial turbulence, anchor your awareness in your eternal duty and highest integrity.\n\nConsider this illuminating verse directly spoken by Lord Krishna:`,
    verse: matchedVerse,
    actionSteps: [
      "Pause and observe your thoughts from the perspective of an inner calm witness (Sakshi).",
      "Reflect on the verse above and apply its wisdom to your immediate challenge.",
      "Take one constructive, selfless step forward with clarity and faith."
    ]
  };
}

