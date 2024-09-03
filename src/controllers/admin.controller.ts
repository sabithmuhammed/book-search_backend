import { Request, Response } from "express";
import { AdminService } from "../services/admin.service";
import { BcryptUtils } from "../utils/bcrypt.utils";
import JwtCreate from "../utils/jwt.utils";

const adminService = new AdminService();
const bcryptUtils = new BcryptUtils();
const jwtCreate = new JwtCreate();

export class AdminController {
    static async adminLogin(req: Request, res: Response) {
        try {
            const {
                username,
                password,
            }: { username: string; password: string } = req.body;
            const admin = await adminService.findByEmail(username);
            if (!admin) {
                return res
                    .status(401)
                    .json({ message: "Incorrect username or password" });
            }
            const passwordCorrect = await bcryptUtils.comparePassword(
                password,
                admin.password
            );
            if (passwordCorrect) {
                const token = jwtCreate.generateAccessToken(
                    admin._id.toString()
                );
                return res.status(200).json({
                    accessToken:token,
                    userData: {
                        name: admin.name,
                        email: admin.email,
                    },
                });
            } else {
                return res.status(401).json({
                    message: "Incorrect username or password",
                });
            }
        } catch (error) {
            console.log(error);

            res.status(500).json({ error: "Error while trying to log-in" });
        }
    }
}
