require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const apiRoutes = require("./routes/api.routes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Database Connected Successfully!");
    app.listen(PORT, () => console.log(`XExit Backend Engine listening on Port ${PORT}!`));
  })
  .catch((error) => console.error("Database bootup link failed: ", error));