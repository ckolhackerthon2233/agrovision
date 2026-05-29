// Bridges React auth state (Clerk / Expo Go mock) to the plain `apiFetch`
// function, which isn't a React component and can't call hooks. A top-level
// <AuthSync/> pushes the current user's token getter + id in here; apiFetch
// reads them on every request.

type TokenGetter = () => Promise<string | null>;

let tokenGetter: TokenGetter = async () => null;
let currentUserId: string | null = null;

export const authBridge = {
  setTokenGetter(fn: TokenGetter) {
    tokenGetter = fn;
  },
  setUserId(id: string | null) {
    currentUserId = id;
  },
  async getToken(): Promise<string | null> {
    try {
      return await tokenGetter();
    } catch {
      return null;
    }
  },
  getUserId(): string | null {
    return currentUserId;
  },
};
