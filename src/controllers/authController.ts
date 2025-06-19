import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { Validators } from "../utils/validators";
import { AuthService } from "../services/authService";

export class AuthController {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const requiredFields = { email, password };

    if (!Validators.validateRequiredFields(res, requiredFields)) {
      return;
    }

    try {
      const authService = new AuthService(this.prisma);
      const token = await authService.login({ email, password });

      res.cookie("refreshToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
        path: "/",
      });

      res.status(200).json({ message: "Logado com sucesso!" });
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const authService = new AuthService(this.prisma);
      const accessToken = await authService.generateAccessToken({
        refreshToken,
      });

      res.status(200).json({ accessToken });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
}
