require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);

const cloudinaryRoutes = require("./routes/download");
app.use(cloudinaryRoutes);

app.listen(process.env.PORT, (req, res) => {
  console.log("server started");
});

//METTRE CE PROJET SUR GITHUB + L'AUTRE PROJET (CHECKING-MISSIONS) ET EFFACER CE COMMENTAIRE
