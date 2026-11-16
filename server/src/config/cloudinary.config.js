
import "dotenv/config";
import https from "node:https";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { Readable } from "stream";
import { randomUUID } from "crypto";

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// Cloudinary SDK currently turns some HTTP 403 responses into a generic
// UnexpectedResponse and discards their body. Observe HTTPS responses so the
// server log still shows Cloudinary's actual explanation while debugging.
if (!https.request.__cloudinaryErrorLogger) {
    const originalHttpsRequest = https.request;
    const loggedHttpsRequest = function (...args) {
        const callbackIndex = args.findLastIndex((arg) => typeof arg === "function");
        if (callbackIndex !== -1) {
            const originalCallback = args[callbackIndex];
            args[callbackIndex] = function (response) {
                if (response.statusCode >= 400) {
                    const chunks = [];
                    response.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
                    response.on("end", () => {
                        const body = Buffer.concat(chunks).toString("utf8");
                        let message;
                        try {
                            message = JSON.parse(body)?.error?.message;
                        } catch {
                            // Log the raw response below if it's not JSON.
                        }
                        console.error("Cloudinary HTTP error response:", {
                            status: response.statusCode,
                            message: message || body || undefined,
                            xCldError: response.headers["x-cld-error"],
                        });
                    });
                }
                return originalCallback.call(this, response);
            };
        }
        return originalHttpsRequest.apply(this, args);
    };
    loggedHttpsRequest.__cloudinaryErrorLogger = true;
    https.request = loggedHttpsRequest;
}

// Kiểm tra định dạng ảnh
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        return cb(null, true);
    }

    return cb(new Error("Chỉ chấp nhận ảnh JPG, PNG hoặc WEBP!"), false);
};

// Cấu hình Multer lưu ảnh vào RAM
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

// Hàm upload ảnh lên Cloudinary
const uploadToCloudinary = (fileBuffer, folder = "svstay") => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
                public_id: randomUUID(),
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            }
        );

        Readable.from([fileBuffer])
            .pipe(uploadStream)
            .on("error", reject);
    });
};

export { cloudinary, upload, uploadToCloudinary };
export default upload;
