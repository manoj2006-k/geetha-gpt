/**
 * Geetha GPT - Complete Localization & i18n System
 * Scales seamlessly across all 22 Scheduled Languages of India + English (23 languages total).
 */

import { LANGUAGES, getLanguage, isRTL, getScriptFontClass } from './languages.js';

import { EN } from './i18n/en.js';
import { TE } from './i18n/te.js';
import { HI } from './i18n/hi.js';
import { TA } from './i18n/ta.js';
import { KN } from './i18n/kn.js';
import { ML } from './i18n/ml.js';
import { MR } from './i18n/mr.js';
import { BN } from './i18n/bn.js';
import { GU } from './i18n/gu.js';
import { PA } from './i18n/pa.js';
import { OR } from './i18n/or.js';
import { AS } from './i18n/as.js';
import { UR } from './i18n/ur.js';
import { SA } from './i18n/sa.js';
import { KS } from './i18n/ks.js';
import { KOK } from './i18n/kok.js';
import { MAI } from './i18n/mai.js';
import { MNI } from './i18n/mni.js';
import { NE } from './i18n/ne.js';
import { BRX } from './i18n/brx.js';
import { SAT } from './i18n/sat.js';
import { SD } from './i18n/sd.js';
import { DOI } from './i18n/doi.js';

export const I18N = {
  en: EN,
  te: TE,
  hi: HI,
  ta: TA,
  kn: KN,
  ml: ML,
  mr: MR,
  bn: BN,
  gu: GU,
  pa: PA,
  or: OR,
  as: AS,
  ur: UR,
  sa: SA,
  ks: KS,
  kok: KOK,
  mai: MAI,
  mni: MNI,
  ne: NE,
  brx: BRX,
  sat: SAT,
  sd: SD,
  doi: DOI
};

export { LANGUAGES, getLanguage, isRTL, getScriptFontClass };

/**
 * Universal Translation Lookup Helper with Safe Fallback
 * @param {string} path - Dot-separated key path (e.g. 'nav.home', 'chat.title')
 * @param {string} [lang='en'] - Target language code
 * @param {string} [fallback='en'] - Fallback language code
 * @returns {string} - Localized string or fallback
 */
export function t(path, lang = 'en', fallback = 'en') {
  if (!path) return '';

  const getByPath = (obj, p) => {
    if (!obj) return undefined;
    return p.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
  };

  const currentDict = I18N[lang] || I18N[fallback] || I18N.en;
  let val = getByPath(currentDict, path);

  if (val === undefined && lang !== fallback) {
    const fallbackDict = I18N[fallback] || I18N.en;
    val = getByPath(fallbackDict, path);
  }

  if (val === undefined && fallback !== 'en') {
    val = getByPath(I18N.en, path);
  }

  return val !== undefined ? val : path;
}
