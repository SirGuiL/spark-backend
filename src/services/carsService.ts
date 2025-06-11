import { PrismaClient } from "@prisma/client";

type createData = {
  plate: string;
  model: string;
  status: string;
  brand: string;
  serviceId: string;
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
        isFinished: false,
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
    const { id, plate, model, brand, serviceId } = data;

    return await this.db.cars.update({
      where: { id },
      data: { plate, model, brand, serviceId },
    });
  }

  async delete({ id }: findUniqueByIdData) {
    return await this.db.cars.delete({
      where: { id },
    });
  }
}
