import "dotenv/config";
import Express from "express";
import { PrismaClient } from "@prisma/client";
import { userMiddleware } from "./middlewares/userMiddleware";
import crypto from "crypto";
import Jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";

const app = Express();

const client = new PrismaClient();

app.listen(8080);
app.use(Express.json());

app.post("/api/v1/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.passowrd;

    const hashPassword = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

    const response = await client.user.create({
        data: {
            username: username,
            password: hashPassword,
        },
    });

    if (!response) {
        res.status(404).json({
            message: "Error in DB",
        });
    }

    res.status(200).json({
        message: "You have signed up Succesfully",
    });
});

app.post("/api/v1/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.passowrd;

    const hashPassword = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

    const response = await client.user.findUnique({
        where: {
            username: username,
            password: hashPassword,
        },
    });

    if (!response) {
        res.status(404).json({
            message: "Invalid Credentials",
        });
    }

    const token = Jwt.sign({ id: response?.id }, JWT_SECRET);

    res.status(200).json({
        token: token,
        message: "You have signed in Succesfully",
    });
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
    
});
