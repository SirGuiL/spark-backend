import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import { UsersService } from "../services/usersService";
import { Validators } from "../utils/validators";

export class UsersController {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(req: Request, res: Response) {
    try {
      const { email, password, name, accountId } = req.body;
      const requiredFields = { email, password, name, accountId };

      if (!Validators.validateRequiredFields(res, requiredFields)) {
        return;
      }

      const usersService = new UsersService(this.prisma);
      const user = await usersService.create({
        email,
        password,
        name,
        accountId,
      });

      res.status(201).json(user);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  }

  async getByToken(req: Request, res: Response) {
    try {
      // @ts-ignore
      const { user } = req;

      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!user.isActive) {
        return res.status(400).json({ error: "User is inactive" });
      }

      res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  async update(req: Request, res: Response) {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    try {
      const { name, email } = req.body;

      const usersService = new UsersService(this.prisma);
      const userUpdated = await usersService.update({
        id,
        email,
        name,
      });

      res.status(200).json(userUpdated);
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  async activate(req: Request, res: Response) {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    try {
      const usersService = new UsersService(this.prisma);
      const user = await usersService.me({ id });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.isActive) {
        return res.status(400).json({ error: "User is already active" });
      }

      await usersService.activate({ id });

      res.status(200).json({ message: "User activated successfully" });
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  async deactivate(req: Request, res: Response) {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    try {
      const usersService = new UsersService(this.prisma);
      const user = await usersService.me({ id });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!user.isActive) {
        return res.status(400).json({ error: "User is already inactive" });
      }

      await usersService.deactivate({ id });

      res.status(200).json({ message: "User deactivated successfully" });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
}
