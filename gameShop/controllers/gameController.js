const Game = require('../models/Game');
const { admin } = require('../middlewares/auth'); 

// Hämta alla aktiva spel
exports.getGames = async (req, res) => {
  try {
    const isAdmin = req.user && req.user.role === 'admin';

    const filter = isAdmin ? {} : { isActive: true };
    // Hämta alla spel som är aktiva
    const games = await Game.find(filter);
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
exports.addGame = async (req, res) => {
  try {
    // admin kan hantera denna funktion
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Inte auktoriserad att lägga till eller uppdatera spel' });
    }

    // Extrahera de olika fälten från request kroppen
    const {
      rawgId,
      price,
      rentalPrice,
      stock,
      availableForRent,
      isActive
    } = req.body;

    // kontrollera om spel finns 
    if (!rawgId) {
      return res.status(400).json({ message: 'game not exist' });
    }

    // Kolla om ett spel med samma rawgId redan finns
    const existing = await Game.findOne({ rawgId });
    if (existing) {
      return res.status(400).json({ message: 'Game already exists' });
    }
    const newGame = new Game({
      rawgId,
      price,
      rentalPrice,
      stock,
      availableForRent,
      isActive

    })

    // Spara spelet i databasen
    const savedGame = await newGame.save();
    res.status(201).json({
  message: 'Game saved successfully',
  data: savedGame
});

  } catch (error) {
     if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ errors: messages });
  }
};


exports.updateGame = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const {
      price,
      rentalPrice,
      stock,
      availableForRent,
      isActive,
    } = req.body;

    game.price = price ?? game.price;
    game.rentalPrice = rentalPrice ?? game.rentalPrice;
    game.stock = stock ?? game.stock;
    game.availableForRent = availableForRent ?? game.availableForRent;
    game.isActive = isActive ?? game.isActive;

    const updated = await game.save();
    res.status(200).json({
      message: 'Game updated successfully',
      data: updated
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
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
