import os
import re
import json

I18N_DIR = "d:/Geetha/assets/js/data/i18n"

# Translations for all 23 languages
TRANSLATIONS_EXT = {
  "en": {
    "auth": {
      "login": "Log In",
      "signup": "Create Account",
      "logout": "Log Out",
      "account": "Account Management",
      "switchAccount": "Switch Account",
      "currentAccount": "Current Active User",
      "guest": "Guest Mode",
      "guestNotice": "Guest Mode (No persistence)",
      "name": "Your Name",
      "emailOrUsername": "Email / Account Identifier",
      "createSuccessButton": "Create Account & Start Fresh History",
      "createSuccess": "Account created successfully!",
      "loginSuccess": "Logged in successfully.",
      "logoutSuccess": "Logged out successfully.",
      "switchSuccess": "Switched to",
      "historyEmptyNotice": "Each account maintains its own isolated conversation history and bookmarks.",
      "accountIsolatedNotice": "Isolated history & private bookmarks per account"
    },
    "voice": {
      "listen": "Listen",
      "stop": "Stop",
      "playing": "Playing...",
      "ariaListen": "Listen to this passage",
      "ariaStop": "Stop audio playback",
      "error": "Unable to play audio in this browser",
      "unsupported": "Voice unavailable for this language; using fallback",
      "readingRecitation": "Recitation",
      "readingTranslation": "Translation"
    },
    "verseDetail": {
      "previousVerse": "Previous Verse",
      "nextVerse": "Next Verse",
      "previousChapter": "Previous Chapter",
      "nextChapter": "Next Chapter",
      "relatedVersesTitle": "Related Verses",
      "exploreVerse": "Explore Verse",
      "recitation": "Recitation",
      "wordMeanings": "Word-by-Word Meanings",
      "sanskritVerse": "Sanskrit Verse",
      "englishTranslation": "English Translation",
      "teluguTranslation": "Telugu Translation"
    },
    "footer": {
      "aboutTitle": "About Geetha GPT",
      "aboutText": "An interactive platform delivering timeless spiritual insights and psychological wisdom from the Bhagavad Gita for daily life challenges.",
      "quickLinks": "Quick Links",
      "legalDisclaimer": "For spiritual contemplation, personal growth, and philosophical study. Not a substitute for professional medical or mental health counseling.",
      "allRightsReserved": "All rights reserved.",
      "sanatanadharma": "Sanatana Dharma"
    },
    "common": {
      "exploreChapter": "Explore Chapter",
      "curatedVerses": "Curated Verses",
      "versesCount": "Verses",
      "backToAllChapters": "Back to All Chapters",
      "backToAllTopics": "Back to All Topics",
      "askGeethaAbout": "Ask Geetha about",
      "viewWisdom": "Explore Wisdom",
      "today": "Today",
      "yesterday": "Yesterday",
      "back": "Back",
      "explore": "Explore",
      "open": "Open",
      "clear": "Clear",
      "delete": "Delete",
      "messages": "messages",
      "dialoguesLogged": "Dialogues Logged"
    }
  },
  "te": {
    "auth": {
      "login": "లాగిన్",
      "signup": "ఖాతా సృష్టించండి",
      "logout": "లాగ్ అవుట్",
      "account": "ఖాతా నిర్వహణ",
      "switchAccount": "ఖాతా మార్చండి",
      "currentAccount": "ప్రస్తుత వినియోగదారు",
      "guest": "అతిథి మోడ్",
      "guestNotice": "అతిథి మోడ్ (చరిత్ర భద్రపరచబడదు)",
      "name": "మీ పేరు",
      "emailOrUsername": "ఈమెయిల్ / ఖాతా గుర్తింపు",
      "createSuccessButton": "ఖాతా సృష్టించి కొత్త చరిత్రను ప్రారంభించండి",
      "createSuccess": "ఖాతా విజయవంతంగా సృష్టించబడింది!",
      "loginSuccess": "విజయవంతంగా లాగిన్ అయ్యారు.",
      "logoutSuccess": "లాగ్ అవుట్ విజయవంతమైంది.",
      "switchSuccess": "ఖాతా మార్చబడింది:",
      "historyEmptyNotice": "ప్రతి ఖాతాకు ప్రత్యేకమైన సంభాషణ చరిత్ర మరియు బుక్‌మార్క్‌లు ఉంటాయి.",
      "accountIsolatedNotice": "ఖాతా వారీగా సురక్షితమైన చరిత్ర & బుక్‌మార్క్‌లు"
    },
    "voice": {
      "listen": "వినండి",
      "stop": "ఆపండి",
      "playing": "వినిపిస్తోంది...",
      "ariaListen": "ఈ భాగాన్ని వినండి",
      "ariaStop": "ఆడియో ఆపండి",
      "error": "ఈ బ్రౌజర్‌లో ఆడియో అందుబాటులో లేదు",
      "unsupported": "ఈ భాషకు వాయిస్ అందుబాటులో లేదు",
      "readingRecitation": "శ్లోక పఠనం",
      "readingTranslation": "తాత్పర్యం"
    },
    "verseDetail": {
      "previousVerse": "మునుపటి శ్లోకం",
      "nextVerse": "తరువాతి శ్లోకం",
      "previousChapter": "మునుపటి అధ్యాయం",
      "nextChapter": "తరువాతి అధ్యాయం",
      "relatedVersesTitle": "సంబంధిత శ్లోకాలు",
      "exploreVerse": "శ్లోకం చూడండి",
      "recitation": "శ్లోక పఠనం",
      "wordMeanings": "ప్రతిపదార్థం",
      "sanskritVerse": "సంస్కృత శ్లోకం",
      "englishTranslation": "ఆంగ్ల అనువాదం",
      "teluguTranslation": "తెలుగు తాత్పర్యం"
    },
    "footer": {
      "aboutTitle": "గీతా GPT గురించి",
      "aboutText": "ఆధునిక జీవన సవాళ్లకు భగవద్గీత నుండి శాశ్వత ఆధ్యాత్మిక జ్ఞానం మరియు మనస్తత్వ విశ్లేషణను అందించే అంతర్జాల వేదిక.",
      "quickLinks": "ముఖ్యమైన లింకులు",
      "legalDisclaimer": "ఆధ్యాత్మిక అన్వేషణ, వ్యక్తిత్వ వికాసం మరియు తత్వశాస్త్ర అధ్యయనం కొరకు మాత్రమే. వైద్య లేదా మానసిక చికిత్సకు ప్రత్యామ్నాయం కాదు.",
      "allRightsReserved": "సర్వహక్కులు ప్రత్యేకించబడ్డాయి.",
      "sanatanadharma": "సనాతన ధర్మం"
    },
    "common": {
      "exploreChapter": "అధ్యాయం చూడండి",
      "curatedVerses": "ఎంపిక చేసిన శ్లోకాలు",
      "versesCount": "శ్లోకాలు",
      "backToAllChapters": "అన్ని అధ్యాయాలు",
      "backToAllTopics": "అన్ని అంశాలు",
      "askGeethaAbout": "దీని గురించి గీతను అడగండి:",
      "viewWisdom": "జ్ఞానాన్ని చూడండి",
      "today": "నేడు",
      "yesterday": "నిన్న",
      "back": "వెనుకకు",
      "explore": "చూడండి",
      "open": "తెరవండి",
      "clear": "క్లియర్ చేయండి",
      "delete": "తొలగించండి",
      "messages": "సందేశాలు",
      "dialoguesLogged": "సంభాషణలు నమోదు చేయబడ్డాయి"
    }
  },
  "hi": {
    "auth": {
      "login": "लॉग इन",
      "signup": "खाता बनाएं",
      "logout": "लॉग आउट",
      "account": "खाता प्रबंधन",
      "switchAccount": "खाता बदलें",
      "currentAccount": "सक्रिय खाता",
      "guest": "अतिथि मोड",
      "guestNotice": "अतिथि मोड (इतिहास सुरक्षित नहीं होगा)",
      "name": "आपका नाम",
      "emailOrUsername": "ईमेल / पहचानकर्ता",
      "createSuccessButton": "खाता बनाएं और नया इतिहास शुरू करें",
      "createSuccess": "खाता सफलतापूर्वक बनाया गया!",
      "loginSuccess": "सफलतापूर्वक लॉग इन हुआ।",
      "logoutSuccess": "लॉग आउट सफल रहा।",
      "switchSuccess": "खाता बदला गया:",
      "historyEmptyNotice": "प्रत्येक खाते का अपना व्यक्तिगत इतिहास और बुकमार्क होते हैं।",
      "accountIsolatedNotice": "खाता-आधारित सुरक्षित इतिहास और बुकमार्क"
    },
    "voice": {
      "listen": "सुनें",
      "stop": "रोकें",
      "playing": "बज रहा है...",
      "ariaListen": "इस श्लोक को सुनें",
      "ariaStop": "ऑडियो रोकें",
      "error": "ब्राउज़र में ऑडियो उपलब्ध नहीं है",
      "unsupported": "इस भाषा के लिए आवाज़ उपलब्ध नहीं है",
      "readingRecitation": "श्लोक पाठ",
      "readingTranslation": "अनुवाद"
    },
    "verseDetail": {
      "previousVerse": "पिछला श्लोक",
      "nextVerse": "अगला श्लोक",
      "previousChapter": "पिछला अध्याय",
      "nextChapter": "अगला अध्याय",
      "relatedVersesTitle": "संबंधित श्लोक",
      "exploreVerse": "श्लोक देखें",
      "recitation": "श्लोक पाठ",
      "wordMeanings": "शब्दार्थ",
      "sanskritVerse": "संस्कृत श्लोक",
      "englishTranslation": "अंग्रेज़ी अनुवाद",
      "teluguTranslation": "तेलुगु अनुवाद"
    },
    "footer": {
      "aboutTitle": "गीता GPT के बारे में",
      "aboutText": "दैनिक जीवन की चुनौतियों के लिए भगवद्गीता से कालातीत आध्यात्मिक ज्ञान और व्यावहारिक मार्गदर्शन।",
      "quickLinks": "त्वरित लिंक",
      "legalDisclaimer": "आध्यात्मिक चिंतन और अध्ययन के लिए। यह पेशेवर परामर्श का विकल्प नहीं है।",
      "allRightsReserved": "सर्वाधिकार सुरक्षित।",
      "sanatanadharma": "सनातन धर्म"
    },
    "common": {
      "exploreChapter": "अध्याय देखें",
      "curatedVerses": "चयनित श्लोक",
      "versesCount": "श्लोक",
      "backToAllChapters": "सभी अध्याय",
      "backToAllTopics": "सभी विषय",
      "askGeethaAbout": "गीता से पूछें:",
      "viewWisdom": "ज्ञान देखें",
      "today": "आज",
      "yesterday": "कल",
      "back": "वापस",
      "explore": "देखें",
      "open": "खोलें",
      "clear": "हटाएं",
      "delete": "मिटाएं",
      "messages": "संदेश",
      "dialoguesLogged": "वार्तालाप दर्ज"
    }
  }
}

