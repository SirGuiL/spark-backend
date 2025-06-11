import jwt, { JwtPayload } from "jsonwebtoken";

const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET!;
const ACCESS_JWT_SECRET = process.env.ACCESS_JWT_SECRET!;

type generateRefreshTokenData = {
  userId: string;
};

export class AuthUtils {
  static generateRefreshToken(data: generateRefreshTokenData) {
    const { userId } = data;

    const refreshToken = jwt.sign({ userId }, REFRESH_JWT_SECRET, {
      expiresIn: "7d",
    });

    return refreshToken;
  }

  static generateAccessToken(data: generateRefreshTokenData) {
    const { userId } = data;

    const refreshToken = jwt.sign({ userId }, ACCESS_JWT_SECRET, {
      expiresIn: "15m",
    });

    return refreshToken;
  }

  static verifyRefreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, REFRESH_JWT_SECRET) as
        | {
            userId: string;
          }
        | JwtPayload;

      return decoded;
    } catch (error) {
      throw error;
    }
  }
}
