import { Request } from 'express';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import ApiError from '../../errors/ApiErrors';

const uploadDirectories: Record<string, string> = {
    image: 'image'
};


const fileUploadHandler = () => {

    //create upload folder
    const baseUploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(baseUploadDir)) {
        fs.mkdirSync(baseUploadDir);
    }

    //folder create for different file
    const createDir = (dirPath: string) => {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }
    };

    //create filename
    const storage = multer.diskStorage({

        destination: (req, file, cb) => {
            const folderName = uploadDirectories[file.fieldname];

            if (!folderName) {
                cb(new ApiError(StatusCodes.BAD_REQUEST, 'File type not supported'), '');
            }

            const uploadDir = path.join(baseUploadDir, folderName);
            createDir(uploadDir);
            cb(null, uploadDir);
        },

        filename: (req, file, cb) => {
            const fileExt = path.extname(file.originalname);
            const fileName =
                file.originalname
                    .replace(fileExt, '')
                    .toLowerCase()
                    .split(' ')
                    .join('-') +
                '-' +
                Date.now();
            cb(null, fileName + fileExt);
        },
    });

    //file filter
    const filterFilter = (req: Request, file: any, cb: FileFilterCallback) => {

        // console.log("file handler",file)
        if (file.fieldname === 'image') {
            if (
                file.mimetype === 'image/jpeg' ||
                file.mimetype === 'image/png' ||
                file.mimetype === 'image/jpg'
            ) {
                cb(null, true);
            } else {
                cb(new ApiError(StatusCodes.BAD_REQUEST, 'Only .jpeg, .png, .jpg file supported'))
            }
        } else {
            cb(new ApiError(StatusCodes.BAD_REQUEST, 'This file is not supported'))
        }
    };

    const upload = multer({ storage: storage, fileFilter: filterFilter })
        .fields([{ name: 'image', maxCount: 3 }]);
    return upload;

};

export default fileUploadHandler;