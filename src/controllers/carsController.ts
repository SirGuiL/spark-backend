import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import { CarsService } from "../services/carsService";
import { Validators } from "../utils/validators";

export class CarsController {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(req: Request, res: Response) {
    try {
      const { plate, model, status, brand, serviceId, userId } = req.body;
      const requiredFields = { plate, model, status, brand, serviceId, userId };

      if (!Validators.validateRequiredFields(res, requiredFields)) {
        return;
      }

      const carsService = new CarsService(this.prisma);

      const car = await carsService.create({
        plate,
        model,
        status,
        brand,
        serviceId,
        userId,
      });

      res.status(201).json(car);
    } catch (error: any) {
      res.status(400).json({ error: error });
    }
  }

  async findUniqueById(req: Request, res: Response) {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    try {
      const carsService = new CarsService(this.prisma);
      const car = await carsService.findUniqueById({ id });

      if (!car) {
        return res.status(404).json({ error: "Car not found" });
      }

      res.status(200).json(car);
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  async fetchAll(_: Request, res: Response) {
    try {
      const carsService = new CarsService(this.prisma);
      const cars = await carsService.fetchAll();

      res.status(200).json(cars);
    } catch (error: any) {
      res.status(400).json({ error });
    }
  }

  async update(req: Request, res: Response) {
    const id = req.params.id;

    const { plate, model, brand, serviceId } = req.body;
    const requiredFields = { plate, model, brand, serviceId };

    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    if (!Validators.validateRequiredFields(res, requiredFields)) {
      return;
    }

    try {
      const carsService = new CarsService(this.prisma);
      const updatedCar = await carsService.update({
        plate,
        model,
        brand,
        serviceId,
        id,
      });

      res.status(200).json(updatedCar);
    } catch (error: any) {
      res.status(400).json({ error: error });
    }
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    try {
      const carsService = new CarsService(this.prisma);
      await carsService.delete({ id });

      res.status(204).json({ message: "Car deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error });
    }
  }
}
