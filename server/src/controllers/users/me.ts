import type { Response } from "express"
import type { AuthRequest } from "../../middlewares/jwtVerify.js"

export default async function me(req: AuthRequest, res: Response) {
    return res.json({
        username: req.user?.username ?? "Guest"
    });
}