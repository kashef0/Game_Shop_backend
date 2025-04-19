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
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const {
      rawgId,
      price,
      rentalPrice,
      stock,
      availableForRent,
      isActive
    } = req.body;

    if (!rawgId || price == null || rentalPrice == null || stock == null) {
      return res.status(400).json({ message: 'all fields is required' });
    }

    let game = await Game.findOne({ rawgId });

    if (!game) {
      game = new Game({ rawgId });
    }

    game.price = price;
    game.rentalPrice = rentalPrice;
    game.stock = stock;
    game.availableForRent = availableForRent ?? false;
    game.isActive = isActive ?? true;

    const savedGame = await game.save();
    res.status(201).json(savedGame);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
