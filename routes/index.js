const express = require("express");
const router = express.Router();
const CardModel = require("./users");
const multer = require("multer");
const ImageKit = require("imagekit");
const dotenv = require("dotenv");
dotenv.config();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const imagekit = new ImageKit({
  publicKey: process.env.public_key,
  privateKey: process.env.private_key,
  urlEndpoint: process.env.URL_Endpoint,
});

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    const CardData = await CardModel.find({ isTopPriorities: true }).limit(3);
    res.render("index", { CardData });
  } catch (error) {
    res.render("index", { title: "Express" });
  }
});

router.post(
  "/Create_card",
  upload.single("image"),
  async function (req, res, next) {
    try {
      // Multer
      const imageData = req.file.buffer.toString("base64"); 

      // Upload to ImageKit
      const result = await imagekit.upload({
        file: imageData,
        fileName: req.file.originalname,
      });

      const filename = result.name;

      // Create a new card
      const CREATED_Card = await CardModel.create({
        Dish_Image: filename,
        Dish_Name: req.body.Dish_Name,
        Dish_Descrption: req.body.Dish_Descrption,
        Dish_Amount: req.body.Dish_Amount,
        isTopPriorities: req.body.isTopPriorities,
        rating: req.body.rating,
      });

      // Save and return the created card
      await CREATED_Card.save();
      res.status(200).json({ CREATED_Card });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while creating the card." });
    }
  }
);

module.exports = router;
