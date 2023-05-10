require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

// Importing routes
const uploadRoutes = require("./routes/UploadRoutes");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Alegra upload endpoint");
});

app.use("/upload-alegra", uploadRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
