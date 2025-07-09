
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload directories if they don't exist
const createUploadDirs = () => {
  const dirs = [
    'uploads',
    'uploads/profiles',
    'uploads/documents',
    'uploads/certificates'
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Initialize upload directories
createUploadDirs();

// Generic storage configuration
const createStorage = (subfolder) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `uploads/${subfolder}/`);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const prefix = subfolder.slice(0, 4); // First 4 chars of subfolder
      cb(null, `${prefix}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  });
};

// File filter for images
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, JPG, PNG, GIF) are allowed'));
  }
};

// File filter for documents
const documentFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|jpg|jpeg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype) || 
                   file.mimetype.includes('document') || 
                   file.mimetype === 'application/pdf';

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX, and image files are allowed'));
  }
};

// Multer configurations
const profileUpload = multer({
  storage: createStorage('profiles'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFilter
});

const documentUpload = multer({
  storage: createStorage('documents'),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: documentFilter
});

const certificateUpload = multer({
  storage: createStorage('certificates'),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: documentFilter
});

module.exports = {
  profileUpload,
  documentUpload,
  certificateUpload,
  createStorage,
  imageFilter,
  documentFilter
};
