//L'Objectif de ce projet était de faire particulièrement une route update (en PUT) afin de modifier le nom d'une clé issu d'un fichier envoyé sur cloudinary. Pour ma part, c'est une piste nouvellement exploitée et une réussite.

const express = require("express");
const router = express.Router();

const cloudinary = require("cloudinary").v2;

const fileUpload = require("express-fileupload");

const Download = require("../model/Download");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const convertToBase64 = require("../utils/convertToBase64");

router.post("/cloudinary/add", fileUpload(), async (req, res) => {
  try {
    const picture = req.files.picture;
    const completePicture = await cloudinary.uploader.upload(
      convertToBase64(picture)
    );
    const { name, description, author } = req.body;
    const newDownload = new Download({
      name: name,
      description: description,
      author: author,
      picture: completePicture,
    });
    await newDownload.save();
    res.json(newDownload);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/cloudinary/gallery", async (req, res) => {
  try {
    const cloudinaryGallery = await Download.findById(req.query.id);
    if (!req.query.id) {
      res.status(400).json({ message: "bad request" });
    } else {
      res.json(cloudinaryGallery);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;

router.put("/cloudinary/update", async (req, res) => {
  try {
    const updateInformations = await Download.findByIdAndUpdate(req.body.id, {
      name: req.body.name,
    });
    if (!req.body.name || !req.body.id) {
      res.json({ message: "missing keys" });
    } else {
      await updateInformations.save();
      res.json(updateInformations);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/cloudinary/delete", async (req, res) => {
  try {
    await Download.findByIdAndDelete(req.body.id);
    if (req.body.id) {
      res.status(201).json({ message: "file deleted with success" });
    } else {
      res.json({ message: "denied" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
