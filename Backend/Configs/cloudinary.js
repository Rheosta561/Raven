const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {

    const isImage = file.mimetype.startsWith('image/');
    const isVideo = file.mimetype.startsWith('video/');

    let folder = 'uploads';
    let allowedFormats = ['jpg', 'jpeg', 'png'];
    let resourceType = 'image';
    let transformation = [];

    if (file.fieldname === 'videoClip') {
      folder = 'video_clips';
      allowedFormats = ['mp4', 'mov', 'avi'];
      resourceType = 'video';
    } else if (file.fieldname === 'posterImage') {
      folder = 'poster_images';
      transformation = [{ width: 1080, height: 1920, crop: 'limit' }];
    } else if (file.fieldname === 'profileImage') {
      folder = 'profile_images';
      transformation = [{ width: 500, height: 500, crop: 'limit' }];
    }

    return {
      folder,
      resource_type: resourceType,
      allowed_formats: allowedFormats,
      transformation,
    };
  },
});


const upload = multer({ storage }).fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'posterImage', maxCount: 1 },
  { name: 'videoClip', maxCount: 1 },
]);

module.exports = { cloudinary, upload };
