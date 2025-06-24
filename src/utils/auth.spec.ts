import { describe, it, expect, vi, beforeAll } from "vitest";
import jwt from "jsonwebtoken";
import { AuthUtils } from "./auth";

beforeAll(() => {
  process.env.REFRESH_JWT_SECRET = "mock-refresh-secret";
  process.env.ACCESS_JWT_SECRET = "mock-access-secret";
});

describe("AuthUtils", () => {
  const userId = "user-123";

  describe("generateRefreshToken", () => {
    it("should generate a valid refresh token", () => {
      const token = AuthUtils.generateRefreshToken({ userId });
      const decoded = jwt.verify(token, process.env.REFRESH_JWT_SECRET!);

      expect(typeof token).toBe("string");
      expect((decoded as any).userId).toBe(userId);
    });
  });

  describe("generateAccessToken", () => {
    it("should generate a valid access token", () => {
      const token = AuthUtils.generateAccessToken({ userId });
      const decoded = jwt.verify(token, process.env.ACCESS_JWT_SECRET!);

      expect(typeof token).toBe("string");
      expect((decoded as any).userId).toBe(userId);
    });
  });

  describe("verifyRefreshToken", () => {
    it("should verify a valid refresh token and return payload", () => {
      const token = jwt.sign({ userId }, process.env.REFRESH_JWT_SECRET!, {
        expiresIn: "7d",
      });

      const decoded = AuthUtils.verifyRefreshToken(token);

      expect((decoded as any).userId).toBe(userId);
    });

    it("should throw an error for invalid token", () => {
      const invalidToken = "invalid.token.value";

      expect(() => AuthUtils.verifyRefreshToken(invalidToken)).toThrow();
    });
  });
});
