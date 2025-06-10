import { PrismaClient } from "@prisma/client";

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

    return await this.db.users.create({
      data: { email, password, name },
    });
  }

  async me({ id }: MeData) {
    return await this.db.users.findUnique({
      where: { id },
    });
  }
}
