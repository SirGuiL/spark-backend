import { $Enums, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

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

type sendUpdatePasswordLinkData = {
  id: string;
  email: string;
  frontendUrl: string;
  expirationTimeParam: string;
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
      where: { id, isActive: true },
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

  async fetchAllByAccountId({ accountId }: { accountId: string }) {
    return await this.db.users.findMany({
      where: { accountId, isActive: true },
    });
  }

  async sendUpdatePasswordLink(data: sendUpdatePasswordLinkData) {
    const { email, id, frontendUrl, expirationTimeParam } = data;

    const service = process.env.APPLICATION_PROVIDER;
    const user = process.env.APPLICATION_EMAIL;
    const pass = process.env.APPLICATION_EMAIL_PASSWORD;

    const auth = {
      user,
      pass,
    };

    const transporter = nodemailer.createTransport({
      service,
      auth,
    });

    await transporter.sendMail({
      from: `sPark <${user}>`,
      to: email,
      subject: "Redefinição da sua senha sPark",
      html: `<p>Esse é o link para a redefinição da sua senha: ${frontendUrl}/nova-senha/${id}?expiresAt=${expirationTimeParam}</p>`,
    });
  }
}
