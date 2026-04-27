import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createFileStorage } from './fileStorage';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type OnboardingGoal =
  | 'travel-cinematic'
  | 'social-media'
  | 'brand-consistent'
  | 'fix-dull'
  | 'explore-fun'
  | 'learn-basics';

export type OnboardingPainPoint =
  | 'desktop-too-complex'
  | 'cloud-privacy'
  | 'ads-watermarks'
  | 'dont-know-start'
  | 'takes-too-long'
  | 'want-more-control';

export type FilterCategory =
  | 'warm-cinematic'
  | 'cool-moody'
  | 'bold-stylised'
  | 'clean-minimal'
  | 'dramatic'
  | 'dreamy';

export interface OnboardingState {
  completed: boolean;
  goal: OnboardingGoal | null;
  painPoints: OnboardingPainPoint[];
  filterCategories: FilterCategory[];
  demoFiltersTried: string[];
  permissionGranted: boolean;
}

interface OnboardingActions {
  setCompleted: (completed: boolean) => void;
  setGoal: (goal: OnboardingGoal) => void;
  togglePainPoint: (painPoint: OnboardingPainPoint) => void;
  toggleFilterCategory: (category: FilterCategory) => void;
  addDemoFilterTried: (filterId: string) => void;
  setPermissionGranted: (granted: boolean) => void;
  reset: () => void;
}

const INITIAL_STATE: OnboardingState = {
  completed: false,
  goal: null,
  painPoints: [],
  filterCategories: [],
  demoFiltersTried: [],
  permissionGranted: false,
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useOnboardingStore = create<OnboardingState & OnboardingActions>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      setCompleted: (completed) => set({ completed }),
      setGoal: (goal) => set({ goal }),
      togglePainPoint: (painPoint) =>
        set((state) => {
          const exists = state.painPoints.includes(painPoint);
          return {
            painPoints: exists
              ? state.painPoints.filter((p) => p !== painPoint)
              : [...state.painPoints, painPoint],
          };
        }),
      toggleFilterCategory: (category) =>
        set((state) => {
          const exists = state.filterCategories.includes(category);
          return {
            filterCategories: exists
              ? state.filterCategories.filter((c) => c !== category)
              : [...state.filterCategories, category],
          };
        }),
      addDemoFilterTried: (filterId) =>
        set((state) => {
          if (state.demoFiltersTried.includes(filterId)) return state;
          return { demoFiltersTried: [...state.demoFiltersTried, filterId] };
        }),
      setPermissionGranted: (granted) => set({ permissionGranted: granted }),
      reset: () => set(INITIAL_STATE),
    }),
    {
      name: 'grado-onboarding',
      version: 1,
      storage: createJSONStorage(() => createFileStorage()),
      partialize: (state) => ({
        completed: state.completed,
        goal: state.goal,
        painPoints: state.painPoints,
        filterCategories: state.filterCategories,
        demoFiltersTried: state.demoFiltersTried,
        permissionGranted: state.permissionGranted,
      }),
    },
  ),
);
