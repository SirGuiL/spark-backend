import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UsersService } from "../services/usersService";
import { PrismaClient } from "@prisma/client";

const ACCESS_JWT_SECRET = process.env.ACCESS_JWT_SECRET!;

const prisma = new PrismaClient();

export async function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, ACCESS_JWT_SECRET) as {
      userId: string;
    } & JwtPayload;

    const usersService = new UsersService(prisma);
    const user = await usersService.me({ id: decoded.userId });

    // @ts-ignore
    req.user = user;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Invalid token" });
  }
}