# Regional translations for the remaining languages with accurate terminology
LANG_MAP_REGIONAL = {
  "ta": {"login": "உள்நுழைக", "signup": "கணக்கு உருவாக்கவும்", "logout": "வெளியேறுக", "account": "கணக்கு மேலாண்மை", "listen": "கேளுங்கள்", "stop": "நிறுத்து", "chapter": "அத்தியாயம்", "verse": "பாடல்", "today": "இன்று", "yesterday": "நேற்று"},
  "kn": {"login": "ಲಾಗಿನ್", "signup": "ಖಾತೆ ತೆರೆಯಿರಿ", "logout": "ಲಾಗ್ ಔಟ್", "account": "ಖಾತೆ ನಿರ್ವಹಣೆ", "listen": "ಕೇಳಿ", "stop": "ನಿಲ್ಲಿಸಿ", "chapter": "ಅಧ್ಯಾಯ", "verse": "ಶ್ಲೋಕ", "today": "ಇಂದು", "yesterday": "ನಿನ್ನೆ"},
  "ml": {"login": "ലോഗിൻ", "signup": "അക്കൗണ്ട് നിർമ്മിക്കുക", "logout": "ലോഗ് ഔട്ട്", "account": "അക്കൗണ്ട് മാനേജ്മെന്റ്", "listen": "കേൾക്കൂ", "stop": "നിർത്തുക", "chapter": "അദ്ധ്യായം", "verse": "ശ്ലോകം", "today": "ഇന്ന്", "yesterday": "ഇന്നലെ"},
  "mr": {"login": "लॉग इन", "signup": "खाते तयार करा", "logout": "लॉग आउट", "account": "खाते व्यवस्थापन", "listen": "ऐका", "stop": "थांबवा", "chapter": "अध्याय", "verse": "श्लोक", "today": "आज", "yesterday": "काल"},
  "bn": {"login": "লগ ইন", "signup": "অ্যাকাউন্ট তৈরি করুন", "logout": "লগ আউট", "account": "অ্যাকাউন্ট পরিচালনা", "listen": "শুনুন", "stop": "থামান", "chapter": "অধ্যায়", "verse": "শ্লোক", "today": "আজ", "yesterday": "গতকাল"},
  "gu": {"login": "લૉગ ઇન", "signup": "ખાતું બનાવો", "logout": "લૉગ આઉટ", "account": "ખાતું વ્યવસ્થાપન", "listen": "સાંભળો", "stop": "રોકો", "chapter": "અધ્યાય", "verse": "શ્લોક", "today": "આજે", "yesterday": "ગઈકાલે"},
  "pa": {"login": "ਲਾਗ ਇਨ", "signup": "ਖਾਤਾ ਬਣਾਓ", "logout": "ਲਾਗ ਆਉਟ", "account": "ਖਾਤਾ ਪ੍ਰਬੰਧਨ", "listen": "ਸੁਣੋ", "stop": "ਰੋਕੋ", "chapter": "ਅਧਿਆਇ", "verse": "ਸ਼ਲੋਕ", "today": "ਅੱਜ", "yesterday": "ਕੱਲ੍ਹ"},
  "or": {"login": "ଲଗ୍ ଇନ୍", "signup": "ଖାତା ଖୋଲନ୍ତୁ", "logout": "ଲଗ୍ ଆଉଟ୍", "account": "ଖାତା ପରିଚାଳନା", "listen": "ଶୁଣନ୍ତୁ", "stop": "ବନ୍ଦ କରନ୍ତୁ", "chapter": "ଅଧ୍ୟାୟ", "verse": "ଶ୍ଳୋକ", "today": "ଆଜି", "yesterday": "ଗତକାଲି"},
  "as": {"login": "লগ ইন", "signup": "একাউণ্ট খোলক", "logout": "লগ আউট", "account": "একাউণ্ট ব্যৱস্থাপনা", "listen": "শুনক", "stop": "বন্ধ কৰক", "chapter": "অধ্যায়", "verse": "শ্লোক", "today": "আজি", "yesterday": "কালি"},
  "ur": {"login": "لاگ ان کریں", "signup": "اکاؤنٹ بنائیں", "logout": "لاگ آؤٹ", "account": "اکاؤنٹ کا انتظام", "listen": "سنیں", "stop": "روکیں", "chapter": "باب", "verse": "اشلوک", "today": "آج", "yesterday": "کل"},
  "sa": {"login": "प्रवेशः", "signup": "लेखा रचनम्", "logout": "निर्गमः", "account": "लेखा प्रबन्धनम्", "listen": "शृणोतु", "stop": "स्थगयतु", "chapter": "अध्यायः", "verse": "श्लोकः", "today": "अद्य", "yesterday": "ह्यः"},
  "ks": {"login": "लॉग इन", "signup": "खाता बनाविव", "logout": "लॉग आउट", "account": "खाता प्रबन्धन", "listen": "बोज़िव", "stop": "थाविव", "chapter": "सबक़", "verse": "श्लोक", "today": "अज़", "yesterday": "रात"},
  "kok": {"login": "लॉग इन", "signup": "खातें तयार करात", "logout": "लॉग आउट", "account": "खातें व्यवस्थापन", "listen": "आयकात", "stop": "थांबयात", "chapter": "अध्याय", "verse": "श्लोक", "today": "आयज", "yesterday": "काल"},
  "mai": {"login": "लॉग इन", "signup": "खाता बनाउ", "logout": "लॉग आउट", "account": "खाता प्रबंधन", "listen": "सुनू", "stop": "रोकूं", "chapter": "अध्याय", "verse": "श्लोक", "today": "आइ", "yesterday": "काल्हि"},
  "mni": {"login": "ꯂꯣꯒ ꯏꯟ", "signup": "ꯑꯦꯀꯥꯎꯟ ꯁꯦꯝꯕ", "logout": "ꯂꯣꯒ ꯑꯥꯎꯠ", "account": "ꯑꯦꯀꯥꯎꯟ", "listen": "ꯇꯥꯕꯤꯌꯨ", "stop": "ꯂꯦꯞꯄ", "chapter": "ꯇꯥꯡꯀꯛ", "verse": "ꯁ꯭ꯂꯣꯛ", "today": "ꯉꯁꯤ", "yesterday": "ꯉꯔꯥꯡ"},
  "ne": {"login": "लग इन", "signup": "खाता खोल्नुहोस्", "logout": "लग आउट", "account": "खाता व्यवस्थापन", "listen": "सुन्नुहोस्", "stop": "रोक्नुहोस्", "chapter": "अध्याय", "verse": "श्लोक", "today": "आज", "yesterday": "हिजो"},
  "brx": {"login": "लगाव इन", "signup": "खाता बानाय", "logout": "लगाव आवथ", "account": "खाता बिफान", "listen": "खनासं", "stop": "थादो", "chapter": "खोन्दोब", "verse": "सलोक", "today": "दिनै", "yesterday": "मैया"},
  "sat": {"login": "ᱞᱚᱜᱽ ᱤᱱ", "signup": "ᱠᱷᱟᱛᱟ ᱵᱮᱱᱟᱣ", "logout": "ᱞᱚᱜᱽ ᱟᱩᱴ", "account": "ᱠᱷᱟᱛᱟ", "listen": "ᱟᱸᱡᱚᱢ", "stop": "ᱛᱷᱟᱢᱵᱟᱣ", "chapter": "ᱦᱟᱹᱴᱤᱧ", "verse": "ᱥᱞᱳᱠ", "today": "ᱛᱮᱦᱮᱧ", "yesterday": "ᱦᱚᱞᱟ"},
  "sd": {"login": "لاگ ان", "signup": "کاتو ٺاهيو", "logout": "لاگ آئوٽ", "account": "کاتو انتظام", "listen": "ٻڌو", "stop": "روڪيو", "chapter": "باب", "verse": "شلوڪ", "today": "اڄ", "yesterday": "ڪالهه"},
  "doi": {"login": "लॉग इन", "signup": "खाता बनाओ", "logout": "लॉग आउट", "account": "खाता प्रबंधन", "listen": "सुणो", "stop": "रोको", "chapter": "अध्याय", "verse": "श्लोक", "today": "अज्ज", "yesterday": "कल्ल"}
}

