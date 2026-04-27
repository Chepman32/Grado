import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../app/navigation/types';
import AnimatedPressable from '../../components/shared/AnimatedPressable';
import { useTranslation } from '../../i18n/useTranslation';
import { spacing, typography, useThemedStyles, type AppTheme } from '../../theme';

interface Props extends NativeStackScreenProps<OnboardingStackParamList, 'OnboardingWelcome'> {}

export default function OnboardingWelcomeScreen({ navigation }: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const { onboarding } = useTranslation();

  const handleNext = () => {
    navigation.navigate('OnboardingGoal');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.lg }]}>
      <View style={styles.content}>
        <View style={styles.previewArea}>
          <View style={styles.previewPlaceholder}>
            <Text style={styles.previewLabel}>GRADO</Text>
          </View>
        </View>

        <View style={styles.textArea}>
          <Text style={styles.headline}>{onboarding.welcomeHeadline}</Text>
          <Text style={styles.subheadline}>
            {onboarding.welcomeSubheadline}
          </Text>
        </View>
      </View>

      <AnimatedPressable onPress={handleNext} style={styles.ctaButton}>
        <Text style={styles.ctaText}>{onboarding.getStarted}</Text>
        <ArrowRight size={20} color={styles.ctaText.color} strokeWidth={2.4} />
      </AnimatedPressable>
    </View>
  );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  previewArea: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  previewPlaceholder: {
    width: 220,
    height: 220,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewLabel: {
    ...typography.title,
    color: theme.colors.textSecondary,
    fontSize: 36,
    letterSpacing: 8,
  },
  textArea: {
    alignItems: 'center',
  },
  headline: {
    ...typography.title,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subheadline: {
    ...typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.md,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: theme.colors.accent,
    paddingVertical: spacing.md,
    borderRadius: 16,
    marginTop: spacing.lg,
  },
  ctaText: {
    ...typography.bodyMedium,
    color: theme.colors.accentForeground,
    fontSize: 17,
  },
});
