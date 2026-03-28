import User from "../models/User.js";

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      console.log("Admin user already exists. Skipping seed.");
      return;
    }

    const adminEmail = process.env.ADMIN_EMAIL || "admin@techquiz.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

    const admin = await User.create({
      name: "Admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });

    console.log(`Admin user created: ${admin.email}`);
  } catch (error) {
    console.error("Error seeding admin:", error.message);
    throw error;
  }
};

export {seedAdmin}
