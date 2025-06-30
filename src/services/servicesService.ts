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
  page?: number;
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

  async fetchAll({ userId, page = 1 }: fetchAllData) {
    const services = await this.db.services.findMany({
      where: { userId },
      include: {
        ServicesTags: {
          include: {
            tag: {
              omit: {
                userId: true,
              },
            },
          },
          omit: {
            id: true,
            serviceId: true,
            userId: true,
            tagId: true,
          },
        },
      },
      skip: (page - 1) * 10,
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      omit: {
        userId: true,
      },
    });

    const count = await this.db.services.count({
      where: { userId },
    });

    const formattedServices = services.map((service) => ({
      id: service.id,
      name: service.name,
      amount: service.amount,
      tags: service.ServicesTags.map((st) => st.tag),
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    }));

    return {
      services: formattedServices,
      count,
      page,
    };
  }

  async findUniqueById({ id, userId }: findUniqueByIdData) {
    const services = await this.db.services.findUnique({
      where: { userId, id },
      include: {
        ServicesTags: {
          include: {
            tag: {
              omit: {
                userId: true,
              },
            },
          },
          omit: {
            id: true,
            serviceId: true,
            userId: true,
            tagId: true,
          },
        },
      },
      omit: {
        userId: true,
      },
    });

    const result = {
      ...services,
      tags: services?.ServicesTags.map((st) => st.tag),
    };

    delete result.ServicesTags;

    return result;
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
