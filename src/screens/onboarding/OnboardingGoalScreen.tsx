import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, ArrowRight } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../app/navigation/types';
import { useOnboardingStore, type OnboardingGoal } from '../../store/useOnboardingStore';
import AnimatedPressable from '../../components/shared/AnimatedPressable';
import { useTranslation } from '../../i18n/useTranslation';
import OnboardingProgressBar from './OnboardingProgressBar';
import { spacing, typography, useThemedStyles, type AppTheme } from '../../theme';

const OPTIONS: Array<{ id: OnboardingGoal; icon: string }> = [
  { id: 'travel-cinematic', icon: '✈️' },
  { id: 'social-media', icon: '📱' },
  { id: 'brand-consistent', icon: '🎯' },
  { id: 'fix-dull', icon: '✨' },
  { id: 'explore-fun', icon: '🎨' },
  { id: 'learn-basics', icon: '📚' },
];

interface Props extends NativeStackScreenProps<OnboardingStackParamList, 'OnboardingGoal'> {}

export default function OnboardingGoalScreen({ navigation }: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const { onboarding } = useTranslation();
  const setGoal = useOnboardingStore((s) => s.setGoal);
  const [selected, setSelected] = useState<OnboardingGoal | null>(null);

  const handleSelect = (id: OnboardingGoal) => {
    setSelected(id);
    setGoal(id);
  };

  const handleNext = () => {
    if (selected) {
      navigation.navigate('OnboardingPainPoints');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.lg }]}>
      <OnboardingProgressBar currentStep={1} totalSteps={5} />

      <View style={styles.content}>
        <Text style={styles.headline}>{onboarding.goalHeadline}</Text>

        <View style={styles.optionsList}>
          {OPTIONS.map((option, index) => {
            const isSelected = option.id === selected;
            return (
              <AnimatedPressable
                key={option.id}
                onPress={() => handleSelect(option.id)}
                style={[styles.optionCard, isSelected && styles.optionCardSelected]}
              >
                <Text style={styles.optionIcon}>{option.icon}</Text>
                <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                  {onboarding.goalOptions[index] ?? option.id}
                </Text>
                <View style={[styles.checkCircle, isSelected && styles.checkCircleSelected]}>
                  {isSelected ? (
                    <Check size={14} color={styles.checkIconColor.color} strokeWidth={2.4} />
                  ) : null}
                </View>
              </AnimatedPressable>
            );
          })}
        </View>
      </View>

      <AnimatedPressable
        onPress={handleNext}
        style={[styles.ctaButton, !selected && styles.ctaButtonDisabled]}
        pressedScale={selected ? 0.95 : 1}
      >
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
    paddingVertical: 12,
    minHeight: 66,
  },
  optionCardSelected: {
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.surfaceLighter,
  },
  optionIcon: {
    fontSize: 22,
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
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleSelected: {
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
  ctaButtonDisabled: {
    backgroundColor: theme.colors.surfaceLight,
  },
  ctaText: {
    ...typography.bodyMedium,
    color: theme.colors.accentForeground,
    fontSize: 17,
  },
});
