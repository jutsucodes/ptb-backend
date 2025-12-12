const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

(async function () {
  await mongoose.connect(process.env.MONGOOSE_URI);
})();

const booksetSchema = new mongoose.Schema(
  {
    imgs: { type: Array },
    title: { type: String },
    subject: { type: String },
    grade: Number,
    condition: { type: String },
    board: { type: String },
    giverDetails: {
      ownerName: { type: String },
      email: { type: String },
      whatsAppNum: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

mongoose.models = {};
const Bookset = mongoose.model("Bookset", booksetSchema);

// const userSchema = new mongoose.Schema({
//     name: { type: { type: String }, required: true },
//     email: { type: { type: String }, required: true, unique: true },
//     whatsapp: { type: Number, required: true },
//     booksets: { type: Array, required: true }
// }, { timestamps: true });

// mongoose.models = {};

// const mongoose.model("User", userSchema);

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  next();
});

app.get("/get-books", async (req, res) => {
  try {
    const { userId } = req.query;
    const data = await Bookset.find(userId ? { userId } : {});

    res.status(200).json(data);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add book endpoint
app.get('/add-book', async (req, res) => {
  try {
    await Bookset.insertOne(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
