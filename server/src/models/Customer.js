import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { CUSTOMER_ISACTIVE } from "../constants/Customer.constant.js";

const customerSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: [true, "Họ tên là bắt buộc"],
        trim: true,
        minlength: [2, "Họ tên phải có ít nhất 2 ký tự"],
        maxlength: [100, "Họ tên không được vượt quá 100 ký tự"],
    },
    email: {
        type: String,
        required: [true, "Email là bắt buộc"],
        unique: true,
        lowercase: true,
        trim: true,
        maxlength: [254, "Email không hợp lệ"],
    },
    phone_number: {
        type: String,
        trim: true,
        default: "",
    },
    password: {
        type: String,
        required: [true, "Mật khẩu là bắt buộc"],
        minlength: [8, "Mật khẩu phải có ít nhất 8 ký tự"],
        select: false,
    },
    avatar: {
        type: String,
        default: "",
    },
    is_active: {
        type: Number,
        enum: [CUSTOMER_ISACTIVE.ACTIVE, CUSTOMER_ISACTIVE.INACTIVE, CUSTOMER_ISACTIVE.BANNED],
        default: CUSTOMER_ISACTIVE.ACTIVE,
    },
}, { timestamps: true, collection: "customers" });

customerSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
});

customerSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
