import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppTheme } from '../../theme';
import type { OnboardingStackParamList } from '../../app/navigation/types';

import OnboardingWelcomeScreen from './OnboardingWelcomeScreen';
import OnboardingGoalScreen from './OnboardingGoalScreen';
import OnboardingPainPointsScreen from './OnboardingPainPointsScreen';
import OnboardingSocialProofScreen from './OnboardingSocialProofScreen';
import OnboardingPreferencesScreen from './OnboardingPreferencesScreen';
import OnboardingPermissionScreen from './OnboardingPermissionScreen';
import OnboardingProcessingScreen from './OnboardingProcessingScreen';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export default function OnboardingNavigator(): React.JSX.Element {
  const theme = useAppTheme();
  const colors = theme.colors;

  return (
    <Stack.Navigator
      initialRouteName="OnboardingWelcome"
      screenOptions={{
        contentStyle: { backgroundColor: colors.background },
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerShadowVisible: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="OnboardingWelcome"
        component={OnboardingWelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OnboardingGoal"
        component={OnboardingGoalScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OnboardingPainPoints"
        component={OnboardingPainPointsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OnboardingSocialProof"
        component={OnboardingSocialProofScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OnboardingPreferences"
        component={OnboardingPreferencesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OnboardingPermission"
        component={OnboardingPermissionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OnboardingProcessing"
        component={OnboardingProcessingScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
