import { PrismaClient } from "@prisma/client";

type createData = {
  name: string;
};

type updateData = {
  id: string;
  name: string;
  cnpj: string;
};

export class AccountService {
  db: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.db = prisma;
  }

  async create(data: createData) {
    const { name } = data;

    return await this.db.accounts.create({
      data: { name },
    });
  }

  async findUniqueById({ id }: { id: string }) {
    return await this.db.accounts.findUnique({
      where: { id },
    });
  }

  async update({ id, name, cnpj }: updateData) {
    return await this.db.accounts.update({
      where: { id },
      data: { name, cnpj },
    });
  }

  async deactivate({ id }: { id: string }) {
    return await this.db.accounts.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async activate({ id }: { id: string }) {
    return await this.db.accounts.update({
      where: { id },
      data: { isActive: true },
    });
  }
}
