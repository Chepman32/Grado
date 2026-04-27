import React from 'react';
import { StyleSheet, View, Text, Linking, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight, Images } from 'lucide-react-native';
// TODO: Install react-native-permissions for production permission handling.
// import { request, RESULTS } from 'react-native-permissions';
const RESULTS = { GRANTED: 'granted', LIMITED: 'limited' };
const request = async () => RESULTS.GRANTED;
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../app/navigation/types';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import AnimatedPressable from '../../components/shared/AnimatedPressable';
import { useTranslation } from '../../i18n/useTranslation';
import OnboardingProgressBar from './OnboardingProgressBar';
import { spacing, typography, useThemedStyles, type AppTheme } from '../../theme';

interface Props extends NativeStackScreenProps<OnboardingStackParamList, 'OnboardingPermission'> {}

export default function OnboardingPermissionScreen({ navigation }: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const { t, onboarding } = useTranslation();
  const setPermissionGranted = useOnboardingStore((s) => s.setPermissionGranted);

  const handleGrant = async () => {
    try {
      const result = await request();
      if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) {
        setPermissionGranted(true);
        navigation.navigate('OnboardingProcessing');
      } else {
        Alert.alert(
          onboarding.permissionAlertTitle,
          onboarding.permissionAlertBody,
          [
            { text: onboarding.notNow, style: 'cancel' },
            { text: t.openSettings, onPress: () => Linking.openSettings() },
          ],
        );
      }
    } catch {
      // Fallback if react-native-permissions isn't available
      setPermissionGranted(true);
      navigation.navigate('OnboardingProcessing');
    }
  };

  const handleSkip = () => {
    navigation.navigate('OnboardingProcessing');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.lg }]}>
      <OnboardingProgressBar currentStep={5} totalSteps={5} />

      <View style={styles.content}>
        <View style={styles.iconArea}>
          <View style={styles.iconCircle}>
            <Images size={40} color={styles.iconColor.color} strokeWidth={1.5} />
          </View>
        </View>

        <Text style={styles.headline}>{onboarding.permissionHeadline}</Text>
        <Text style={styles.subheadline}>
          {onboarding.permissionSubheadline}
        </Text>

        <View style={styles.bullets}>
          {onboarding.permissionBullets.map((bullet) => (
            <View key={bullet} style={styles.bulletRow}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>{bullet}</Text>
            </View>
          ))}
        </View>
      </View>

      <AnimatedPressable onPress={handleGrant} style={styles.ctaButton}>
        <Text style={styles.ctaText}>{t.grantAccess}</Text>
        <ArrowRight size={18} color={styles.ctaText.color} strokeWidth={2.4} />
      </AnimatedPressable>

      <AnimatedPressable onPress={handleSkip} style={styles.skipButton}>
        <Text style={styles.skipText}>{onboarding.notNow}</Text>
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
  iconArea: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconColor: {
    color: theme.colors.accent,
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
    marginBottom: spacing.lg,
  },
  bullets: {
    gap: spacing.md,
    paddingHorizontal: spacing.md,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.accent,
  },
  bulletText: {
    ...typography.body,
    color: theme.colors.textSecondary,
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
  skipButton: {
    alignSelf: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  skipText: {
    ...typography.body,
    color: theme.colors.textSecondary,
  },
});
