// multerConfig.ts
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinaryConfig.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: 'social_network',
    resource_type: 'auto',
  }),
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = /jpeg|jpg|png|mp4|avi|mkv/;
  const mimeType = allowedMimeTypes.test(file.mimetype);
  const extname = allowedMimeTypes.test(file.originalname.split('.').pop()?.toLowerCase() || '');

  if (mimeType && extname) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, MP4, AVI, and MKV are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single('photo');

export default upload;
