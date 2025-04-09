const User = require('../models/User');

// kontrollerar om användaren redan finns
const checkUserExists = async (email) => {
  // Hitta användaren baserat på email
  const userExists = await User.findOne({ email });
  return userExists;
};

module.exports = checkUserExists;
