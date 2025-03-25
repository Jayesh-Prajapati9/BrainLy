import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";

export const userMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const header = req.headers["authorization"];
    const decoded = jwt.verify(header as string, JWT_SECRET);

    if (decoded) {
        if (typeof decoded === "string") {
            res.status(403).json({
                message: "You are not logged in",
            });
        }
        req.body.userId = (decoded as JwtPayload).id;
        next();
    }
};
