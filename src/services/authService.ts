import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";
import { AuthUtils } from "../utils/auth";

type loginData = {
  email: string;
  password: string;
};

type generateAccessTokenData = {
  refreshToken: string;
};

export class AuthService {
  db: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.db = prisma;
  }

  async login(data: loginData) {
    const { email, password } = data;

    try {
      const user = await this.db.users.findUniqueOrThrow({
        where: {
          email,
        },
      });

      if (!user.isActive) {
        throw new Error("User is inactive");
      }

      const isMatch = await compare(password, user.password);

      if (isMatch) {
        const refreshToken = AuthUtils.generateRefreshToken({
          userId: user.id,
        });

        return refreshToken;
      }

      throw new Error("Email or password incorrect");
    } catch (error) {
      throw new Error("Internal Server Error");
    }
  }

  async generateAccessToken(data: generateAccessTokenData) {
    const { refreshToken } = data;

    try {
      const isValid = AuthUtils.verifyRefreshToken(refreshToken);

      if (!isValid) {
        throw new Error("Unauthorized");
      }

      const accessToken = AuthUtils.generateAccessToken({
        userId: isValid.userId,
      });

      return accessToken;
    } catch (error) {
      throw new Error("Internal Server Error");
    }
  }
}
