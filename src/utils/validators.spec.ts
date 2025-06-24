import { describe, it, expect, vi, beforeEach } from "vitest";
import { Validators } from "./validators"; // ajuste o caminho conforme a estrutura do seu projeto
import { Response } from "express";

describe("Validators", () => {
  describe("validateRequiredFields", () => {
    let mockRes: Partial<Response>;

    beforeEach(() => {
      mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };
    });

    it("should return true when all fields are present", () => {
      const result = Validators.validateRequiredFields(mockRes as Response, {
        name: "John",
        age: 30,
      });

      expect(result).toBe(true);
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });

    it("should return false and send error when a field is missing", () => {
      const result = Validators.validateRequiredFields(mockRes as Response, {
        name: "",
        age: 25,
      });

      expect(result).toBe(false);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "name is required" });
    });
  });

  describe("isValidLicentePlate", () => {
    it("should validate old plate format (ABC1234)", () => {
      expect(Validators.isValidLicentePlate("ABC1234")).toBe(true);
    });

    it("should validate new plate format (ABC1D23)", () => {
      expect(Validators.isValidLicentePlate("ABC1D23")).toBe(true);
    });

    it("should ignore special characters and spaces", () => {
      expect(Validators.isValidLicentePlate("A-B C1D23")).toBe(true);
    });

    it("should return false for invalid plate", () => {
      expect(Validators.isValidLicentePlate("1234567")).toBe(false);
      expect(Validators.isValidLicentePlate("A1B2C3D")).toBe(false);
    });
  });
});
