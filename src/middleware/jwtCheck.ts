// middleware/auth.ts
import { checkUser } from "../helper/checkUserExist";
import { verifyToken } from "../utils/jwt";

export function getUserFromToken(token: string) {
  try {
    const user = verifyToken(token);
    const checkResult = checkUser(user.username);
    if (!checkResult) {
      throw new Error("user not find");
    }
    return user;
  } catch (error) {
    return null;
  }
}
