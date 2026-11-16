import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/database.config.js";
import Admin from "../models/Admin.js";
import Owner from "../models/Owner.js";
import RoomType from "../models/RoomType.js";
import Room from "../models/Room.js";
import Customer from "../models/Customer.js";
import AdminSeeder from "./Admin.seeder.js";
import OwnerSeeder from "./Owner.seeder.js";
import RoomTypeSeeder from "./RoomType.seeder.js";
import RoomSeeder from "./Room.seeder.js";
import CustomerSeeder from "./Customer.seeder.js";

const seedDatabase = async () => {
    try {
        await connectDB();
        await Admin.deleteMany({});
        await Customer.deleteMany({});
        await Owner.deleteMany({});
        await RoomType.deleteMany({});
        await Room.deleteMany({});
        await AdminSeeder();
        await OwnerSeeder();
        await CustomerSeeder();
        await RoomTypeSeeder();
        await RoomSeeder();
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
