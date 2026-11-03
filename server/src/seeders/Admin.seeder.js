import "dotenv/config";
import Admin from "../models/Admin.js";
import connectDB from "../config/database.config.js";
import mongoose from "mongoose";
import { fileURLToPath } from "url";

const AdminSeeder = async () => {
    try {
        const username = process.env.ADMIN_USERNAME;
        const password = process.env.ADMIN_PASSWORD;
        const email = process.env.ADMIN_EMAIL || "admin@inkverse.com";
        const phone = process.env.ADMIN_PHONE || "0123456789";
        const avatar_url = process.env.ADMIN_AVATAR_URL || "https://example.com/avatar.png";

        if (!username || !password) {
            console.error("Missing ADMIN_USERNAME or ADMIN_PASSWORD in .env");
            return;
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            console.log("Admin already exists");
            return;
        }

        // Create admin (password is automatically hashed by Admin model pre-save hook)
        const admin = new Admin({
            username,
            password,
            email,
            phone,
            avatar_url
        });

        await admin.save();
        console.log("Admin seeded successfully");
    } catch (error) {
        console.error("Error seeding admin:", error);
        throw error;
    }
};

// Allow standalone execution: node src/seeders/Admin.seeder.js
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
    (async () => {
        try {
            await connectDB();
            await AdminSeeder();
        } catch (error) {
            console.error("Standalone seeding failed:", error);
            process.exit(1);
        } finally {
            await mongoose.connection.close();
            process.exit(0);
        }
    })();
}

export default AdminSeeder;
