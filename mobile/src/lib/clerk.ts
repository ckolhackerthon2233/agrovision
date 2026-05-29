// Web-only entry point (Metro picks clerk.native.ts on iOS/Android).
// On web, @clerk/clerk-expo has no native-module deps, so a plain re-export works.
export { useAuth, useSignIn, useSignUp, ClerkProvider } from "@clerk/clerk-expo";
