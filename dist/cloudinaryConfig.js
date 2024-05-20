"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadToCloudinary = async (part) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.v2.uploader.upload_stream((error, result) => {
            if (error)
                reject(error);
            resolve(result);
        });
        const bufferStream = new stream_1.Readable();
        bufferStream.push(part.file);
        bufferStream.push(null);
        bufferStream.pipe(stream);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
