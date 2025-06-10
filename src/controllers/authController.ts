import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

export class AuthController {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  login(req: Request, res: Response) {
    res.status(201);
  }

  logout(req: Request, res: Response) {
    res.status(201);
  }

  refresh(req: Request, res: Response) {
    res.status(201);
  }
}
