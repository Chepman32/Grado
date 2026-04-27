import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createFileStorage } from './fileStorage';
import { DEFAULT_THEME_ID, type AppThemeId } from '../theme/palettes';
import { type LanguageCode } from '../i18n/translations';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ExportFormatId = 'mp4' | 'hevc';
export type ProjectPreviewMode = 'current-playback' | 'first-second';

export const SUPPORTED_LANGUAGES: LanguageCode[] = [
  'en', 'zh', 'ja', 'ko', 'de', 'fr', 'es', 'pt',
  'ar', 'ru', 'it', 'nl', 'tr', 'th', 'vi', 'id',
  'pl', 'uk', 'hi', 'he', 'sv', 'no', 'da', 'fi',
  'cs', 'hu', 'ro', 'el', 'ms',
];

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  en: 'English',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  pt: 'Português',
  ar: 'العربية',
  ru: 'Русский',
  it: 'Italiano',
  nl: 'Nederlands',
  tr: 'Türkçe',
  th: 'ไทย',
  vi: 'Tiếng Việt',
  id: 'Bahasa Indonesia',
  pl: 'Polski',
  uk: 'Українська',
  hi: 'हिन्दी',
  he: 'עברית',
  sv: 'Svenska',
  no: 'Norsk',
  da: 'Dansk',
  fi: 'Suomi',
  cs: 'Čeština',
  hu: 'Magyar',
  ro: 'Română',
  el: 'Ελληνικά',
  ms: 'Bahasa Melayu',
};

export const FIRST_SECOND_PREVIEW_TIME_MS = 1000;

interface ResolveProjectPreviewTimeParams {
  previewMode: ProjectPreviewMode;
  durationSeconds?: number;
  currentTimeSeconds?: number;
  storedTimeMs?: number;
}

export function resolveProjectPreviewTimeMs({
  previewMode,
  durationSeconds,
  currentTimeSeconds,
  storedTimeMs,
}: ResolveProjectPreviewTimeParams): number {
  const durationMs =
    typeof durationSeconds === 'number' && Number.isFinite(durationSeconds)
      ? Math.max(0, Math.round(durationSeconds * 1000))
      : Number.POSITIVE_INFINITY;

  const rawTimeMs =
    previewMode === 'first-second'
      ? FIRST_SECOND_PREVIEW_TIME_MS
      : currentTimeSeconds === undefined
        ? storedTimeMs ?? 0
        : Math.round(currentTimeSeconds * 1000);

  const safeTimeMs = Number.isFinite(rawTimeMs)
    ? Math.max(0, Math.round(rawTimeMs))
    : 0;

  return Math.min(safeTimeMs, durationMs);
}

interface SettingsState {
  themeId: AppThemeId;
  exportFormat: ExportFormatId;
  previewMode: ProjectPreviewMode;
  language: LanguageCode | null;
}

interface SettingsActions {
  setThemeId: (themeId: AppThemeId) => void;
  setExportFormat: (exportFormat: ExportFormatId) => void;
  setPreviewMode: (previewMode: ProjectPreviewMode) => void;
  setLanguage: (language: LanguageCode | null) => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      // State
      themeId: DEFAULT_THEME_ID,
      exportFormat: 'mp4',
      previewMode: 'current-playback',
      language: null,

      // Actions
      setThemeId: (themeId) => set({ themeId }),
      setExportFormat: (exportFormat) => set({ exportFormat }),
      setPreviewMode: (previewMode) => set({ previewMode }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'grado-settings',
      version: 5,
      storage: createJSONStorage(() => createFileStorage()),
      partialize: (state) => ({
        themeId: state.themeId,
        exportFormat: state.exportFormat,
        previewMode: state.previewMode,
        language: state.language,
      }),
      migrate: (persistedState) => {
        const state = (persistedState as Partial<SettingsState> | undefined) ?? {};

        return {
          themeId: state.themeId ?? DEFAULT_THEME_ID,
          exportFormat: state.exportFormat ?? 'mp4',
          previewMode: state.previewMode ?? 'current-playback',
          language: state.language ?? null,
        };
      },
    },
  ),
);
