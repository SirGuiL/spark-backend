import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import { Validators } from "../utils/validators";
import { ServicesService } from "../services/servicesService";

export class ServicesController {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(req: Request, res: Response) {
    try {
      // @ts-ignore
      const { user } = req;

      if (!user) {
        res.status(400).json({ error: "User not found" });
        return;
      }

      const { name, amount, tags } = req.body;
      const requiredFields = { name, amount, tags };

      if (!Validators.validateRequiredFields(res, requiredFields)) {
        return;
      }

      if (tags && !Array.isArray(tags)) {
        return res.status(400).json({ error: "Tags must be an array" });
      }

      const servicesService = new ServicesService(this.prisma);

      const service = await servicesService.create({
        name,
        amount,
        userId: user.id,
      });

      if (tags) {
        await servicesService.addTags({
          userId: user.id,
          serviceId: service.id,
          tags,
        });
      }

      res.status(201).json({
        ...service,
        tags,
      });
    } catch (error: any) {
      res.status(400).json({ error });
    }
  }

  async fetchAll(req: Request, res: Response) {
    try {
      // @ts-ignore
      const user = req.user;

      const { page } = req.query;

      if (!user) {
        res.status(400).json({ error: "User not found" });
        return;
      }

      const servicesService = new ServicesService(this.prisma);
      const services = await servicesService.fetchAll({
        userId: user.id,
        page: Number(page),
      });

      res.status(200).json(services);
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  async findUniqueById(req: Request, res: Response) {
    // @ts-ignore
    const { user } = req;

    if (!user) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    try {
      const servicesService = new ServicesService(this.prisma);
      const service = await servicesService.findUniqueById({
        id,
        userId: user.id,
      });

      if (!service) {
        return res.status(404).json({ error: "service not found" });
      }

      res.status(200).json(service);
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  async update(req: Request, res: Response) {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    const { amount, name } = req.body;

    try {
      const servicesService = new ServicesService(this.prisma);
      const updatedService = await servicesService.update({
        id,
        amount,
        name,
      });

      res.status(200).json(updatedService);
    } catch (error: any) {
      res.status(400).json({ error });
    }
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    try {
      const servicesService = new ServicesService(this.prisma);
      await servicesService.delete({ id });

      res.status(204).json({ message: "Service deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
