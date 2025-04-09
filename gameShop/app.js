require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");



// Importera global felhantering
const { notFound, errorHandler } = require("./middlewares/error");

const app = express();

app.use(cors());

app.use(express.json());



// Felhantering 404 först, sedan generell felhantering
app.use(notFound);
app.use(errorHandler);

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
