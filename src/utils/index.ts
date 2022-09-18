import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

const mimeTypes: { [key: string]: string } = {
  'image/png': 'png',
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
  'image/avif': 'avif',
};

export const saveFile = async (
  file: Express.Multer.File,
  directory = 'upload',
): Promise<{ location: string }> => {
  const { filename, buffer, mimetype } = file;
  const extension = mimeTypes[mimetype];
  const location = path.join(__dirname, `../../${directory}`);
  return new Promise((resolve, reject) => {
    fs.appendFile(
      location + `/${filename}.${extension}`,
      buffer,
      'binary',
      (err) => {
        if (err) {
          reject(err);
        }
        resolve({
          location: `/uploads/${filename}.${extension}`,
        });
      },
    );
  });
};
