import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Star, ArrowRight } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../app/navigation/types';
import AnimatedPressable from '../../components/shared/AnimatedPressable';
import { useTranslation } from '../../i18n/useTranslation';
import OnboardingProgressBar from './OnboardingProgressBar';
import { spacing, typography, useThemedStyles, type AppTheme } from '../../theme';

interface Props extends NativeStackScreenProps<OnboardingStackParamList, 'OnboardingSocialProof'> {}

export default function OnboardingSocialProofScreen({ navigation }: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const { onboarding } = useTranslation();

  const handleNext = () => {
    navigation.navigate('OnboardingPreferences');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.lg }]}>
      <OnboardingProgressBar currentStep={3} totalSteps={5} />

      <View style={styles.content}>
        <Text style={styles.headline}>{onboarding.socialHeadline}</Text>

        <View style={styles.cardsList}>
          {onboarding.testimonials.map((testimonial, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{testimonial.name.charAt(0)}</Text>
                </View>
                <View style={styles.cardMeta}>
                  <Text style={styles.cardName}>{testimonial.name}</Text>
                  <Text style={styles.cardTag}>{testimonial.tag}</Text>
                </View>
                <View style={styles.stars}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={12} color="#F5A623" fill="#F5A623" />
                  ))}
                </View>
              </View>
              <Text style={styles.cardText}>{testimonial.text}</Text>
            </View>
          ))}
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
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  headline: {
    ...typography.title,
    color: theme.colors.textPrimary,
    marginBottom: spacing.lg,
  },
  cardsList: {
    gap: spacing.sm,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 20,
    padding: spacing.sm + 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surfaceLighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.bodyMedium,
    color: theme.colors.textPrimary,
    fontSize: 14,
  },
  cardMeta: {
    flex: 1,
  },
  cardName: {
    ...typography.bodyMedium,
    color: theme.colors.textPrimary,
    fontSize: 15,
  },
  cardTag: {
    ...typography.caption,
    color: theme.colors.textSecondary,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  cardText: {
    ...typography.body,
    color: theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
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
