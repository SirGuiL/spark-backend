import { Response } from "express";

export class Validators {
  static validateRequiredFields(res: Response, fields: Record<string, any>) {
    for (const [field, value] of Object.entries(fields)) {
      if (!value) {
        res.status(400).json({ error: `${field} is required` });
        return false;
      }
    }

    return true;
  }
}
