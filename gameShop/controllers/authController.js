const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken'); 
const checkUserExists = require('../utils/checkUserExists')
const validator = require('validator');
// Registrera användare
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kontrollera om användaren redan finns
    const userExists = await checkUserExists(email);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    if (!validator.isLength(password, { min: 8 })) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    // Hasha lösenordet
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Skapa en ny användare
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // Generera jwt token med hjälp av generateToken funktionen
    const token = generateToken(user._id, user.role);

    // Svara med användarens data och token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: 'user',
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logga in användare
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kontrollera om användaren finns i databasen
    const user = await checkUserExists(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Jämför lösenordet med det hashade lösenordet i databasen
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generera JWT token för den inloggade användaren
    const token = generateToken(user._id, user.role);

    // Svara med användarens data och token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic, // Profilbild om den finns
      role: user.role,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Registrera administratör
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, adminSecret } = req.body;

    // Kontrollera om rätt admin hemlighet tillhandahålls
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ message: 'Invalid admin secret' });
    }

    // Hasha lösenordet
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Skapa en ny administratörsanvändare
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin', 
      profilePic: req.file ? await uploadImage(req.file) : ''
    });

    // Generera en JWT token för administratören
    const token = generateToken(user._id, user.role);

    // Svara med användarens data och token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic, // Profilbild om den finns
      token
    });
  } catch (error) {
    // Hantera eventuella fel och skicka status 500
    res.status(500).json({ message: error.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await checkUserExists(email);

    if (!user || user.role !== 'admin') {
      return res.status(401).json({ message: 'Access denied. Only admin are allowed to log in.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
