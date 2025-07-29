// routes/transaction.routes.js
const express = require("express");
const router = express.Router();

const transactionController = require("../controllers/transaction.controller");
const isAuthenticated = require("../middlewares/isAuthenticated");

// 👇 Protected routes (require valid JWT)
router.post("/", isAuthenticated, transactionController.createTransaction); // Create
router.get("/", isAuthenticated, transactionController.fetchAllTransactions); // Get all
router.get("/:id", isAuthenticated, transactionController.fetchTransactionById); // Get one by ID
router.get(
  "/user/:userId",
  isAuthenticated,
  transactionController.fetchTransactionsByUser
); // Get all by user
router.put("/:id", isAuthenticated, transactionController.updateTransaction); // Update
router.delete("/:id", isAuthenticated, transactionController.deleteTransaction); // Delete
router.get("/:id", isAuthenticated, downloadReceipt);

module.exports = router;
