const jwt = require('jsonwebtoken');

// generera JWT-token
const generateToken = (id, role) => {
  // Skapa och returnera jwt token med användarens id och roll som payload
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d', 
  });
};


module.exports = generateToken;
