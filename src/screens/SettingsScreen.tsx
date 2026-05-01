import React, { useCallback, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, ChevronDown } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../app/navigation/types';
import {
  useSettingsStore,
  LANGUAGE_LABELS,
  SUPPORTED_LANGUAGES,
  type ExportFormatId,
  type ProjectPreviewMode,
} from '../store/useSettingsStore';
import AnimatedPressable from '../components/shared/AnimatedPressable';
import {
  APP_THEMES,
  APP_THEME_OPTIONS,
  spacing,
  typography,
  useAppTheme,
  useThemedStyles,
  type AppTheme,
  type AppThemeId,
} from '../theme';
import { useTranslation } from '../i18n/useTranslation';
import type { TranslationKeys } from '../i18n/translations';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  onExpand?: () => void;
}

const EXPORT_FORMAT_OPTIONS: Array<{ id: ExportFormatId; labelKey: keyof TranslationKeys }> = [
  { id: 'mp4', labelKey: 'mp4Label' },
  { id: 'hevc', labelKey: 'hevcLabel' },
];

const PROJECT_PREVIEW_OPTIONS: Array<{
  id: ProjectPreviewMode;
  labelKey: keyof TranslationKeys;
  descKey: keyof TranslationKeys;
}> = [
  {
    id: 'current-playback',
    labelKey: 'projectPreviewCurrentFrame',
    descKey: 'projectPreviewCurrentFrameDesc',
  },
  {
    id: 'first-second',
    labelKey: 'projectPreviewFirstSecond',
    descKey: 'projectPreviewFirstSecondDesc',
  },
];

const ACCORDION_CONTENT_HEIGHT = 520;
const ACCORDION_TIMING = {
  duration: 220,
  easing: Easing.out(Easing.cubic),
};

