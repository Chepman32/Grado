import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppTheme } from '../../theme';
import type { RootStackParamList } from './types';
import { useTranslation } from '../../i18n/useTranslation';
import { useOnboardingStore } from '../../store/useOnboardingStore';

import SplashScreen from '../../screens/SplashScreen';
import OnboardingNavigator from '../../screens/onboarding/OnboardingNavigator';
import HomeScreen from '../../screens/HomeScreen';
import EditorScreen from '../../screens/EditorScreen';
import ExportScreen from '../../screens/ExportScreen';
import SettingsScreen from '../../screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator(): React.JSX.Element {
  const theme = useAppTheme();
  const colors = theme.colors;
  const { t } = useTranslation();
  const onboardingCompleted = useOnboardingStore((state) => state.completed);

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        contentStyle: { backgroundColor: colors.background },
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Onboarding"
        component={OnboardingNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Editor"
        component={EditorScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Export"
        component={ExportScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: true,
          title: t.settingsTitle,
          headerBackVisible: true,
        }}
      />
    </Stack.Navigator>
  );
}
