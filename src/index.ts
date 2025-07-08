import express from "express";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { ErrorUtils } from "./utils/error";
import {
  carRoutes,
  serviceRoutes,
  authRoutes,
  userRoutes,
  accountRoutes,
  tagsRoutes,
  brandsRoutes,
  signatureRoutes,
  plansRoutes,
  stripeRoutes,
} from "./routes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/stripe", stripeRoutes);

app.use(express.json());
app.use(cookieParser());

app.use("/cars", carRoutes);
app.use("/services", serviceRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/account", accountRoutes);
app.use("/tags", tagsRoutes);
app.use("/brands", brandsRoutes);
app.use("/plans", plansRoutes);
app.use("/signature", signatureRoutes);

// @ts-ignore
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(400).send(ErrorUtils.formatError(err));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
