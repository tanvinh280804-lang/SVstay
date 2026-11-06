import "dotenv/config";
import Owner from "../models/Owner.js";
import { OWNER_ISACTIVE } from "../constants/Owner.constant.js";
import connectDB from "../config/database.config.js";
import mongoose from "mongoose";
import { fileURLToPath } from "url";

const OwnerSeeder = async () => {
    try {
        const email = process.env.OWNER_EMAIL || "owner@svstay.com";
        const password = process.env.OWNER_PASSWORD || "123456";
        const fullName = process.env.OWNER_FULLNAME || "Nguyễn Văn Chủ Trọ";
        const phoneNumber = process.env.OWNER_PHONE || "0987654321";
        const identityCard = process.env.OWNER_IDENTITY_CARD || "001200000001";
        const address = process.env.OWNER_ADDRESS || "Hà Nội, Việt Nam";
        const avatar = process.env.OWNER_AVATAR || "https://res.cloudinary.com/dxj0d1g5f/image/upload/v1697041234/default-avatar.png";

        if (!email || !password) {
            console.error("Missing OWNER_EMAIL or OWNER_PASSWORD in .env");
            return;
        }

        // Check if owner already exists
        const existingOwner = await Owner.findOne({ email });
        if (existingOwner) {
            console.log("Owner already exists");
            return;
        }

        // Create owner (password is automatically hashed by Owner model pre-save hook)
        const owner = new Owner({
            fullName,
            email,
            phoneNumber,
            password,
            identityCard,
            address,
            avatar,
            isActive: OWNER_ISACTIVE.ACTIVE
        });

        await owner.save();
        console.log("Owner seeded successfully");
    } catch (error) {
        console.error("Error seeding owner:", error);
        throw error;
    }
};

// Allow standalone execution: node src/seeders/Owner.seeder.js
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
    (async () => {
        try {
            await connectDB();
            await OwnerSeeder();
        } catch (error) {
            console.error("Standalone seeding failed:", error);
            process.exit(1);
        } finally {
            await mongoose.connection.close();
            process.exit(0);
        }
    })();
}

export default OwnerSeeder;
