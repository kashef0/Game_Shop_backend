const multer = require('multer');
const path = require('path');

// Använd minneslagring för att spara filen i ram istället för på disk
const storage = multer.memoryStorage();

// Filtrera tillåtna filtyper endast bilder tillåts
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed'), false);
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
  upload.single('profilePic')(req, res, (err) => {
    if (err) {
      // Handle different error types
      let message = 'File upload failed';
      
      if (err.code === 'LIMIT_FILE_SIZE') {
        message = 'File too large (max 5MB)';
      } else if (err.message.includes('Invalid file type')) {
        message = err.message;
      }

      return res.status(400).json({ 
        success: false,
        message 
      });
    }
    
    // Proceed if no errors
    next();
  });
};

module.exports = { uploadProfilePic };
