import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, ArrowRight } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../app/navigation/types';
import { useOnboardingStore, type OnboardingPainPoint } from '../../store/useOnboardingStore';
import AnimatedPressable from '../../components/shared/AnimatedPressable';
import { useTranslation } from '../../i18n/useTranslation';
import OnboardingProgressBar from './OnboardingProgressBar';
import { spacing, typography, useThemedStyles, type AppTheme } from '../../theme';

const OPTIONS: Array<{ id: OnboardingPainPoint }> = [
  { id: 'desktop-too-complex' },
  { id: 'cloud-privacy' },
  { id: 'ads-watermarks' },
  { id: 'dont-know-start' },
  { id: 'takes-too-long' },
  { id: 'want-more-control' },
];

interface Props extends NativeStackScreenProps<OnboardingStackParamList, 'OnboardingPainPoints'> {}

export default function OnboardingPainPointsScreen({ navigation }: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const { onboarding } = useTranslation();
  const painPoints = useOnboardingStore((s) => s.painPoints);
  const togglePainPoint = useOnboardingStore((s) => s.togglePainPoint);

  const handleNext = () => {
    navigation.navigate('OnboardingSocialProof');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.lg }]}>
      <OnboardingProgressBar currentStep={2} totalSteps={5} />

      <View style={styles.content}>
        <Text style={styles.headline}>{onboarding.painHeadline}</Text>
        <Text style={styles.subheadline}>{onboarding.painSubheadline}</Text>

        <View style={styles.optionsList}>
          {OPTIONS.map((option, index) => {
            const isSelected = painPoints.includes(option.id);
            return (
              <AnimatedPressable
                key={option.id}
                onPress={() => togglePainPoint(option.id)}
                style={[styles.optionCard, isSelected && styles.optionCardSelected]}
              >
                <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                  {onboarding.painOptions[index] ?? option.id}
                </Text>
                <View style={[styles.checkBox, isSelected && styles.checkBoxSelected]}>
                  {isSelected ? (
                    <Check size={14} color={styles.checkIconColor.color} strokeWidth={2.4} />
                  ) : null}
                </View>
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
    marginBottom: spacing.md,
  },
  optionsList: {
    gap: spacing.sm,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    minHeight: 60,
  },
  optionCardSelected: {
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.surfaceLighter,
  },
  optionLabel: {
    ...typography.bodyMedium,
    color: theme.colors.textPrimary,
    flex: 1,
    fontSize: 16,
    lineHeight: 21,
  },
  optionLabelSelected: {
    color: theme.colors.textPrimary,
  },
  checkBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxSelected: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  checkIconColor: {
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
