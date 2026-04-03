import { Request, Response, NextFunction } from "express";

export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    return res.status(500).json({
        error: "Server Error"
    })
}