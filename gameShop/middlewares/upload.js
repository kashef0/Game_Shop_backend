const multer = require('multer');
const path = require('path');

// Använd minneslagring för att spara filen i ram istället för på disk
const storage = multer.memoryStorage();

// Filtrera tillåtna filtyper endast bilder tillåts
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;

  // Kontrollera om MIME typ är en av de tillåtna
  const mimetype = filetypes.test(file.mimetype);

  // Kontrollera om filändelsen är korrekt
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  // Om både mimetype och extension är giltiga, acceptera filen
  if (mimetype && extname) {
    return cb(null, true);
  }

  // Annars neka uppladdning och returnera fel
  cb(new Error('Endast bilder (jpeg, jpg, png, gif) är tillåtna'));
};

// Konfigurera Multer med minneslagring filfilter och filstorleksgräns
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // bildfilen ska inte vara mer än 5MB
  },
});

// hantera enstaka filuppladdning med fältnamn profilePic 
const uploadProfilePic = upload.single('profilePic');

module.exports = { uploadProfilePic };
