import { Request, Response } from "express";
import { PrismaClient, Type } from "@prisma/client";
import { BrandsService } from "../services/brandsService";
import { redis } from "../lib/redis";

export class BrandsController {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async fetchAll(req: Request, res: Response) {
    // @ts-ignore
    const user = req.user;
    const { type, page, limit, query } = req.query;

    const cacheKey = `car-brands:page=${page || 1}:limit=${
      limit || 10
    }:type=${type}:query=${query}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      console.log(`[CACHED] ${req.originalUrl}`);
      return res.status(200).json(JSON.parse(cached));
    }

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
    const brands = await brandsService.fetchAll({
      type: type as Type,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      query: query ? String(query) : "",
    });

    await redis.set(cacheKey, JSON.stringify(brands), "EX", 60 * 60 * 24); // 1 day

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
