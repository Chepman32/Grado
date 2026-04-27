import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { StackActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../app/navigation/types';
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { useTranslation } from '../../i18n/useTranslation';
import { spacing, typography, useThemedStyles, type AppTheme } from '../../theme';

interface Props extends NativeStackScreenProps<OnboardingStackParamList, 'OnboardingProcessing'> {}

export default function OnboardingProcessingScreen({ navigation }: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const { onboarding } = useTranslation();
  const setCompleted = useOnboardingStore((s) => s.setCompleted);

  const rotation = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1200, easing: Easing.linear }),
      -1,
      false,
    );
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    const timer = setTimeout(() => {
      setCompleted(true);
      navigation.getParent()?.dispatch(StackActions.replace('Home'));
    }, 1800);

    return () => clearTimeout(timer);
  }, [navigation, pulse, rotation, setCompleted]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.lg }]}>
      <View style={styles.content}>
        <Animated.View style={[styles.ringContainer, pulseStyle]}>
          <Animated.View style={[styles.ring, spinStyle]}>
            <View style={styles.ringInner} />
          </Animated.View>
        </Animated.View>

        <Text style={styles.headline}>{onboarding.processingHeadline}</Text>
        <Text style={styles.subheadline}>
          {onboarding.processingSubheadline}
        </Text>
      </View>
    </View>
  );
}

const RING_SIZE = 80;
const RING_THICKNESS = 4;

const createStyles = (theme: AppTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: spacing.lg,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringContainer: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  ring: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: RING_THICKNESS,
    borderColor: theme.colors.surfaceLight,
    borderTopColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    width: RING_SIZE * 0.5,
    height: RING_SIZE * 0.5,
    borderRadius: (RING_SIZE * 0.5) / 2,
    backgroundColor: theme.colors.surface,
  },
  headline: {
    ...typography.title,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subheadline: {
    ...typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
