import express from "express";
import * as dotenv from "dotenv";

import { carRoutes, serviceRoutes, authRoutes, userRoutes } from "./routes";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/cars", carRoutes);
app.use("/services", serviceRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
