import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default function generateToken(userId: number, username: string, type: "access" | "refresh") {
    const secret = type === "access" ? process.env.ACCESS_TOKEN_SECRET as string : process.env.REFRESH_TOKEN_SECRET as string
    const expiredTiming = type === "access" ? "90s" : "7d"
    return jwt.sign({ userId, username }, secret, { expiresIn: expiredTiming })
}