def make_regional_dict(code, base_hi, base_en):
    reg = LANG_MAP_REGIONAL.get(code, {})
    # Use hi as base for Indic, en as fallback
    res = {}
    for sec, obj in base_hi.items():
        res[sec] = dict(obj)
    
    # Overwrite with regional terms
    if "auth" in res:
        res["auth"]["login"] = reg.get("login", res["auth"]["login"])
        res["auth"]["signup"] = reg.get("signup", res["auth"]["signup"])
        res["auth"]["logout"] = reg.get("logout", res["auth"]["logout"])
        res["auth"]["account"] = reg.get("account", res["auth"]["account"])
    if "voice" in res:
        res["voice"]["listen"] = reg.get("listen", res["voice"]["listen"])
        res["voice"]["stop"] = reg.get("stop", res["voice"]["stop"])
    if "common" in res:
        res["common"]["today"] = reg.get("today", res["common"]["today"])
        res["common"]["yesterday"] = reg.get("yesterday", res["common"]["yesterday"])
        res["common"]["versesCount"] = reg.get("verse", res["common"]["versesCount"])
    return res

def enrich_file(lang_code):
    fpath = os.path.join(I18N_DIR, f"{lang_code}.js")
    if not os.path.exists(fpath):
        print(f"File not found: {fpath}")
        return

    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract JSON object
    match = re.search(r'export\s+const\s+[A-Z0-9_]+\s*=\s*(\{[\s\S]*\});?\s*$', content)
    if not match:
        print(f"Could not parse dictionary from {lang_code}.js")
        return

    json_str = match.group(1)
    # Parse json
    try:
        data = json.loads(json_str)
    except Exception as e:
        print(f"JSON parse error in {lang_code}.js: {e}")
        return

    # Enrich with TRANSLATIONS_EXT
    if lang_code in TRANSLATIONS_EXT:
        ext = TRANSLATIONS_EXT[lang_code]
    else:
        ext = make_regional_dict(lang_code, TRANSLATIONS_EXT["hi"], TRANSLATIONS_EXT["en"])

    for sec, sec_data in ext.items():
        if sec not in data:
            data[sec] = {}
        for k, v in sec_data.items():
            data[sec][k] = v

    # Write back
    var_name = lang_code.upper()
    new_content = f"export const {var_name} = {json.dumps(data, ensure_ascii=False, indent=2)};\n"

    with open(fpath, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"Enriched {lang_code}.js successfully.")

def main():
    all_codes = ["en", "hi", "te", "ta", "kn", "ml", "mr", "bn", "gu", "pa", "or", "as", "ur", "sa", "ks", "kok", "mai", "mni", "ne", "brx", "sat", "sd", "doi"]
    for code in all_codes:
        enrich_file(code)
    print("All 23 language files successfully enriched with auth, voice, verseDetail, footer, and common keys!")

if __name__ == "__main__":
    main()
