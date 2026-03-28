import app from "./src/app.js";
import connectDb from "./src/config/db.js";
import { seedAdmin } from "./src/seed/admin.js";

seedAdmin().catch((err) => console.error("Admin Seeding failed", err));
connectDb();
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(
    `Server is runnig in ${process.env.NODE_ENV} mode on port ${PORT} `,
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
