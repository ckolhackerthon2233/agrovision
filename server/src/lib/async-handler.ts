import { NextFunction, Request, Response } from "express";

// Forwards rejected promises from async route handlers to Express' error
// middleware (Express 4 does not catch async throws on its own).
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);
