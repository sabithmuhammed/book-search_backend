import bcrypt from "bcryptjs";
export class BcryptUtils {
    async comparePassword(password:string,hashedPassword:string): Promise<boolean> {
        const passwordMatch = await bcrypt.compare(password, hashedPassword);
        return passwordMatch;
    }
}