import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinaryConfig';
// Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Use 'auto' to accept images and videos
        return {
            folder: 'social_network',
            resource_type: 'auto',
        };
    },
});
// Define the file filter function
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = /jpeg|jpg|png|mp4|avi|mkv/;
    const mimeType = allowedMimeTypes.test(file.mimetype);
    const extname = allowedMimeTypes.test(file.originalname.split('.').pop()?.toLowerCase() || '');
    if (mimeType && extname) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only JPEG, PNG, MP4, AVI, and MKV are allowed.'));
    }
};
// Configure Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
}).array('files', 5); // Assurez-vous que 'files' correspond au nom du champ
export default upload;
