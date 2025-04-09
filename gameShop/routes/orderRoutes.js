const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/auth');
const {
  createOrder,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
  deleteOrder
} = require('../controllers/orderController');
// Skapa en ny order
router.post('/', protect, createOrder);

// Hämta användarens egna beställningar
router.get('/myorders', protect, getMyOrders);

// Hämta en order med specifikt ID 
router.get('/:id', protect, getOrderById);

// Hämta alla beställningar
router.get('/', protect, admin, getOrders);

// Uppdatera orderstatus till levererad
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);

// Lägg till rutt för att ta bort order
router.delete('/:id', protect, admin, deleteOrder); 

module.exports = router;