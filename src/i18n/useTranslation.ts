import { findBestLanguageTag, getLocales } from 'react-native-localize';
import { useSettingsStore } from '../store/useSettingsStore';
import { translations, type LanguageCode, type TranslationKeys } from './translations';
import { onboardingTranslations, type OnboardingCopy } from './onboardingTranslations';

const supportedLanguages = Object.keys(translations) as LanguageCode[];

function getDeviceLanguage(): LanguageCode {
  try {
    const bestMatch = findBestLanguageTag(supportedLanguages);
    if (bestMatch?.languageTag) {
      return resolveLanguageCode(bestMatch.languageTag);
    }

    const locale = getLocales()[0]?.languageTag;
    return locale ? resolveLanguageCode(locale) : 'en';
  } catch {
    return 'en';
  }
}

function resolveLanguageCode(locale: string): LanguageCode {
  // Normalise: "zh-Hans-CN" -> "zh", "pt-BR" -> "pt", "en-US" -> "en"
  const tag = locale.replace('_', '-').toLowerCase();
  const primary = tag.split('-')[0] as LanguageCode;

  if (supportedLanguages.includes(primary)) {
    return primary;
  }
  return 'en';
}

// Resolve once at module load; Settings can still override this in-app.
const deviceLanguage: LanguageCode = getDeviceLanguage();

/** Interpolate {key} placeholders in a translation string. */
export function interpolate(str: string, vars: Record<string, string>): string {
  return str.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`);
}

/** Returns the translation object for the active language (override or device). */
export function useTranslation(): { t: TranslationKeys; onboarding: OnboardingCopy; lang: LanguageCode } {
  const languageOverride = useSettingsStore((state) => state.language);
  const activeLanguage = languageOverride ?? deviceLanguage;
  const t = translations[activeLanguage] ?? translations.en;
  const onboarding = onboardingTranslations[activeLanguage] ?? onboardingTranslations.en;
  return { t, onboarding, lang: activeLanguage };
}
