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
      const { name, amount, userId, tags } = req.body;
      const requiredFields = { name, amount, userId, tags };

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
        userId,
      });

      if (tags) {
        await servicesService.addTags({ serviceId: service.id, tags });
      }

      res.status(201).json(service);
    } catch (error: any) {
      res.status(400).json({ error });
    }
  }

  async fetchAll(_: Request, res: Response) {
    try {
      const servicesService = new ServicesService(this.prisma);
      const services = await servicesService.fetchAll();

      res.status(200).json(services);
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  async findUniqueById(req: Request, res: Response) {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    try {
      const servicesService = new ServicesService(this.prisma);
      const service = await servicesService.findUniqueById({ id });

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

    const { amount, name, userId } = req.body;
    const requiredFields = { amount, name, userId };

    if (!Validators.validateRequiredFields(res, requiredFields)) {
      return;
    }

    try {
      const servicesService = new ServicesService(this.prisma);
      const updatedService = await servicesService.update({
        id,
        amount,
        name,
        userId,
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
