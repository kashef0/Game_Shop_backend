const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { uploadProfilePic } = require('../middlewares/upload');
const { getProfile, updateProfile, deleteProfile } = require('../controllers/userController');

// Hämta användarens profil
router.get('/profile', protect, getProfile);
// Uppdatera användarens profil 
router.put('/profile/:id', protect, uploadProfilePic, updateProfile);

// Ta bort användarens profil
router.delete('/profile/:id', protect, deleteProfile);  

module.exports = router;
