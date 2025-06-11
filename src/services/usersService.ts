import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

type createData = {
  email: string;
  password: string;
  name: string;
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
    const { email, password, name } = data;

    const encodedPassword = await bcrypt.hash(password, 10);

    return await this.db.users.create({
      data: { email, password: encodedPassword, name },
    });
  }

  async me({ id }: MeData) {
    return await this.db.users.findUnique({
      where: { id },
    });
  }
}
