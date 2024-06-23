// middleware/auth.ts
import { verifyToken } from "../utils/jwt";

export function getUserFromToken(token: string) {
  try {
    const user = verifyToken(token);
    return user;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}
