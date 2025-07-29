// src/app.js
const express = require("express");
const app = express();
const authRoutes = require("./routes/auth.routes");

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/transactions", require("./routes/transaction.routes"));

module.exports = app;
