import "dotenv/config";
import Customer from "../models/Customer.js";
import connectDB from "../config/database.config.js";
import mongoose from "mongoose";
import { fileURLToPath } from "url";

const defaultCustomers = [
    {
        full_name: "Nguyễn Minh Anh",
        email: "customer@svstay.com",
        phone_number: "0901234567",
        password: "12345678",
        avatar: "",
    },
    {
        full_name: "Trần Quốc Bảo",
        email: "customer2@svstay.com",
        phone_number: "0912345678",
        password: "12345678",
        avatar: "",
    },
    {
        full_name: "Lê Thu Hà",
        email: "customer3@svstay.com",
        phone_number: "0923456789",
        password: "12345678",
        avatar: "",
    },
];

const CustomerSeeder = async () => {
    try {
        const customers = [...defaultCustomers];
        if (process.env.CUSTOMER_EMAIL) {
            customers[0] = {
                ...customers[0],
                full_name: process.env.CUSTOMER_FULLNAME || customers[0].full_name,
                email: process.env.CUSTOMER_EMAIL,
                phone_number: process.env.CUSTOMER_PHONE || customers[0].phone_number,
                password: process.env.CUSTOMER_PASSWORD || customers[0].password,
            };
        }

        let insertedCount = 0;
        let skippedCount = 0;
        for (const customerData of customers) {
            const email = customerData.email.trim().toLowerCase();
            const existingCustomer = await Customer.findOne({ email }).select("_id");
            if (existingCustomer) {
                skippedCount++;
                continue;
            }
            await Customer.create({ ...customerData, email });
            insertedCount++;
        }

        console.log(`Customer seeder completed: ${insertedCount} added, ${skippedCount} already existed.`);
    } catch (error) {
        console.error("Error seeding customers:", error);
        throw error;
    }
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
    (async () => {
        try {
            await connectDB();
            await CustomerSeeder();
        } catch (error) {
            console.error("Standalone seeding failed:", error);
            process.exitCode = 1;
        } finally {
            if (mongoose.connection.readyState !== 0) await mongoose.connection.close();
        }
    })();
}

export default CustomerSeeder;
