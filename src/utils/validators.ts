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

  static isValidLicentePlate(plate: string) {
    const normalized = plate.toUpperCase().replace(/[^A-Z0-9]/g, "");

    const oldPlateRegex = /^[A-Z]{3}[0-9]{4}$/;
    const newPlateRegex = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;

    return oldPlateRegex.test(normalized) || newPlateRegex.test(normalized);
  }
}
