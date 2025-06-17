import { PrismaClient } from "@prisma/client";

type createData = {
  name: string;
  userId: string;
};

type deleteData = {
  id: string;
};

type updateData = deleteData & {
  name: string;
};

type fetchAllData = {
  userId: string;
};

export class TagsService {
  db: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.db = prisma;
  }

  async create(data: createData) {
    const { name, userId } = data;

    const tag = await this.db.tags.findMany({
      where: {
        name,
        userId,
      },
    });

    if (tag.length > 0) {
      throw new Error("Tag already exists");
    }

    return await this.db.tags.create({
      data: {
        name,
        userId,
      },
    });
  }

  async delete(data: deleteData) {
    const { id } = data;

    return await this.db.tags.delete({
      where: {
        id,
      },
    });
  }

  async update(data: updateData) {
    const { id, name } = data;

    return await this.db.tags.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
  }

  async fetchAll(data: fetchAllData) {
    const { userId } = data;

    return await this.db.tags.findMany({
      where: {
        userId,
      },
    });
  }
}
