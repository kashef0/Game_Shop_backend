const Order = require("../models/Order");
const Game = require("../models/Game");

// Skapa ny beställning
exports.createOrder = async (req, res) => {
  try {
    const { items, paymentMethod, name, email, address, telefon } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    if (!name || !email || !address) {
      return res
        .status(400)
        .json({ message: "All user details must be filled in" });
    }

    let totalPrice = 0;
    const orderItems = [];

    // Loopar igenom varje artikel i beställningen
    for (const item of items) {
      const game = await Game.findById(item.game); // Hämtar spelet baserat på spelets ID

      if (!game) {
        return res.status(404).json({ message: `Game could not be found` });
      }

      // Kontrollera om spelet är tillgängligt för uthyrning om det är en uthyrning
      if (item.isRental && !game.availableForRent) {
        return res.status(400).json({ message: "Game is not available for rent" });
      }

      // Kontrollera om det finns tillräckligt med lager
      if (game.stock < item.quantity) {
        return res.status(400).json({
          message: `Game ${game.name} Not enough stock, please contact customer service`,
        });
      }

      const price = item.isRental
        ? game.rentalPrice * item.quantity // Om det är en uthyrning, beräkna uthyrningspriset
        : game.price * item.quantity; // Annars beräkna köppriset

      totalPrice += price;

      // Lägg till beställningsartikeln i listan
      orderItems.push({
        game: game._id,
        quantity: item.quantity,
        isRental: item.isRental,
        priceAtPurchase: item.isRental ? game.rentalPrice : game.price,
      });

      // Uppdatera lagret för spelet
      game.stock -= item.quantity;
      await game.save();
    }

    // Beräkna förfallodatum för uthyrning om det behövs
    const hasRentals = orderItems.some((item) => item.isRental);
    const rentalReturnDate = hasRentals
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      : undefined;

    // Skapa beställningen i databasen
    const order = new Order({
      user: req.user.id,
      name,
      email,
      address,
      telefon,
      items: orderItems,
      totalPrice,
      paymentMethod,
      rentalReturnDate,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Hämta beställning efter ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email") // Hämta användarens namn och email
      .populate("items.game"); // Hämta spelets titel och bild

    if (!order) {
      return res.status(404).json({ message: "Order not found..." });
    }

    // Kontrollera om användaren äger beställningen eller om användaren är admin
    if (
      order.user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(order); // Skicka tillbaka beställningen
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Hämta användarens beställningar
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.game", "title coverImage")
      .sort({ createdAt: -1 }); // Sortera efter senaste beställning först

    res.json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Hämta alla beställningar bara admin
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("items.game", "title")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Uppdatera beställning till levererad bara admin
exports.updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isDelivered = true; // Markera beställningen som levererad
    order.deliveredAt = Date.now(); // Sätt leveransdatumet till nuvarande tidpunkt

    const updatedOrder = await order.save(); // Spara den uppdaterade beställningen
    res.json(updatedOrder); // Skicka tillbaka den uppdaterade beställningen
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Ta bort en order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Kontrollera om den inloggade användaren är admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this order." });
    }

    await order.deleteOne();

    // Skicka tillbaka ett meddelande om att ordern har tagits bort
    res.json({ message: "The order has been removed." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
