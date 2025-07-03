import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import { CarsService } from "../services/carsService";
import { Validators } from "../utils/validators";
import { redis } from "../lib/redis";
import { FipeService } from "../services/fipeService";
import { ArraysUtils } from "../utils/arrays";

export class CarsController {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async register(req: Request, res: Response) {
    try {
      // @ts-ignore
      const { user } = req;

      const { plate, model, brandId, serviceId } = req.body;
      const requiredFields = { plate, model, brandId, serviceId };

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
      const carWithSamePlate = await carsService.findCarByPlate({
        plate,
        accountId: user.accountId,
      });

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
        brandId,
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

  async findUniqueByPlate(req: Request, res: Response) {
    // @ts-ignore
    const user = req.user;
    const plate = req.params.plate;

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!plate) {
      return res.status(400).json({ error: "plate is required" });
    }

    try {
      const carsService = new CarsService(this.prisma);
      const car = await carsService.findCarByPlate({
        plate,
        accountId: user.accountId,
      });

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

    const { plate, model, brandId } = req.body;
    const requiredFields = { plate, model, brandId };

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
        brandId,
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

  async fetchAllCarsFromFipeAPI(req: Request, res: Response) {
    // @ts-ignore
    const user = req.user;

    const { brandId, vehicleType, page, limit, query } = req.query;

    const requiredFields = { brandId, vehicleType };

    if (!Validators.validateRequiredFields(res, requiredFields)) {
      return;
    }

    if (!user) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    const cacheKey = `fipe-cars:page=${page || 1}:limit=${
      limit || 10
    }:brandId=${brandId}:vehicleType=${vehicleType}:query=${query}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      console.log(`[CACHED] ${req.originalUrl}`);
      return res.status(200).json(JSON.parse(cached));
    }

    const baseUrl = process.env.FIPE_URL;
    const fipeToken = process.env.FIPE_TOKEN;

    if (!baseUrl || !fipeToken) {
      throw new Error("Nenhuma URL ou token de acesso ao Fipe foi fornecido.");
    }

    const fipeService = new FipeService(baseUrl, fipeToken);
    const cars = await fipeService.getCarsByBrand({
      brandId: Number(brandId),
      vehicleType: vehicleType as "cars" | "motorcycles" | "trucks",
    });

    const filteredCars = cars.filter((car) => {
      return (
        car.name.toLowerCase().includes(String(query).toLowerCase()) ||
        car.code.toLowerCase().includes(String(query).toLowerCase())
      );
    });

    const response = ArraysUtils.paginate({
      items: filteredCars,
      limit: limit ? Number(limit) : 10,
      page: page ? Number(page) : 1,
    });

    const formattedResponse = {
      cars: response.data,
      metadata: response.pagination,
    };

    await redis.set(
      cacheKey,
      JSON.stringify(formattedResponse),
      "EX",
      60 * 60 * 24 * 7
    ); // 7 days

    res.status(200).json(formattedResponse);
  }
}
