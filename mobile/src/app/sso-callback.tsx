import { Redirect } from "expo-router";

// Native stub — the /sso-callback route is only used for web OAuth redirects.
// On native, expo-router still evaluates every route at startup so this file
// must exist and export a valid component.
export default function SSOCallback() {
  return <Redirect href="/(auth)" />;
}
