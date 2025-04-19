const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/auth');
const {
  getGames,
  getGameById,
  updateGame,
  addGame,
  toggleGameStatus,
  deleteGame 
} = require('../controllers/gameController');


router.get('/', getGames); // Hämtar alla aktiva spel
router.get('/:id', getGameById); // Hämtar ett spel med ett specifikt ID

// Admin rutter: Skyddade med protect och admi 
router.post('/', protect, admin, addGame); // Lägg till eller uppdatera spel
router.put('/:id', protect, admin, updateGame); // update alla spel data
router.put('/:id/status', protect, admin, toggleGameStatus); // Växla spelets status 
router.delete('/:id', protect, admin, deleteGame); // Ta bort ett spel 

module.exports = router;
