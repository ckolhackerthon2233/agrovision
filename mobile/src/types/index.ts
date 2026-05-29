export type RootStackParamList = {
  '(onboarding)': undefined;
  '(auth)': undefined;
  '(app)': undefined;
};

export type OnboardingStackParamList = {
  index: undefined;
};

export type AuthStackParamList = {
  index: undefined;
  login: undefined;
  register: undefined;
};

export type AppStackParamList = {
  index: undefined;
  'crops/index': undefined;
  'crops/[id]': { id: string };
  'market/index': undefined;
  'analytics/index': undefined;
  'settings/index': undefined;
};

export interface SlideData {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  image: ReturnType<typeof require>;
}
