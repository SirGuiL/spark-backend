import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Validators } from "../utils/validators";
import { AccountService } from "../services/accountService";

export class AccountController {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const requiredFields = { name };

      if (!Validators.validateRequiredFields(res, requiredFields)) {
        return;
      }

      const accountService = new AccountService(this.prisma);
      const account = await accountService.create({
        name,
      });

      res.status(201).json(account);
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

      const accountService = new AccountService(this.prisma);
      const account = await accountService.findUniqueById({
        id: user.accountId,
      });

      if (!account) {
        return res.status(404).json({ error: "Account not found" });
      }

      if (!account.isActive) {
        return res.status(400).json({ error: "Account is inactive" });
      }

      res.status(200).json({
        id: account.id,
        name: account.name,
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
      const { name } = req.body;
      const requiredFields = { name };

      if (!Validators.validateRequiredFields(res, requiredFields)) {
        return;
      }

      const accountService = new AccountService(this.prisma);
      const account = await accountService.update({
        id,
        name,
      });

      res.status(200).json(account);
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
      const accountService = new AccountService(this.prisma);
      const account = await accountService.findUniqueById({
        id,
      });

      if (!account) {
        return res.status(404).json({ error: "Account not found" });
      }

      if (account.isActive) {
        return res.status(400).json({ error: "Account is already active" });
      }

      await accountService.activate({
        id,
      });

      res.status(200).json({
        message: "Account activate successfully",
      });
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
      const accountService = new AccountService(this.prisma);
      const account = await accountService.findUniqueById({
        id,
      });

      if (!account) {
        return res.status(404).json({ error: "Account not found" });
      }

      if (!account.isActive) {
        return res.status(400).json({ error: "Account is already inactive" });
      }

      await accountService.deactivate({
        id,
      });

      res.status(200).json({
        message: "Account deactivated successfully",
      });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
}
