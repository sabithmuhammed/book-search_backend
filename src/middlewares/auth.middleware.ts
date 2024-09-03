import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const adminAuth = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const token = req.headers.authorization;
        if (token) {
            
            const accessToken = token.split(" ")[1];
            
            const decoded = jwt.verify(
                accessToken,
                process.env.JWT_KEY as string
            ) as JwtPayload;
            
            if (decoded.userId) {
                next();
                return;
            }
        }

        res.status(401).json(
            "Unauthorized access, Invalid token"
        );
    } catch (error) {
        console.log(error);
        
        res.status(401).json(
            "Unauthorized access, Invalid token"
        );
    }
};
export default adminAuth;