const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

cloudinary.config({
  cloud_name: 'your_cloud_name',
  api_key: 'your_api_key',
  api_secret: 'your_api_secret'
});

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

// Create an endpoint to generate signature
app.post('/get-signature', (req, res) => {
  const timestamp = Math.round(Date.now() / 1000);
  
  const paramsToSign = {
    timestamp: timestamp,
  };
  
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    "DlBrAhDeT4qZ8NKl4rC4LZk2Pyw"
  );
  
  res.status(200).json({
    signature: signature,
    timestamp: timestamp,
  });
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
  let body = { req };
  let resp = await fetch("/get-signature");
  let sigdata = await resp.json();

  body.imgs.map(img => 
    let res = await fetch("https://api.cloudinary.com/v1_1/dryhcd2gr/image/upload", {
      method: "POST",
      body: JSON.stringify({
        file: img,
        api_key: "653883944111699",
        ...sigdata
      })
  }));
  
  delete body["imgs"];
  try {
    await Bookset.insertOne(body);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
