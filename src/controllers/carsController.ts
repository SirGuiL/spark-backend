import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import { CarsService } from "../services/carsService";
import { Validators } from "../utils/validators";

export class CarsController {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async register(req: Request, res: Response) {
    try {
      // @ts-ignore
      const { user } = req;

      const { plate, model, brand, serviceId } = req.body;
      const requiredFields = { plate, model, brand, serviceId };

      if (!user) {
        res.status(400).json({
          error: "User not found",
        });
        return;
      }

      if (!Validators.validateRequiredFields(res, requiredFields)) {
        return;
      }

      if (!Validators.isValidLicentePlate(plate)) {
        res.status(400).json({ error: "Invalid plate" });
        return;
      }

      const carsService = new CarsService(this.prisma);
      const carWithSamePlate = await carsService.findCarByPlate({ plate });

      if (carWithSamePlate) {
        const register = await carsService.addRegister({
          carId: carWithSamePlate.id,
          serviceId,
          userId: user.id,
        });

        res.status(200).json({
          message: "Car registered successfully",
          register,
        });

        return;
      }

      const car = await carsService.create({
        plate,
        model,
        brand,
        userId: user.id,
      });

      const register = await carsService.addRegister({
        carId: car.id,
        serviceId,
        userId: user.id,
      });

      res.status(201).json({
        message: "Car registered successfully",
        register,
      });
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

  async fetchAll(req: Request, res: Response) {
    try {
      // @ts-ignore
      const user = req.user;

      if (!user) {
        res.status(400).json({ error: "User not found" });
        return;
      }

      const carsService = new CarsService(this.prisma);
      const cars = await carsService.fetchAll({
        userId: user.id,
      });

      res.status(200).json(cars);
    } catch (error: any) {
      res.status(400).json({ error });
    }
  }

  async update(req: Request, res: Response) {
    const id = req.params.id;

    const { plate, model, brand } = req.body;
    const requiredFields = { plate, model, brand };

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

  async findNotFinishedCarsServices(req: Request, res: Response) {
    // @ts-ignore
    const user = req.user;

    if (!user) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    const carsService = new CarsService(this.prisma);
    const notFinishedServices = await carsService.findNotFinishedCarsServices({
      userId: user.id,
    });

    res.status(200).json(notFinishedServices);
  }
}