function Accordion({ title, children, onExpand }: AccordionProps) {
  const theme = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const [expanded, setExpanded] = useState(false);
  const progress = useSharedValue(0);

  const toggle = useCallback(() => {
    const next = !expanded;
    setExpanded(next);
    progress.value = withTiming(next ? 1 : 0, ACCORDION_TIMING);
    if (next) {
      setTimeout(() => onExpand?.(), ACCORDION_TIMING.duration);
    }
  }, [expanded, onExpand, progress]);

  const contentStyle = useAnimatedStyle(() => ({
    maxHeight: progress.value * ACCORDION_CONTENT_HEIGHT,
    opacity: progress.value,
    overflow: 'hidden' as const,
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 180}deg` }],
  }));

  return (
    <View style={styles.accordionContainer}>
      <AnimatedPressable onPress={toggle} style={styles.accordionHeader} pressedScale={1}>
        <Text style={styles.accordionTitle}>{title}</Text>
        <Animated.View style={chevronStyle}>
          <ChevronDown size={20} color={theme.colors.textSecondary} />
        </Animated.View>
      </AnimatedPressable>
      <Animated.View style={contentStyle}>{children}</Animated.View>
    </View>
  );
}

export default function SettingsScreen(_props: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();
  const themeId = useSettingsStore((state) => state.themeId);
  const setThemeId = useSettingsStore((state) => state.setThemeId);
  const exportFormat = useSettingsStore((state) => state.exportFormat);
  const setExportFormat = useSettingsStore((state) => state.setExportFormat);
  const previewMode = useSettingsStore((state) => state.previewMode);
  const setPreviewMode = useSettingsStore((state) => state.setPreviewMode);
  const language = useSettingsStore((state) => state.language);
  const setLanguage = useSettingsStore((state) => state.setLanguage);
  const languageScrollRef = useRef<ScrollView>(null);
  const languageOptionOffsets = useRef<Record<string, number>>({});
  const selectedLanguageKey = language ?? 'system';

  const THEME_COPY: Record<AppThemeId, string> = {
    dark: t.themeDark,
    light: t.themeLight,
    solar: t.themeSolar,
    mono: t.themeMono,
  };

  const EXPORT_FORMAT_COPY: Record<string, string> = {
    mp4: t.exportMp4Desc,
    hevc: t.exportHevcDesc,
  };

  const scrollToSelectedLanguage = useCallback(() => {
    requestAnimationFrame(() => {
      const selectedOffset = languageOptionOffsets.current[selectedLanguageKey] ?? 0;
      languageScrollRef.current?.scrollTo({
        y: Math.max(selectedOffset - spacing.sm, 0),
        animated: true,
      });
    });
  }, [selectedLanguageKey]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + spacing.xl },
      ]}
    >
      <Accordion title={t.appearance}>
        <View style={styles.themeGrid}>
          {APP_THEME_OPTIONS.map((option) => {
            const optionTheme = APP_THEMES[option.id];
            const isSelected = option.id === themeId;

            return (
              <AnimatedPressable
                key={option.id}
                onPress={() => setThemeId(option.id)}
                style={[
                  styles.themeCard,
                  isSelected && styles.themeCardSelected,
                ]}
                accessibilityLabel={`Switch to ${option.label} theme`}
                accessibilityRole="button"
              >
                <View style={styles.themeHeaderRow}>
                  <Text style={styles.themeTitle}>{option.label}</Text>
                  <View
                    style={[
                      styles.themeCheck,
                      isSelected && styles.themeCheckSelected,
                    ]}
                  >
                    {isSelected ? (
                      <Check size={14} color={theme.colors.accentForeground} strokeWidth={2.4} />
                    ) : null}
                  </View>
                </View>

                <View style={styles.themePreviewRow}>
                  <View
                    style={[
                      styles.themePreviewBlock,
                      { backgroundColor: optionTheme.colors.background },
                    ]}
                  />
                  <View
                    style={[
                      styles.themePreviewBlock,
                      { backgroundColor: optionTheme.colors.surface },
                    ]}
                  />
                  <View
                    style={[
                      styles.themePreviewAccent,
                      { backgroundColor: optionTheme.colors.accent },
                    ]}
                  />
                </View>

                <Text style={styles.themeDescription}>
                  {THEME_COPY[option.id]}
                </Text>
              </AnimatedPressable>
            );
          })}
        </View>
      </Accordion>

      <Accordion title={t.exportFormat}>
        <View style={styles.optionList}>
          {EXPORT_FORMAT_OPTIONS.map((option) => {
            const isSelected = option.id === exportFormat;

            return (
              <AnimatedPressable
                key={option.id}
                onPress={() => setExportFormat(option.id)}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
                accessibilityLabel={`Switch export format to ${t[option.labelKey]}`}
                accessibilityRole="button"
              >
                <View style={styles.optionHeaderRow}>
                  <View style={styles.optionTextWrap}>
                    <Text style={styles.optionTitle}>{t[option.labelKey]}</Text>
                    <Text style={styles.optionDescription}>
                      {EXPORT_FORMAT_COPY[option.id]}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.themeCheck,
                      isSelected && styles.themeCheckSelected,
                    ]}
                  >
                    {isSelected ? (
                      <Check size={14} color={theme.colors.accentForeground} strokeWidth={2.4} />
                    ) : null}
                  </View>
                </View>
              </AnimatedPressable>
            );
          })}
        </View>
      </Accordion>

      <Accordion title={t.projectPreview}>
        <View style={styles.optionList}>
          {PROJECT_PREVIEW_OPTIONS.map((option) => {
            const isSelected = option.id === previewMode;

            return (
              <AnimatedPressable
                key={option.id}
                onPress={() => setPreviewMode(option.id)}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
                accessibilityLabel={`Switch project preview mode to ${t[option.labelKey]}`}
                accessibilityRole="button"
              >
                <View style={styles.optionHeaderRow}>
                  <View style={styles.optionTextWrap}>
                    <Text style={styles.optionTitle}>{t[option.labelKey]}</Text>
                    <Text style={styles.optionDescription}>
                      {t[option.descKey]}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.themeCheck,
                      isSelected && styles.themeCheckSelected,
                    ]}
                  >
                    {isSelected ? (
                      <Check size={14} color={theme.colors.accentForeground} strokeWidth={2.4} />
                    ) : null}
                  </View>
                </View>
              </AnimatedPressable>
            );
          })}
        </View>
      </Accordion>

      <Accordion title={t.language} onExpand={scrollToSelectedLanguage}>
        <ScrollView
          ref={languageScrollRef}
          style={styles.languageList}
          contentContainerStyle={styles.optionList}
          nestedScrollEnabled
          showsVerticalScrollIndicator
        >
          <AnimatedPressable
            onPress={() => setLanguage(null)}
            style={[
              styles.optionCard,
              language === null && styles.optionCardSelected,
            ]}
            accessibilityLabel={`Select ${t.systemDefault}`}
            accessibilityRole="button"
            onLayout={(event) => {
              languageOptionOffsets.current.system = event.nativeEvent.layout.y;
            }}
          >
            <View style={styles.optionHeaderRow}>
              <View style={styles.optionTextWrap}>
                <Text style={styles.optionTitle}>{t.systemDefault}</Text>
                <Text style={styles.optionDescription}>{t.languageDesc}</Text>
              </View>
              <View
                style={[
                  styles.themeCheck,
                  language === null && styles.themeCheckSelected,
                ]}
              >
                {language === null ? (
                  <Check size={14} color={theme.colors.accentForeground} strokeWidth={2.4} />
                ) : null}
              </View>
            </View>
          </AnimatedPressable>
          {SUPPORTED_LANGUAGES.map((code) => {
            const isSelected = code === language;
            return (
              <AnimatedPressable
                key={code}
                onPress={() => setLanguage(code)}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
                accessibilityLabel={`Select ${LANGUAGE_LABELS[code]}`}
                accessibilityRole="button"
                onLayout={(event) => {
                  languageOptionOffsets.current[code] = event.nativeEvent.layout.y;
                }}
              >
                <View style={styles.optionHeaderRow}>
                  <View style={styles.optionTextWrap}>
                    <Text style={styles.optionTitle}>{LANGUAGE_LABELS[code]}</Text>
                  </View>
                  <View
                    style={[
                      styles.themeCheck,
                      isSelected && styles.themeCheckSelected,
                    ]}
                  >
                    {isSelected ? (
                      <Check size={14} color={theme.colors.accentForeground} strokeWidth={2.4} />
                    ) : null}
                  </View>
                </View>
              </AnimatedPressable>
            );
          })}
        </ScrollView>
      </Accordion>

      <Accordion title={t.about}>
        <Text style={styles.aboutText}>{t.aboutText}</Text>
      </Accordion>
    </ScrollView>
  );
}

const createStyles = (theme: AppTheme) => {
  const colors = theme.colors;

  return {
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingTop: spacing.md,
      paddingHorizontal: spacing.md,
    },
    accordionContainer: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      marginBottom: spacing.md,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
    },
    accordionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md + 2,
    },
    accordionTitle: {
      ...typography.subtitle,
      color: colors.textPrimary,
    },
    themeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
    },
    themeCard: {
      width: '48%',
      minHeight: 134,
      borderRadius: 18,
      backgroundColor: colors.surfaceLight,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
    },
    themeCardSelected: {
      borderColor: colors.accent,
      backgroundColor: colors.surfaceLighter,
    },
    themeHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    themeTitle: {
      ...typography.bodyMedium,
      color: colors.textPrimary,
    },
    themeCheck: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
    },
    themeCheckSelected: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    themePreviewRow: {
      flexDirection: 'row',
      gap: 6,
      marginBottom: spacing.sm,
    },
    themePreviewBlock: {
      flex: 1,
      height: 34,
      borderRadius: 10,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    themePreviewAccent: {
      width: 26,
      height: 34,
      borderRadius: 10,
    },
    themeDescription: {
      ...typography.caption,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    optionList: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
      gap: spacing.sm,
    },
    languageList: {
      maxHeight: ACCORDION_CONTENT_HEIGHT,
    },
    optionCard: {
      borderRadius: 16,
      backgroundColor: colors.surfaceLight,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
    },
    optionCardSelected: {
      backgroundColor: colors.surfaceLighter,
      borderColor: colors.accent,
    },
    optionHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: spacing.md,
    },
    optionTextWrap: {
      flex: 1,
    },
    optionTitle: {
      ...typography.bodyMedium,
      color: colors.textPrimary,
      marginBottom: 4,
    },
    optionDescription: {
      ...typography.caption,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    aboutText: {
      ...typography.body,
      color: colors.textSecondary,
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
      lineHeight: 24,
    },
  };
};
