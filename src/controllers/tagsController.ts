import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

import { TagsService } from "../services/tagsService";
import { Validators } from "../utils/validators";

export class TagsController {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(req: Request, res: Response) {
    // @ts-ignore
    const { user } = req;

    if (!user) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    const { name } = req.body;
    const requiredFields = { name };

    if (!Validators.validateRequiredFields(res, requiredFields)) {
      return;
    }

    const tagsService = new TagsService(this.prisma);

    const tag = await tagsService.create({
      name,
      userId: user.id,
    });

    res.status(201).json(tag);
  }

  async update(req: Request, res: Response) {
    const { name } = req.body;
    const id = req.params.id;

    const requiredFields = { name };

    if (!Validators.validateRequiredFields(res, requiredFields)) {
      return;
    }

    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    const tagsService = new TagsService(this.prisma);
    const tag = await tagsService.update({
      id,
      name,
    });

    res.status(200).json(tag);
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    const tagsService = new TagsService(this.prisma);
    await tagsService.delete({
      id,
    });

    res.status(200).json({
      message: "Tag deleted successfully",
    });
  }

  async fetchAll(req: Request, res: Response) {
    // @ts-ignore
    const { user } = req;

    if (!user) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    const tagsService = new TagsService(this.prisma);
    const tags = await tagsService.fetchAll({
      userId: user.id,
    });

    res.status(200).json(
      tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        createdAt: tag.createdAt,
      }))
    );
  }
}
