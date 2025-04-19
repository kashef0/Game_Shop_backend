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
    // admin kan hantera denna funktion
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Inte auktoriserad att lägga till eller uppdatera spel' });
    }

    // Extrahera de olika fälten från request kroppen
    const { 
      rawgId, 
      title, 
      coverImage, 
      platforms, 
      genres, 
      releaseDate,
      price,
      rentalPrice,
      stock,
      availableForRent,
      metacritic,  
      rating,      
      updated,     
      shortScreenshots 
    } = req.body;

    // Kolla om ett spel med samma rawgId redan finns
    let game = await Game.findOne({ rawgId });

    if (!game) {
      // Om inget spel med detta rawgId finns, skapa ett nytt spel
      game = new Game({ rawgId });
    }

    // Uppdatera spelets olika fält med de nya värdena från requesten
    game.title = title;
    game.coverImage = coverImage;
    game.platforms = platforms;
    game.genres = genres;
    game.releaseDate = releaseDate;
    game.price = price;
    game.rentalPrice = rentalPrice;
    game.stock = stock;
    game.availableForRent = availableForRent;
    game.metacritic = metacritic; 
    game.rating = rating;         
    game.updated = updated;       
    game.shortScreenshots = shortScreenshots;
    game.isActive = true;

    // Spara spelet i databasen
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
