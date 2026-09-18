/**
 * Geetha GPT - Complete Language Registry
 * Supports all 22 Scheduled Languages of the Eighth Schedule of the Constitution of India + English.
 */

export const LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    script: 'Latin',
    fontClass: 'lang-en',
    dir: 'ltr',
    speechCode: 'en-IN',
    ttsCode: 'en-IN',
    isScheduled: false,
    hasVoiceSupport: true,
    region: 'Pan-India / Global'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'Devanagari',
    fontClass: 'lang-hi',
    dir: 'ltr',
    speechCode: 'hi-IN',
    ttsCode: 'hi-IN',
    isScheduled: true,
    hasVoiceSupport: true,
    region: 'Northern / Central India'
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'Telugu',
    fontClass: 'lang-te',
    dir: 'ltr',
    speechCode: 'te-IN',
    ttsCode: 'te-IN',
    isScheduled: true,
    hasVoiceSupport: true,
    region: 'Andhra Pradesh & Telangana'
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'Tamil',
    fontClass: 'lang-ta',
    dir: 'ltr',
    speechCode: 'ta-IN',
    ttsCode: 'ta-IN',
    isScheduled: true,
    hasVoiceSupport: true,
    region: 'Tamil Nadu & Puducherry'
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    script: 'Kannada',
    fontClass: 'lang-kn',
    dir: 'ltr',
    speechCode: 'kn-IN',
    ttsCode: 'kn-IN',
    isScheduled: true,
    hasVoiceSupport: true,
    region: 'Karnataka'
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    script: 'Malayalam',
    fontClass: 'lang-ml',
    dir: 'ltr',
    speechCode: 'ml-IN',
    ttsCode: 'ml-IN',
    isScheduled: true,
    hasVoiceSupport: true,
    region: 'Kerala & Lakshadweep'
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    script: 'Devanagari',
    fontClass: 'lang-mr',
    dir: 'ltr',
    speechCode: 'mr-IN',
    ttsCode: 'mr-IN',
    isScheduled: true,
    hasVoiceSupport: true,
    region: 'Maharashtra & Goa'
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Bengali',
    fontClass: 'lang-bn',
    dir: 'ltr',
    speechCode: 'bn-IN',
    ttsCode: 'bn-IN',
    isScheduled: true,
    hasVoiceSupport: true,
    region: 'West Bengal & Tripura'
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    script: 'Gujarati',
    fontClass: 'lang-gu',
    dir: 'ltr',
    speechCode: 'gu-IN',
    ttsCode: 'gu-IN',
    isScheduled: true,
    hasVoiceSupport: true,
    region: 'Gujarat'
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    script: 'Gurmukhi',
    fontClass: 'lang-pa',
    dir: 'ltr',
    speechCode: 'pa-IN',
    ttsCode: 'pa-IN',
    isScheduled: true,
    hasVoiceSupport: true,
    region: 'Punjab'
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    script: 'Odia',
    fontClass: 'lang-or',
    dir: 'ltr',
    speechCode: 'or-IN',
    ttsCode: 'or-IN',
    isScheduled: true,
    hasVoiceSupport: false,
    region: 'Odisha'
  },
  {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    script: 'Bengali-Assamese',
    fontClass: 'lang-as',
    dir: 'ltr',
    speechCode: 'as-IN',
    ttsCode: 'as-IN',
    isScheduled: true,
    hasVoiceSupport: false,
    region: 'Assam'
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    script: 'Arabic-Persian (Nastaliq)',
    fontClass: 'lang-ur',
    dir: 'rtl',
    speechCode: 'ur-IN',
    ttsCode: 'ur-IN',
    isScheduled: true,
    hasVoiceSupport: true,
    region: 'Northern / Central / Deccan'
  },
  {
    code: 'sa',
    name: 'Sanskrit',
    nativeName: 'संस्कृतम्',
    script: 'Devanagari',
    fontClass: 'lang-sa',
    dir: 'ltr',
    speechCode: 'sa-IN',
    ttsCode: 'hi-IN',
    isScheduled: true,
    hasVoiceSupport: false,
    region: 'Classical / Pan-India'
  },
  {
    code: 'ks',
    name: 'Kashmiri',
    nativeName: 'कॉशुर',
    script: 'Devanagari / Perso-Arabic',
    fontClass: 'lang-ks',
    dir: 'ltr',
    speechCode: 'ks-IN',
    ttsCode: 'hi-IN',
    isScheduled: true,
    hasVoiceSupport: false,
    region: 'Jammu & Kashmir'
  },
  {
    code: 'kok',
    name: 'Konkani',
    nativeName: 'कोंकणी',
    script: 'Devanagari',
    fontClass: 'lang-kok',
    dir: 'ltr',
    speechCode: 'kok-IN',
    ttsCode: 'mr-IN',
    isScheduled: true,
    hasVoiceSupport: false,
    region: 'Goa & Konkan Coast'
  },
  {
    code: 'mai',
    name: 'Maithili',
    nativeName: 'मैथिली',
    script: 'Devanagari',
    fontClass: 'lang-mai',
    dir: 'ltr',
    speechCode: 'mai-IN',
    ttsCode: 'hi-IN',
    isScheduled: true,
    hasVoiceSupport: false,
    region: 'Bihar & Mithila'
  },
  {
    code: 'mni',
    name: 'Manipuri',
    nativeName: 'ꯃꯤꯇꯩ ꯂꯣꯟ',
    script: 'Meetei Mayek',
    fontClass: 'lang-mni',
    dir: 'ltr',
    speechCode: 'mni-IN',
    ttsCode: 'bn-IN',
    isScheduled: true,
    hasVoiceSupport: false,
    region: 'Manipur'
  },
  {
    code: 'ne',
    name: 'Nepali',
    nativeName: 'नेपाली',
    script: 'Devanagari',
    fontClass: 'lang-ne',
    dir: 'ltr',
    speechCode: 'ne-NP',
    ttsCode: 'ne-NP',
    isScheduled: true,
    hasVoiceSupport: true,
    region: 'Sikkim & West Bengal'
  },
  {
    code: 'brx',
    name: 'Bodo',
    nativeName: 'बड़ो',
    script: 'Devanagari',
    fontClass: 'lang-brx',
    dir: 'ltr',
    speechCode: 'brx-IN',
    ttsCode: 'as-IN',
    isScheduled: true,
    hasVoiceSupport: false,
    region: 'Bodoland & Assam'
  },
  {
    code: 'sat',
    name: 'Santhali',
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ',
    script: 'Ol Chiki',
    fontClass: 'lang-sat',
    dir: 'ltr',
    speechCode: 'sat-IN',
    ttsCode: 'hi-IN',
    isScheduled: true,
    hasVoiceSupport: false,
    region: 'Jharkhand, Odisha, West Bengal'
  },
  {
    code: 'sd',
    name: 'Sindhi',
    nativeName: 'सिन्धी',
    script: 'Devanagari / Arabic',
    fontClass: 'lang-sd',
    dir: 'ltr',
    speechCode: 'sd-IN',
    ttsCode: 'gu-IN',
    isScheduled: true,
    hasVoiceSupport: false,
    region: 'Gujarat, Maharashtra, Rajasthan'
  },
  {
    code: 'doi',
    name: 'Dogri',
    nativeName: 'डोगरी',
    script: 'Devanagari',
    fontClass: 'lang-doi',
    dir: 'ltr',
    speechCode: 'doi-IN',
    ttsCode: 'hi-IN',
    isScheduled: true,
    hasVoiceSupport: false,
    region: 'Jammu & Kashmir'
  }
];

export const LANGUAGE_MAP = Object.freeze(
  LANGUAGES.reduce((acc, lang) => {
    acc[lang.code] = lang;
    return acc;
  }, {})
);

export function getLanguage(code) {
  return LANGUAGE_MAP[code] || LANGUAGE_MAP.en;
}

export function isRTL(code) {
  const lang = getLanguage(code);
  return lang && lang.dir === 'rtl';
}

export function getScriptFontClass(code) {
  const lang = getLanguage(code);
  return lang ? lang.fontClass : 'lang-en';
}
