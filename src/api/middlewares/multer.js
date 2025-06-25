import dotenv from "dotenv";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";

dotenv.config();

// LINODE_OBJECT_STORAGE_BUCKET=leadkart
export const s3Client = new S3Client({
    region: "in-maa-1",
    endpoint: new URL("https://in-maa-1.linodeobjects.com").toString(), // Ensure a valid URL
    forcePathStyle: false,
    credentials: {
        accessKeyId:"ONX5GHG5U5421621M63F",
        secretAccessKey: "PRIwOYk72vYugYNfbqTI3pZkU36zNY0rEtxcIuzn",
    },
});
// Multer Storage Configuration
export const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: "leadkart",
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            let folderPath = "";
            if (file.mimetype.startsWith("image")) {
                folderPath = "INTEGRITY/IMAGE/";
            } else if (file.mimetype.startsWith("video")) {
                folderPath = "INTEGRITY/VIDEO/";
            } else if (file.mimetype.startsWith("application/pdf")) {
                folderPath = "INTEGRITY/PDF/";
            } else {
                folderPath = "INTEGRITY/OTHERS/";
            }
            const key = `${folderPath}${Date.now().toString()}_${file.originalname}`;
            cb(null, key);
        },
    }),
});

// Function to Delete a File from Object Storage
export const deleteFileMulter = async (key) => {
    try {
        const params = {
            Bucket: process.env.LINODE_OBJECT_STORAGE_BUCKET,
            Key: key,
        };
        await s3Client.send(new DeleteObjectCommand(params));
        console.log(`File deleted successfully: ${key}`);
    } catch (error) {
        console.error(`Error deleting file: ${error.message}`);
    }
};