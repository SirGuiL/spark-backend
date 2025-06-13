import { PrismaClient } from "@prisma/client";

type createData = {
  name: string;
  amount: string;
  userId: string;
};

type findUniqueByIdData = {
  id: string;
};

type updateData = createData & { id: string };

type addTagsData = {
  serviceId: string;
  tags: string[];
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

  async fetchAll() {
    await this.db.services.findMany();
  }

  async findUniqueById({ id }: findUniqueByIdData) {
    return await this.db.services.findUnique({
      where: { id },
    });
  }

  async update(data: updateData) {
    const { id, amount, name } = data;

    return await this.db.services.update({
      where: { id },
      data: { amount, name },
    });
  }

  async delete({ id }: findUniqueByIdData) {
    return await this.db.services.delete({
      where: { id },
    });
  }

  async addTags(data: addTagsData) {
    const { serviceId, tags } = data;

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
          },
        });
      }
    });
  }
}
