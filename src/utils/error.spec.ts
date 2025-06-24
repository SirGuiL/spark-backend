import { describe, it, expect } from "vitest";
import { ErrorUtils } from "./error";

describe("ErrorUtils", () => {
  describe("formatError", () => {
    it("should format an Error instance", () => {
      const error = new Error("Test error");
      const result = ErrorUtils.formatError(error);

      expect(result).toEqual({ error: "Test error" });
    });

    it("should format a string as an error", () => {
      const result = ErrorUtils.formatError("Something went wrong");

      expect(result).toEqual({ error: "Something went wrong" });
    });

    it("should format a number as an error", () => {
      const result = ErrorUtils.formatError(404);

      expect(result).toEqual({ error: 404 });
    });

    it('should format an object as an error (e.g. { msg: "error" })', () => {
      const result = ErrorUtils.formatError({ msg: "error" });

      expect(result).toEqual({
        error: {
          msg: "error",
        },
      });
    });

    it("should format undefined as an error", () => {
      const result = ErrorUtils.formatError(undefined);

      expect(result).toEqual({ error: undefined });
    });
  });
});
