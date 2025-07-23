import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

import { TwoFactorService } from "../services/twoFactorService";

export class TwoFactorController {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async generateSecret(req: Request, res: Response) {
    // @ts-ignore
    const user = req.user;
    const { type } = req.params;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!["totp", "code"].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    const twoFactorService = new TwoFactorService(this.prisma);

    if (type === "totp") {
      const response = await twoFactorService.setupTOTP({
        userId: user.id,
        email: user.email,
      });

      return res.status(200).json(response);
    }

    await twoFactorService.setupEmailCode({
      userId: user.id,
    });

    return res.status(200).json({ message: "Email code setup successfully" });
  }

  async verifyCode(req: Request, res: Response) {
    // @ts-ignore
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Code is required" });
    }

    const twoFactorService = new TwoFactorService(this.prisma);

    if (user.twoFactorType === "totp") {
      const response = await twoFactorService.verifyTOTP({
        userId: user.id,
        token: code,
        twoFactorSecret: user.twoFactorSecret as string,
      });
    }

    res.status(200).json({ message: "Code verified successfully" });
  }
}
