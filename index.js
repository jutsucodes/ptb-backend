const express = require('express');
const mongoose = require("mongoose");
const fetch = require("node-fetch");
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const app = express();

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

cloudinary.config({
  cloud_name: 'dryhcd2gr',
  api_key: '653883944111699',
  api_secret: 'DlBrAhDeT4qZ8NKl4rC4LZk2Pyw'
});

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
    subjects: { type: Array },
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
<<<<<<< HEAD
    const { id } = req.query;
    const data = await Bookset.find(id ? {
  _id: { $in: id.split("+") }
}: {});
    const { userId } = req.query;
    const data = await Bookset.find(userId ? { userId } : {});

    res.status(200).json(data);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add book endpoint
app.post('/add-book', express.json({ limit: '20mb' }), async (req, res) => {
  const { body } = req;
  
  try {
    const uploadPromises = body.imgs.map(img => 
      cloudinary.uploader.upload(img, {
        upload_preset: "PassTheBook",
      })
    );

console.log(body.imgs.length);

    const uploadResults = await Promise.all(uploadPromises);
    const imgUrls = uploadResults.map(result => result.secure_url);

    const bookData = { ...body, imgs: imgUrls };
    let bs = await Bookset.insertOne(bookData);

    res.status(200).json({ success: true, id: bs._id });
  } catch (error) {
    console.error("Upload Error:", error);
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
