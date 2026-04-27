export type RootStackParamList = {
  Splash: undefined;
  Onboarding: { screen?: OnboardingScreenName } | undefined;
  Home: undefined;
  Editor: { projectId: string };
  Export: {
    videoUri: string;
    filterId: string;
    intensity: number;
    exportFormat: 'mp4' | 'hevc';
  };
  Settings: undefined;
};

export type OnboardingScreenName =
  | 'OnboardingWelcome'
  | 'OnboardingGoal'
  | 'OnboardingPainPoints'
  | 'OnboardingSocialProof'
  | 'OnboardingPreferences'
  | 'OnboardingPermission'
  | 'OnboardingProcessing';

export type OnboardingStackParamList = {
  OnboardingWelcome: undefined;
  OnboardingGoal: undefined;
  OnboardingPainPoints: undefined;
  OnboardingSocialProof: undefined;
  OnboardingPreferences: undefined;
  OnboardingPermission: undefined;
  OnboardingProcessing: undefined;
};
