
import jwt, { JwtPayload } from "jsonwebtoken";


export default class JwtCreate  {
    generateAccessToken(userId: string): string {
        const KEY = process.env.JWT_KEY;
        if (KEY) {
            const exp = Math.floor(Date.now() / 1000) + 30;
            return jwt.sign({ userId, exp, iat: Date.now() / 1000 }, KEY);
        }
        throw new Error("JWT key is not defined");
    }
}