import express from "express";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { ErrorUtils } from "./utils/error";
import {
  carRoutes,
  serviceRoutes,
  authRoutes,
  userRoutes,
  accountRoutes,
  tagsRoutes,
} from "./routes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/cars", carRoutes);
app.use("/services", serviceRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/account", accountRoutes);
app.use("/tags", tagsRoutes);

// @ts-ignore
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(400).send(ErrorUtils.formatError(err));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
