import { describe, it, expect } from "vitest";
import { ErrorUtils } from "./error";
import { ArraysUtils } from "./arrays";

describe("ArraysUtils", () => {
  describe("paginate", () => {
    it("should paginate an array", () => {
      const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const page = 2;
      const limit = 5;

      const result = ArraysUtils.paginate({ items, page, limit });

      expect(result.data).toEqual([6, 7, 8, 9, 10]);
      expect(result.pagination).toEqual({
        page: 2,
        limit: 5,
        count: 10,
        totalPages: 2,
      });
    });

    it("should return an empty array if page is out of range", () => {
      const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const page = 3;
      const limit = 5;

      const result = ArraysUtils.paginate({ items, page, limit });

      expect(result.data).toEqual([]);
      expect(result.pagination).toEqual({
        page: 3,
        limit: 5,
        count: 10,
        totalPages: 2,
      });
    });
  });
});
