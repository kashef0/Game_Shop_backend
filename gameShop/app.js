require("dotenv").config();
const { Storage } = require('@google-cloud/storage');
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

// Importera route filer
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const gameRoutes = require("./routes/gameRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Importera global felhantering
const { notFound, errorHandler } = require("./middlewares/error");

const app = express();

app.use(cors());

app.use(express.json());

// Definiera API rutter
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/orders", orderRoutes);

// Felhantering 404 först, sedan generell felhantering
app.use(notFound);
app.use(errorHandler);



// Initial Google Cloud Storage
const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
});



// Använd PORT från miljövariabel eller default 5000
const PORT = process.env.PORT || 5000;

// Anslut till MongoDB via Mongoose
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,       
    useUnifiedTopology: true,   
  })
  .then(() => console.log("MongoDb kopplad..."))
  .catch((err) => console.log(err)); // Logga anslutningsfel

// Starta Express-servern
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
