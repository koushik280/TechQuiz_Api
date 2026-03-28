import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "./config/swagger.js";
import { authRoutes } from "./routes/authroutes.js";
import { technoloyRoutes } from "./routes/admin/technologies.js";
import { lvelConfigRoutes } from "./routes/admin/levelConfig.js";

import { questionRoutes } from "./routes/admin/question.js";
import { quizRoute } from "./routes/quiz.js";

import { analyticsRoutes } from "./routes/analytics.js";
import { adminAnalyticsRoutes } from "./routes/admin/analytics.js";

dotenv.config();

const app = express();

//CORS configuration-allow fronted origin with credential
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
  }),
);

//Body parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookie parser middleware
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/admin/technologies", technoloyRoutes);
app.use("/api/admin/level-configs", lvelConfigRoutes);

app.use("/api/admin/questions", questionRoutes);
app.use("/api/quiz", quizRoute);

app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin/analytics", adminAnalyticsRoutes);

//Base route for health checks
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
  }),
);
app.get("/", (req, res) => {
  res.status(200).json({ message: "Tech Quiz API is running" });
});

// Error handling middleware (to be expanded later)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
