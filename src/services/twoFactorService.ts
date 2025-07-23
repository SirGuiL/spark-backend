import { PrismaClient } from "@prisma/client";
import speakeasy from "speakeasy";
import qrcode from "qrcode";

type setupTOTPData = {
  userId: string;
  email: string;
};

type setupEmailCodeData = {
  userId: string;
};

type verifyTOTPData = {
  token: string;
  twoFactorSecret: string;
  userId: string;
};

export class TwoFactorService {
  db: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.db = prisma;
  }

  async setupTOTP(data: setupTOTPData) {
    const { userId, email } = data;

    const secret = speakeasy.generateSecret({
      name: `sPark (${email})`,
    });

    if (!secret.otpauth_url) {
      throw new Error("Error generating secret");
    }

    const qr = await qrcode.toDataURL(secret.otpauth_url);

    await this.db.users.update({
      where: { id: userId },
      data: {
        twoFactorSecret: secret.base32,
        isTwoFactorEnabled: true,
        twoFactorType: "totp",
      },
    });

    return { qr, secret: secret.base32 };
  }

  async setupEmailCode({ userId }: setupEmailCodeData) {
    await this.db.users.update({
      where: { id: userId },
      data: { isTwoFactorEnabled: true, twoFactorType: "code" },
    });
  }

  async verifyTOTP({ token, twoFactorSecret, userId }: verifyTOTPData) {
    const verified = speakeasy.totp.verify({
      secret: twoFactorSecret,
      encoding: "base32",
      token,
    });

    if (verified) {
      await this.db.users.update({
        where: { id: userId },
        data: { isTwoFactorEnabled: true },
      });
    }

    return verified;
  }
}
