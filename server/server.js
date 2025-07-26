const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const issueRoutes = require("./routes/issues");

app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log("Server started on port", process.env.PORT)
    );
  })
  .catch((err) => console.error(err));
