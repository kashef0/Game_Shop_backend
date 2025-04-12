const bcrypt = require('bcryptjs');
const User = require('../models/User'); 
const { uploadImage } = require('../config/storage'); 

// Hämta användarprofil
exports.getProfile = async (req, res) => {
  // Hämta användaren baserat på ID från den autentiserade användaren
  const user = await User.findById(req.user.id).select('-password'); // Välj alla fält utom lösenordet
  if (!user) {
    return res.status(404).json({ message: 'Användaren hittades inte' });
  }
  // Skicka tillbaka användarens information som JSON
  res.json(user);
};

// Uppdatera användarprofil (kan uppdatera namn, profilbild och lösenord)
exports.updateProfile = async (req, res) => {
  const userId = req.params.id; // Hämta användarens ID från URL-parametern

  // Kontrollera att användaren kan uppdatera sin egen profil eller om den är en admin
  if (req.user.id !== userId && req.user.role !== 'admin') {
    // Om användaren försöker uppdatera någon annan än sig själv, eller om hen inte är admin
    return res.status(403).json({ message: 'Inte behörig att uppdatera denna profil' });
  }

  // Hämta användaren från databasen baserat på ID:t
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'Användaren hittades ej...' });
  }

  // Uppdatera de fält som är tillåtna namn, profilbild och lösenord
  if (req.body.name) {
    user.name = req.body.name; 
  }

  if (req.body.password) {
    // Om ett nytt lösenord skickas, skapa en salt och hash lösa det nya lösenordet
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
  }

  // Om en ny profilbild är uppladdad, hantera uppladdningen
  if (req.file) {
    try {
      const imageUrl = await uploadImage(req.file);
      user.profilePic = imageUrl;
    } catch (err) {
      return res.status(500).json({ message: 'Misslyckades att ladda upp bild' });
    }
  }

  // Spara den uppdaterade användardokumentet
  const updatedUser = await user.save();

  // Returnera den uppdaterade användarens information
  res.json({
    _id: updatedUser._id, 
    name: updatedUser.name, 
    email: updatedUser.email, 
    profilePic: updatedUser.profilePic, 
    role: updatedUser.role,
  });
};

// Ta bort användarprofil både användare och admin
exports.deleteProfile = async (req, res) => {
  const userId = req.params.id; 

  // Kontrollera om den inloggade användaren försöker ta bort sitt eget konto eller om användaren är en admin
  // En admin kan ta bort vilket användarkonto som helst, men vanliga användare kan bara ta bort sitt eget konto
  if (req.user.id !== userId && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Inte auktoriserad att ta bort denna profil' });
  }

  // Hitta användaren baserat på deras ID
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'Användaren hittades inte' });
  }

  // Om användaren är en admin kan de ta bort vilket konto som helst 
  if (req.user.role === 'admin' && req.user.id !== userId) {
    await user.deleteOne(); 
    return res.json({ message: 'Användare borttagen av admin' });
  }

  // Om användaren tar bort sitt eget konto
  await user.deleteOne();
  res.json({ message: 'Användare borttagen' });
};
