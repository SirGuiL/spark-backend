import { PrismaClient, Type } from "@prisma/client";
import { FipeService } from "./fipeService";

type fetchAllData = {
  type: "cars" | "motorcycles" | "trucks";
  page: number;
  limit: number;
  query: string;
};

type createOrUpdateData = {
  code: string;
  name: string;
  type: Type;
};

export class BrandsService {
  db: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.db = prisma;
  }

  async fetchAll({ type, page, limit, query }: fetchAllData) {
    const response = await this.db.brand.findMany({
      where: {
        type,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { code: { contains: query, mode: "insensitive" } },
        ],
      },
      skip: (page - 1) * 10,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    const count = await this.db.brand.count({
      where: {
        type,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { code: { contains: query, mode: "insensitive" } },
        ],
      },
    });

    return {
      brands: response,
      metadata: {
        count,
        page,
        limit,
      },
    };
  }

  async createOrUpdate(data: createOrUpdateData) {
    const { code, name, type } = data;

    return await this.db.brand.upsert({
      where: { code, type },
      update: { name },
      create: {
        code,
        name,
        type,
      },
    });
  }

  async syncBrands() {
    const baseUrl = process.env.FIPE_URL;
    const fipeToken = process.env.FIPE_TOKEN;

    if (!baseUrl || !fipeToken) {
      throw new Error("Nenhuma URL ou token de acesso ao Fipe foi fornecido.");
    }

    const fipeService = new FipeService(baseUrl, fipeToken);

    const cars = await fipeService.getBrandsByType({ type: "cars" });

    const motorcycles = await fipeService.getBrandsByType({
      type: "motorcycles",
    });

    const trucks = await fipeService.getBrandsByType({ type: "trucks" });

    cars.map(async ({ code, name }) => {
      await this.createOrUpdate({
        code: code,
        name: name,
        type: "cars",
      });
    });

    motorcycles.map(async ({ code, name }) => {
      await this.createOrUpdate({
        code: code,
        name: name,
        type: "motorcycles",
      });
    });

    trucks.map(async ({ code, name }) => {
      await this.createOrUpdate({
        code: code,
        name: name,
        type: "trucks",
      });
    });

    return { cars, motorcycles, trucks };
  }
}
