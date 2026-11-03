import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/database.config.js";
import AdminSeeder from "./Admin.seeder.js";

const seedDatabase = async () => {
    try {
        await connectDB();
        await AdminSeeder();
        console.log("Database seeded successfully");
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

seedDatabase();