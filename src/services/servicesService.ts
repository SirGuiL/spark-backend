import { PrismaClient } from "@prisma/client";

type createData = {
  name: string;
  amount: number;
  userId: string;
};

type deleteData = {
  id: string;
};

type findUniqueByIdData = {
  id: string;
  userId: string;
};

type updateData = {
  id: string;
  name: string;
  amount: number;
};

type addTagsData = {
  serviceId: string;
  userId: string;
  tags: string[];
};

type fetchAllData = {
  userId: string;
};

export class ServicesService {
  db: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.db = prisma;
  }

  async create(data: createData) {
    const { amount, name, userId } = data;

    return await this.db.services.create({
      data: { name, amount, userId },
    });
  }

  async fetchAll({ userId }: fetchAllData) {
    return await this.db.servicesTags.findMany({
      where: { userId },
      include: {
        service: {
          omit: {
            userId: true,
          },
        },
        tag: {
          omit: {
            userId: true,
          },
        },
      },
    });
  }

  async findUniqueById({ id, userId }: findUniqueByIdData) {
    return await this.db.servicesTags.findMany({
      where: { userId, serviceId: id },
      include: {
        service: {
          omit: {
            userId: true,
          },
        },
        tag: {
          omit: {
            userId: true,
          },
        },
      },
    });
  }

  async update(data: updateData) {
    const { id, amount, name } = data;

    return await this.db.services.update({
      where: { id },
      data: { amount, name },
    });
  }

  async delete({ id }: deleteData) {
    await this.db.servicesTags.deleteMany({
      where: { serviceId: id },
    });

    return await this.db.services.delete({
      where: { id },
    });
  }

  async addTags(data: addTagsData) {
    const { serviceId, tags, userId } = data;

    tags.map(async (id) => {
      const tag = await this.db.tags.findFirst({
        where: {
          id,
        },
      });

      const alreadyExists = await this.db.servicesTags.findFirst({
        where: {
          serviceId,
          tagId: id,
        },
      });

      if (alreadyExists) {
        return;
      }

      if (tag) {
        await this.db.servicesTags.create({
          data: {
            serviceId,
            tagId: tag.id,
            userId,
          },
        });
      }
    });
  }
}
