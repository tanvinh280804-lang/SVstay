import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { OWNER_ISACTIVE } from '../constants/Owner.constant.js';

const ownerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Tên đầy đủ là bắt buộc"],
    },
    email: {
        type: String,
        required: [true, "Email là bắt buộc"],
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: [true, "Số điện thoại là bắt buộc"],
    },
    password: {
        type: String,
        required: [true, "Mật khẩu là bắt buộc"],
    },
    identityCard: {
        type: String,
        required: [true, "Số CMND/CCCD là bắt buộc"],
    },
    address: {
        type: String,
        required: [true, "Địa chỉ là bắt buộc"],
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dxj0d1g5f/image/upload/v1697041234/default-avatar.png",
    },
    isActive: {
        type: Number,
        enum: [OWNER_ISACTIVE.ACTIVE, OWNER_ISACTIVE.INACTIVE, OWNER_ISACTIVE.BANNED],
        default: OWNER_ISACTIVE.ACTIVE,
    }
}, { timestamps: true });

ownerSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

ownerSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

const Owner = mongoose.model('Owner', ownerSchema);

export default Owner;