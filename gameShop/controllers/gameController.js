const Game = require('../models/Game');
const { admin } = require('../middlewares/auth'); 

// Hämta alla aktiva spel
exports.getGames = async (req, res) => {
  try {
    // Hämta alla spel som är aktiva
    const games = await Game.find({ isActive: true });
    res.json(games); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hämta spel efter ID
exports.getGameById = async (req, res) => {
  try {
    // Hämta spelet med ID som anges i URL parametern
    const game = await Game.findById(req.params.id);
    
    if (!game) {
      // Om spelet inte hittas, returnera felmeddelandet
      return res.status(404).json({ message: 'Spelet hittades inte' });
    }
    
    res.json(game); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lägg till eller uppdatera spel
exports.addOrUpdateGame = async (req, res) => {
  try {
    // Validera användarrollen för adminåtkomst
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Ej auktoriserad' });
    }

    const { rawgId, price, rentalPrice, stock, availableForRent } = req.body;

    // Kontrollera om spelet med rawgId redan finns
    let game = await Game.findOne({ rawgId });

    // Om spelet inte finns, skapa ett nytt spelobjekt
    if (!game) {
      game = new Game({ rawgId });
    }

    // Uppdatera spelet med de data som mottagits från frontend (pris, hyrespris, lager, etc.)
    game.price = price;
    game.rentalPrice = rentalPrice;
    game.stock = stock;
    game.availableForRent = availableForRent;
    game.isActive = true; // Markera spelet som aktivt

    // Spara eller uppdatera spelet i databasen
    const savedGame = await game.save();

    return res.status(201).json(savedGame);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};


// Växla spelets status
exports.toggleGameStatus = async (req, res) => {
  try {
    // admin kan hantera denna funktion
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Inte auktoriserad att växla status för spel' });
    }

    // Hämta spelet med ID från URL parametern
    const game = await Game.findById(req.params.id);
    
    if (!game) {
      // Om spelet inte hittas, returnera felmeddelande
      return res.status(404).json({ message: 'Spelet hittades ej...' });
    }

    // Växla spelets isActive status om det är aktivt blir det inaktivt och vice versa
    game.isActive = !game.isActive;
    await game.save(); 
    
    res.json(game); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ta bort spel 
exports.deleteGame = async (req, res) => {
  try {
    // admin kan ta bort spel
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Inte auktoriserad att ta bort spel' });
    }

    const game = await Game.findById(req.params.id);
    
    if (!game) {
      return res.status(404).json({ message: 'Spelet hittades ej' });
    }


    await game.deleteOne(); 

    res.json({ message: 'Spelet borttaget' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
