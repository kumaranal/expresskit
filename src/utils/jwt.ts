import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const secretKey = process.env.JWT_SECRET_KEY || "your-secret-key";

export function generateToken(payload: object, expiresIn: string = "1h") {
  return jwt.sign(payload, secretKey, { expiresIn });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}
