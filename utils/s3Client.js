// aws/s3Client.js
import multer from 'multer';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});


export const uploadAudioToS3 = async (buffer, key) => {
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: "audio/wav"
  };

  await s3.send(new PutObjectCommand(uploadParams));

};

export const uploadImageToS3 = async (buffer, key, contentType = "image/jpeg") => {
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType
  };

  await s3.send(new PutObjectCommand(uploadParams));
};

// Configure multer for memory storage
export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

export default s3;
