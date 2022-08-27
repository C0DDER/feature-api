import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { HttpException, HttpStatus } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { diskStorage } from 'multer';

export const multerConfig = {
  gallery: './upload/gallery',
  thumbnail: './upload/thumbnail',
  default: './upload',
  category: './upload/category',
};

export enum FieldName {
  GALLERY = 'gallery',
  THUMBNAIL = 'thumbnail',
  DEFAULT = 'default',
  CATEGORY = 'category',
}

export const multerOptions: MulterOptions = {
  // Enable file size limits
  limits: {
    fileSize: 3_000_000,
  },
  // Check the mimetypes to allow for upload
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  // Storage properties
  storage: diskStorage({
    // Destination storage path details
    destination: (req, file, cb) => {
      const uploadPath = multerConfig[file.fieldname as FieldName]
        ? multerConfig[file.fieldname as FieldName]
        : multerConfig.default;
      // Create folder if it doesn't exist
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    // File modification details
    filename: (req: any, file: any, cb: any) => {
      // Calling the callback passing the random name generated with the original extension name
      cb(null, `${uuid()}${extname(file.originalname)}`);
    },
  }),
};
