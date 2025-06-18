import { $Enums, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

type createData = {
  email: string;
  password: string;
  name: string;
  accountId: string;
  role?: $Enums.Role;
};

type updateData = {
  id: string;
  email?: string;
  password?: string;
  name?: string;
};

type MeData = {
  id: string;
};

export class UsersService {
  db: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.db = prisma;
  }

  async create(data: createData) {
    const { email, password, name, accountId, role } = data;

    const encodedPassword = await bcrypt.hash(password, 10);

    return await this.db.users.create({
      data: { email, password: encodedPassword, name, accountId, role },
    });
  }

  async me({ id }: MeData) {
    return await this.db.users.findUnique({
      where: { id },
    });
  }

  async update(data: updateData) {
    const { id, email, password, name } = data;

    return await this.db.users.update({
      where: { id },
      data: { email, password, name },
    });
  }

  async delete({ id }: MeData) {
    return await this.db.users.delete({
      where: { id },
    });
  }

  async activate({ id }: { id: string }) {
    return await this.db.users.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async deactivate({ id }: { id: string }) {
    return await this.db.users.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
