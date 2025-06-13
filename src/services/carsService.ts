import { PrismaClient } from "@prisma/client";

type createData = {
  plate: string;
  model: string;
  brand: string;
  userId: string;
};

type findUniqueByIdData = {
  id: string;
};

type updateData = {
  id: string;
  plate: string;
  model: string;
  brand: string;
};

type addRegisterData = {
  carId: string;
  serviceId: string;
};

export class CarsService {
  db: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.db = prisma;
  }

  async create(data: createData) {
    return await this.db.cars.create({
      data: {
        ...data,
      },
    });
  }

  async findUniqueById({ id }: findUniqueByIdData) {
    return await this.db.cars.findUnique({
      where: { id },
    });
  }

  async fetchAll() {
    return await this.db.cars.findMany();
  }

  async update(data: updateData) {
    const { id, plate, model, brand } = data;

    return await this.db.cars.update({
      where: { id },
      data: { plate, model, brand },
    });
  }

  async delete({ id }: findUniqueByIdData) {
    return await this.db.cars.delete({
      where: { id },
    });
  }

  async findCarByPlate({ plate }: { plate: string }) {
    return await this.db.cars.findUnique({
      where: { plate },
    });
  }

  async addRegister(data: addRegisterData) {
    const { carId, serviceId } = data;

    this.db.carsServices.create({
      data: {
        carId,
        serviceId,
      },
    });
  }
}
