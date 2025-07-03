import axios, { AxiosInstance } from "axios";
import { BrandsService } from "./brandsService";
import { PrismaClient } from "@prisma/client";

type getBrandsByTypeData = {
  type: "cars" | "motorcycles" | "trucks";
};

type fipeBrand = {
  code: string;
  name: string;
};

type fipeCar = {
  code: string;
  name: string;
};

type getCarsByBrandType = {
  vehicleType: "cars" | "motorcycles" | "trucks";
  brandId: number;
};

export class FipeService {
  api: AxiosInstance;

  constructor(baseURL: string, fipeToken: string) {
    this.api = axios.create({
      baseURL,
    });

    if (fipeToken) {
      this.api.defaults.headers.common["X-Subscription-Token"] = fipeToken;
    }
  }

  async getBrandsByType(data: getBrandsByTypeData) {
    const { type } = data;

    const response = await this.api(`${type}/brands`);

    return response.data as fipeBrand[];
  }

  async getCarsByBrand(data: getCarsByBrandType) {
    const { brandId, vehicleType } = data;

    const response = await this.api(`${vehicleType}/brands/${brandId}/models`);

    return response.data as fipeCar[];
  }
}
