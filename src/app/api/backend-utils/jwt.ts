import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
const JWT_SECRET = process.env.JWT_SECRET;

export default function verifyToken() {
  const CookieStore = cookies();
  try {
    const token = CookieStore.get("token");
    if (!token) return null;
    return jwt.verify(token.value, JWT_SECRET!) as { userId: string };
  } catch (error) {
    return null;
  }
}
