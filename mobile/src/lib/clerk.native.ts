import React, { type ReactNode } from "react";
import Constants from "expo-constants";
import { create } from "zustand";
import { tokenCache } from "./tokenCache";

// Metro loads this file on iOS/Android instead of clerk.ts.
// @clerk/clerk-expo's barrel always triggers useSSO → expo-auth-session →
// ExpoCryptoAES, which is absent in Expo Go.  We solve this by:
//   • Expo Go  (appOwnership === "expo") → stateful MOCK auth, never touch
//     clerk-expo.  This lets you walk the entire app without a real backend.
//   • Dev build (appOwnership !== "expo") → defer the require to call-time;
//     the native module exists there so real Clerk works.

const isExpoGo = Constants.appOwnership === "expo";

// ── Shared shapes ─────────────────────────────────────────────────────────
type AuthState = {
  isSignedIn: boolean | undefined;
  isLoaded: boolean;
  userId?: string | null;
  getToken?: () => Promise<string | null>;
};
type SignInState = { signIn: any; setActive: any; isLoaded: boolean };
type SignUpState = { signUp: any; setActive: any; isLoaded: boolean };
type DevAuthState = { isExpoGo: boolean; enter: () => void; leave: () => void };

// ── Mock auth (Expo Go only) ──────────────────────────────────────────────
// In-memory session flag. Tapping Sign In / Create Account with any input — or
// the dev "Explore" shortcut — flips it true, and the route guards then let you
// into the tabs. It resets on reload, which drops you back at onboarding/auth
// so you can inspect those screens too.
const useMockSession = create<{
  signedIn: boolean;
  enter: () => void;
  leave: () => void;
}>((set) => ({
  signedIn: false,
  enter: () => set({ signedIn: true }),
  leave: () => set({ signedIn: false }),
}));

function mockUseAuth(): AuthState {
  const signedIn = useMockSession((s) => s.signedIn);
  // Map the mock session to the seeded demo user so the app shows data and
  // CRUD persists to Postgres under "user_demo" while testing in Expo Go.
  return {
    isSignedIn: signedIn,
    isLoaded: true,
    userId: signedIn ? "user_demo" : null,
    getToken: async () => null,
  };
}

function mockUseSignIn(): SignInState {
  const enter = useMockSession((s) => s.enter);
  return {
    isLoaded: true,
    signIn: {
      create: async () => ({ status: "complete", createdSessionId: "mock-session" }),
    },
    setActive: async () => enter(),
  };
}

function mockUseSignUp(): SignUpState {
  const enter = useMockSession((s) => s.enter);
  return {
    isLoaded: true,
    signUp: {
      create: async () => ({ status: "complete", createdSessionId: "mock-session" }),
    },
    setActive: async () => enter(),
  };
}

function mockUseDevAuth(): DevAuthState {
  const enter = useMockSession((s) => s.enter);
  const leave = useMockSession((s) => s.leave);
  return { isExpoGo: true, enter, leave };
}

// ── Live hooks (dev builds only) ──────────────────────────────────────────
// require() runs inside the hook body, not at module-evaluation time, so it
// only executes when a component renders — and only in dev builds where
// ExpoCryptoAES is present.
/* eslint-disable @typescript-eslint/no-var-requires */
function useAuthDev(): AuthState {
  return require("@clerk/clerk-expo").useAuth();
}
function useSignInDev(): SignInState {
  return require("@clerk/clerk-expo").useSignIn();
}
function useSignUpDev(): SignUpState {
  return require("@clerk/clerk-expo").useSignUp();
}
function useDevAuthLive(): DevAuthState {
  return { isExpoGo: false, enter: () => {}, leave: () => {} };
}

// ── Provider ──────────────────────────────────────────────────────────────
// Expo Go: pass children straight through — the mock hooks need no context.
// Dev build: render the real ClerkProvider, injecting the SecureStore cache.
type ProviderProps = { children: ReactNode; publishableKey?: string };

function PassthroughProvider({ children }: ProviderProps) {
  return React.createElement(React.Fragment, null, children);
}
function ClerkProviderDev(props: ProviderProps) {
  const Real = require("@clerk/clerk-expo").ClerkProvider;
  return React.createElement(Real, { ...props, tokenCache });
}

// ── Exports ───────────────────────────────────────────────────────────────

export const useAuth: () => AuthState = isExpoGo ? mockUseAuth : useAuthDev;

export const useSignIn: () => SignInState = isExpoGo ? mockUseSignIn : useSignInDev;

export const useSignUp: () => SignUpState = isExpoGo ? mockUseSignUp : useSignUpDev;

export const useDevAuth: () => DevAuthState =
  isExpoGo ? mockUseDevAuth : useDevAuthLive;

export const ClerkProvider: (props: ProviderProps) => React.ReactElement =
  isExpoGo ? PassthroughProvider : ClerkProviderDev;
