import { Request, Response } from "express";
import { PrismaClient, Type } from "@prisma/client";
import { BrandsService } from "../services/brandsService";

export class BrandsController {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async fetchAll(req: Request, res: Response) {
    // @ts-ignore
    const user = req.user;
    const { type } = req.query;

    if (!user) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    if (!type) {
      res.status(400).json({ error: "Type is required" });
      return;
    }

    if (!["cars", "motorcycles", "trucks"].includes(String(type))) {
      res.status(400).json({ error: "Type is invalid" });
      return;
    }

    const brandsService = new BrandsService(this.prisma);
    const brands = await brandsService.fetchAll({ type: type as Type });

    res.status(200).json(brands);
  }

  async syncBrands(req: Request, res: Response) {
    // @ts-ignore
    const user = req.user;

    if (!user) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    const brandsService = new BrandsService(this.prisma);
    const brands = await brandsService.syncBrands();

    res.status(200).json({ message: "Brands synced successfully", brands });
  }
}
