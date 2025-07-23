import { JwtPayload } from "jsonwebtoken";
import { Users } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user: Users | null;
    }
  }
}
