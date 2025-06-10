import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

import { UsersService } from "../services/usersService";
import { Validators } from "../utils/validators";

export class UsersController {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  create(req: Request, res: Response) {
    const { email, password, name } = req.body;
    const requiredFields = { email, password, name };

    if (!Validators.validateRequiredFields(res, requiredFields)) {
      return;
    }

    try {
      const usersService = new UsersService(this.prisma);
      const user = usersService.create({
        email,
        password,
        name,
      });

      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error });
    }
  }

  me(req: Request, res: Response) {
    try {
      // @ts-ignore
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const usersService = new UsersService(this.prisma);
      // @ts-ignore
      const user = usersService.me({ id: req.user.id });

      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
}
