const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require("mongodb");

// The corrected MongoDB URI
const uri =
  "mongodb+srv://dev24mxpertz:dev24@jonnybbqcluster.fispusm.mongodb.net/?retryWrites=true&w=majority&appName=JonnyBBQCluster";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

// Connect mongoose to the same MongoDB instance
mongoose
  .connect(uri)
  .then(() => {
    console.log("Mongoose connected to MongoDB!");
  })
  .catch((error) => {
    console.error("Mongoose connection error:", error);
  });

// Define the card schema
const cardSchema = new mongoose.Schema({
  Dish_Image: { type: String, required: true },
  Dish_Name: {
    type: String,
    required: true,
  },
  Dish_Descrption: {
    type: String,
    required: true,
  },
  Dish_Amount: {
    type: Number,
    required: true,
  },
  isTopPriorities: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("card", cardSchema);
