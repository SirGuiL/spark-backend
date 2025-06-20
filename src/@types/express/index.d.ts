import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        name: string | null;
        email: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        accountId: string;
        role: $Enums.Role;
      } | null;
    }
  }
}
