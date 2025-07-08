import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { add } from "date-fns";
import nodemailer from "nodemailer";

import { UsersService } from "../services/usersService";
import { Validators } from "../utils/validators";

export class UsersController {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(req: Request, res: Response) {
    try {
      const { email, password, name, accountId, role } = req.body;
      const requiredFields = { email, name, accountId };

      if (!Validators.validateRequiredFields(res, requiredFields)) {
        return;
      }

      const usersService = new UsersService(this.prisma);
      await usersService.create({
        email,
        password,
        name,
        accountId,
        role,
      });

      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id;

    // @ts-ignore
    const { user } = req;

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    if (user.role !== "ADMIN") {
      return res.status(400).json({ error: "Only admin can delete users" });
    }

    try {
      const usersService = new UsersService(this.prisma);
      await usersService.delete({ id });

      res.status(204).json({ message: "User deleted successfully" });
    } catch (error) {
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
        createdAt: user.createdAt,
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

  async updatePassword(req: Request, res: Response) {
    const id = req.params.id;
    const { password } = req.body;

    const requiredFields = { id, password };

    if (!Validators.validateRequiredFields(res, requiredFields)) {
      return;
    }

    const encodedPassword = await bcrypt.hash(password, 10);

    const usersService = new UsersService(this.prisma);
    await usersService.update({ id, password: encodedPassword });

    res.status(200).json({ message: "Password updated successfully" });
  }

  async sendUpdatePasswordLink(req: Request, res: Response) {
    // @ts-ignore
    const { user } = req;
    const frontendUrl = req.get("X-Frontend-URL");

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const expirationTime = add(new Date(), { minutes: 15 });

    const usersService = new UsersService(this.prisma);

    await usersService.sendUpdatePasswordLink({
      email: user.email,
      id: user.id,
      frontendUrl: String(frontendUrl),
      expirationTimeParam: expirationTime.toISOString(),
    });

    res.status(200).json({ message: "Link sent successfully" });
  }
}
