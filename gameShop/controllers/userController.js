const bcrypt = require('bcryptjs');
const User = require('../models/User'); 
const { uploadImage } = require('../config/storage'); 

// Hämta användarprofil
exports.getProfile = async (req, res) => {
  // Hämta användaren baserat på ID från den autentiserade användaren
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.json(user);
};

// Uppdatera användarprofil
exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  console.log('FILE:', req.file);
console.log('BODY:', req.body);

  if (req.user.id !== userId && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to update this profile' });
  }

  // Hämta användaren från databasen baserat på ID
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found...' });
  }

  // Definiera updateFields objekt för uppdatering av användarprofil
  let updateFields = {};

  // Uppdatera de fält som är tillåtna namn, profilbild och lösenord
  if (req.body.name) {
    updateFields.name = req.body.name; 
  }

  if (req.body.password) {
    // Om ett nytt lösenord skickas, skapa en salt och hash lösa det nya lösenordet
    const salt = await bcrypt.genSalt(10);
    updateFields.password = await bcrypt.hash(req.body.password, salt);
  }

  // Om en ny profilbild är uppladdad, hantera uppladdningen
  if (req.file) {
    try {
      const imageUrl = await uploadImage(req.file); 
      updateFields.profilePic = imageUrl;
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Uppdatera användaren med de fält som har ändrats
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true }
    );

    // Returnera den uppdaterade användarens information
    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id, 
        name: updatedUser.name, 
        email: updatedUser.email, 
        profilePic: updatedUser.profilePic, 
        role: updatedUser.role,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Ta bort användarprofil både användare och admin
exports.deleteProfile = async (req, res) => {
  const userId = req.params.id; 

  // Kontrollera om den inloggade användaren försöker ta bort sitt eget konto eller om användaren är en admin
  if (req.user.id !== userId && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to delete this profile' });
  }


  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Om användaren är en admin kan de ta bort vilket konto som helst 
  if (req.user.role === 'admin' && req.user.id !== userId) {
    await user.deleteOne(); 
    return res.json({ message: 'User removed by admin' });
  }

  // Om användaren tar bort sitt eget konto
  await user.deleteOne();
  res.json({ message: 'User deleted' });
};
