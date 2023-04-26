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

app.listen(3008, () => {
  console.log("Server is running on port 3008");
});
