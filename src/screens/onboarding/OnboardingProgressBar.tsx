import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useAppTheme } from '../../theme';

interface Props {
  currentStep: number;
  totalSteps: number;
}

export default function OnboardingProgressBar({ currentStep, totalSteps }: Props): React.JSX.Element {
  const theme = useAppTheme();
  const progress = totalSteps > 0 ? currentStep / totalSteps : 0;

  const fillStyle = useAnimatedStyle(() => ({
    width: withTiming(`${progress * 100}%`, { duration: 300 }),
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surfaceLight }]}>
      <Animated.View
        style={[
          styles.fill,
          { backgroundColor: theme.colors.accent },
          fillStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 3,
    width: '100%',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 1.5,
  },
});
