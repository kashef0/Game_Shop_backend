const jwt = require('jsonwebtoken');
const User = require('../models/User');
// Middleware för att skydda rutter  
module.exports.protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Kontrollera om Authorization header finns och börjar med "Bearer"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Ingen token tillhandahölls." });
    }

    // Extrahera token från Authorization headern
    const token = authHeader.split(" ")[1];

    try {
        // Verifiera token  
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "Användaren hittades ej.." });
        }
        // Spara användardata från token  
        req.user = decoded;
        // Gå vidare  
        next();
    } catch (error) {
        return res.status(403).json({ message: "Ogiltig token." });
    }
};

// Middleware admin användare
module.exports.admin = (req, res, next) => {
    // Kontrollera att användaren finns och att rollen är admin
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        // Om inte, neka åtkomst
        return res.status(403).json({ message: "Adminåtkomst krävs." });
    }
};
