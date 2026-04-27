import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, ArrowRight } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../app/navigation/types';
import { useOnboardingStore, type FilterCategory } from '../../store/useOnboardingStore';
import AnimatedPressable from '../../components/shared/AnimatedPressable';
import { useTranslation } from '../../i18n/useTranslation';
import OnboardingProgressBar from './OnboardingProgressBar';
import { spacing, typography, useThemedStyles, type AppTheme } from '../../theme';

const CATEGORIES: Array<{ id: FilterCategory; color: string }> = [
  { id: 'warm-cinematic', color: '#D4A574' },
  { id: 'cool-moody', color: '#1A6B8A' },
  { id: 'bold-stylised', color: '#2ECC71' },
  { id: 'clean-minimal', color: '#C0C0C0' },
  { id: 'dramatic', color: '#666666' },
  { id: 'dreamy', color: '#9B59B6' },
];

interface Props extends NativeStackScreenProps<OnboardingStackParamList, 'OnboardingPreferences'> {}

export default function OnboardingPreferencesScreen({ navigation }: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const { onboarding } = useTranslation();
  const filterCategories = useOnboardingStore((s) => s.filterCategories);
  const toggleFilterCategory = useOnboardingStore((s) => s.toggleFilterCategory);

  const handleNext = () => {
    navigation.navigate('OnboardingPermission');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.lg }]}>
      <OnboardingProgressBar currentStep={4} totalSteps={5} />

      <View style={styles.content}>
        <Text style={styles.headline}>{onboarding.preferencesHeadline}</Text>
        <Text style={styles.subheadline}>{onboarding.preferencesSubheadline}</Text>

        <View style={styles.grid}>
          {CATEGORIES.map((cat, index) => {
            const isSelected = filterCategories.includes(cat.id);
            return (
              <AnimatedPressable
                key={cat.id}
                onPress={() => toggleFilterCategory(cat.id)}
                style={[styles.card, isSelected && styles.cardSelected]}
              >
                <View style={[styles.colorDot, { backgroundColor: cat.color }]} />
                <Text style={[styles.cardLabel, isSelected && styles.cardLabelSelected]}>
                  {onboarding.categoryLabels[index] ?? cat.id}
                </Text>
                <Text style={styles.cardFilters}>{onboarding.categoryFilters[index]}</Text>
                {isSelected && (
                  <View style={styles.checkOverlay}>
                    <Check size={20} color={styles.checkColor.color} strokeWidth={2.4} />
                  </View>
                )}
              </AnimatedPressable>
            );
          })}
        </View>
      </View>

      <AnimatedPressable onPress={handleNext} style={styles.ctaButton}>
        <Text style={styles.ctaText}>{onboarding.continue}</Text>
        <ArrowRight size={18} color={styles.ctaText.color} strokeWidth={2.4} />
      </AnimatedPressable>
    </View>
  );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  headline: {
    ...typography.title,
    color: theme.colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subheadline: {
    ...typography.body,
    color: theme.colors.textSecondary,
    marginBottom: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  card: {
    width: '48%',
    aspectRatio: 1.2,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 20,
    padding: spacing.md,
    justifyContent: 'flex-end',
  },
  cardSelected: {
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.surfaceLighter,
  },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginBottom: spacing.sm,
  },
  cardLabel: {
    ...typography.bodyMedium,
    color: theme.colors.textPrimary,
    fontSize: 15,
    marginBottom: 2,
  },
  cardLabelSelected: {
    color: theme.colors.textPrimary,
  },
  cardFilters: {
    ...typography.caption,
    color: theme.colors.textSecondary,
  },
  checkOverlay: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkColor: {
    color: theme.colors.accentForeground,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: theme.colors.accent,
    paddingVertical: spacing.md,
    borderRadius: 16,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  ctaText: {
    ...typography.bodyMedium,
    color: theme.colors.accentForeground,
    fontSize: 17,
  },
});
