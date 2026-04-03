import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./jwtVerify";

export default function catchError(controller: (req: AuthRequest, res: Response) => Promise<Response | void>) {
    return function (req: AuthRequest, res: Response, next: NextFunction) {
        Promise.resolve(controller(req, res)).catch(next);
    }
}
