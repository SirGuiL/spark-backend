import { PrismaClient } from "@prisma/client";

type createData = {
  plate: string;
  modelCode: string;
  modelName: string;
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
  modelCode: string;
  modelName: string;
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

type deleteNotFinishedCarsServicesData = {
  userId: string;
  id: string;
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
    const { id, plate, modelCode, modelName, brandId } = data;

    return await this.db.cars.update({
      where: { id },
      data: { plate, modelCode, modelName, brandId },
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

    return await this.db.cars.findUnique({
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
        car: {
          omit: {
            userId: true,
          },
        },
        services: {
          omit: {
            userId: true,
          },
        },
        user: {
          omit: {
            password: true,
          },
        },
      },
      omit: {
        carId: true,
        serviceId: true,
        userId: true,
      },
    });
  }

  async deleteNotFinishedCarsServices(data: deleteNotFinishedCarsServicesData) {
    const { userId, id } = data;

    return await this.db.carsServices.delete({
      where: {
        id,
        userId,
      },
    });
  }
}
