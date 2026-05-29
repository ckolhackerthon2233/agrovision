import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { HttpError } from "../lib/http-error";
import { env } from "../env";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// Resolves the current user id and ensures a matching User row exists.
//   1. Bearer token + CLERK_SECRET_KEY  → verify the Clerk session (secure).
//   2. Bearer token, no secret (DEV)     → trust the token's `sub` unverified.
//   3. x-user-id header (DEV / Expo Go)  → trust it directly.
export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const bearer = req.header("authorization")?.replace(/^Bearer\s+/i, "");
    let userId: string | undefined;

    if (bearer && env.clerkSecretKey) {
      const { verifyToken } = await import("@clerk/backend");
      const payload = await verifyToken(bearer, { secretKey: env.clerkSecretKey });
      userId = payload.sub;
    } else if (bearer) {
      userId = decodeJwtSub(bearer);
    } else {
      userId = req.header("x-user-id") ?? undefined;
    }

    if (!userId) throw new HttpError(401, "Unauthorized");

    await prisma.user.upsert({ where: { id: userId }, update: {}, create: { id: userId } });
    req.userId = userId;
    next();
  } catch (err) {
    next(err instanceof HttpError ? err : new HttpError(401, "Unauthorized"));
  }
}

// DEV ONLY: read the `sub` claim from a JWT without verifying the signature.
// Used when CLERK_SECRET_KEY is unset so real Clerk tokens still identify a user
// during local testing. Always set CLERK_SECRET_KEY in production.
function decodeJwtSub(token: string): string | undefined {
  try {
    const parts = token.split(".");
    const payloadPart = parts[1];
    if (!payloadPart) return undefined;
    const json = Buffer.from(payloadPart.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
    const claims = JSON.parse(json) as { sub?: string };
    return claims.sub;
  } catch {
    return undefined;
  }
}
