import { PrismaClient } from "@prisma/client";

type createData = {
  name: string;
  amount: string;
  paymentMethod: string;
};

type findUniqueByIdData = {
  id: string;
};

type updateData = createData & { id: string };

export class ServicesService {
  db: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.db = prisma;
  }

  async create(data: createData) {
    const { amount, name, paymentMethod } = data;

    return await this.db.services.create({
      data: { name, amount, paymentMethod },
    });
  }

  async fetchAll() {
    await this.db.services.findMany();
  }

  async findUniqueById({ id }: findUniqueByIdData) {
    return await this.db.services.findUnique({
      where: { id },
    });
  }

  async update(data: updateData) {
    const { id, amount, paymentMethod, name } = data;

    return await this.db.services.update({
      where: { id },
      data: { amount, paymentMethod, name },
    });
  }

  async delete({ id }: findUniqueByIdData) {
    return await this.db.services.delete({
      where: { id },
    });
  }
}
