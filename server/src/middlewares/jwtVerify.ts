import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JWTToken {
    userId: number,
    username: string
}

export interface AuthRequest extends Request {
    user?: JWTToken
}

export default function jwtVerify(optional = false) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        const accessToken = req.cookies.accessToken;

        console.log(`Middleware (jwtVerify) Access Token Value: ${accessToken}`);
        
        if (accessToken == null) {
            if (optional) return next();
            return res.status(401).json({
                error: "Please login to continue"
            });
        }

        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as JWTToken;
            req.user = decoded;
            next();

        } catch (err) {
            if (optional) return next();
            return res.status(403).json({
                error: "Your session has expired. Please log in again.",
                error_code: "EXPIRED_ACCESS_TOKEN"
            });

        }
    }
}