import { PrismaClient } from "@prisma/client";

type createData = {
  plate: string;
  model: string;
  brandId: string;
  userId: string;
};

type findUniqueByIdData = {
  id: string;
};

type fetchAllData = {
  userId: string;
};

type updateData = {
  id: string;
  plate: string;
  model: string;
  brandId: string;
};

type addRegisterData = {
  carId: string;
  serviceId: string;
  userId: string;
};

type findNotFinishedCarsServicesData = {
  userId: string;
};

type findCarByPlateType = {
  plate: string;
  accountId: string;
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

  async fetchAll(data: fetchAllData) {
    const { userId } = data;

    return await this.db.cars.findMany({
      where: {
        userId,
      },
    });
  }

  async update(data: updateData) {
    const { id, plate, model, brandId } = data;

    return await this.db.cars.update({
      where: { id },
      data: { plate, model, brandId },
    });
  }

  async delete({ id }: findUniqueByIdData) {
    return await this.db.cars.delete({
      where: { id },
    });
  }

  async findCarByPlate({ plate, accountId }: findCarByPlateType) {
    const users = await this.db.users.findMany({
      where: {
        accountId,
      },
    });

    const userIds = users.map((user) => user.id);

    return await this.db.cars.findUniqueOrThrow({
      where: { plate, userId: { in: userIds } },
      include: {
        brand: {
          omit: {
            updatedAt: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async addRegister(data: addRegisterData) {
    const { carId, serviceId, userId } = data;

    return await this.db.carsServices.create({
      data: {
        carId,
        serviceId,
        userId,
      },
    });
  }

  async findNotFinishedCarsServices(data: findNotFinishedCarsServicesData) {
    const { userId } = data;

    return await this.db.carsServices.findMany({
      where: {
        userId,
      },
      include: {
        car: true,
        services: true,
        user: true,
      },
      omit: {
        carId: true,
        serviceId: true,
        userId: true,
      },
    });
  }
}
