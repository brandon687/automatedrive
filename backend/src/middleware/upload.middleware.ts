import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// File filter for images and videos
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedImageTypes = /jpeg|jpg|png|heic|webp/;
  const allowedVideoTypes = /mp4|mov|avi/;

  const extname = path.extname(file.originalname).toLowerCase().slice(1);
  const mimetype = file.mimetype;

  if (file.fieldname === 'video') {
    // Check if video
    if (allowedVideoTypes.test(extname) || mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files (MP4, MOV, AVI) are allowed for video upload'));
    }
  } else {
    // Check if image
    if (allowedImageTypes.test(extname) || mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, HEIC, WebP) are allowed'));
    }
  }
};

// Create multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB for images
  },
});

// Separate config for video with larger size limit
export const videoUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB for videos
  },
});

// Combined upload for mixed media (with large file support for video)
export const mediaUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB to allow videos
  },
}).fields([
  { name: 'front', maxCount: 1 },
  { name: 'rear', maxCount: 1 },
  { name: 'driver_side', maxCount: 1 },
  { name: 'passenger_side', maxCount: 1 },
  { name: 'steering_wheel', maxCount: 1 },
  { name: 'front_seat', maxCount: 1 },
  { name: 'back_seat', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]);
