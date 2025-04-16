const multer = require('multer');
const path = require('path');

// Använd minneslagring för att spara filen i ram istället för på disk
const storage = multer.memoryStorage();

// Filtrera tillåtna filtyper endast bilder tillåts
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'), false);
  }
};

// Konfigurera Multer med minneslagring filfilter och filstorleksgräns
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, 
    files: 1 
  }
});

// hantera enstaka filuppladdning med fältnamn profilePic 
const uploadProfilePic = (req, res, next) => {
  console.log('Middleware triggered');
  upload.single('profilePic')(req, res, (err) => {
  
    if (err) {
      console.error('Multer Error:', {
        code: err.code,
        message: err.message,
      });
      return res.status(400).json({ 
        success: false,
        message: err.message 
      });
    }

    console.log('Multer Success - File:', {
      originalname: req.file?.originalname,
      mimetype: req.file?.mimetype,
      size: req.file?.size,
    });
    next();
  });
};

module.exports = { uploadProfilePic };
