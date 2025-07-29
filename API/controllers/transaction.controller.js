import { generateReceiptPDF } from "../services/receiptService.js";
import prisma from "../prisma/client.js";
import {
  getAllTransactions,
  getTransactionById,
  getTransactionsByUser,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/transactionService";

export const fetchAllTransactions = async (req, res) => {
  try {
    const transactions = await getAllTransactions();
    res.json({ success: true, transactions });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const fetchTransactionsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const transactions = await getTransactionsByUser(userId);
    res.json({ success: true, transactions });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const fetchTransactionById = async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await getTransactionById(id);
    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    }
    res.json({ success: true, transaction });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createTransaction = async (req, res) => {
  const { recipient, amount, currency } = req.body;

  if (!recipient || !amount || !currency) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    const transaction = await createTransaction({
      senderId: req.user.id,
      recipient,
      amount,
      currency,
    });

    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      transaction,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create transaction",
    });
  }
};

export const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { recipient, amount, currency } = req.body;

  try {
    const transaction = await updateTransaction(id, {
      recipient,
      amount,
      currency,
    });

    res.json({
      success: true,
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update transaction",
    });
  }
};

export const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteTransaction(id);
    res.json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete transaction",
    });
  }
};

export const downloadReceipt = async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await prisma.transaction.findUnique({ where: { id } });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const user = await prisma.user.findUnique({
      where: { id: transaction.senderId },
    });

    const filePath = await generateReceiptPDF(transaction, user);

    res.download(filePath, `receipt-${transaction.id}.pdf`);
  } catch (err) {
    res.status(500).json({ message: "Error generating receipt" });
  }
};
