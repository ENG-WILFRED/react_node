// src/services/transactionService.js
import prisma from "../prisma/client.js";

export async function getAllTransactions() {
  return await prisma.transaction.findMany({
    orderBy: { timestamp: "desc" },
  });
}

export async function getTransactionsByUser(userId) {
  return await prisma.transaction.findMany({
    where: { senderId: userId },
    orderBy: { timestamp: "desc" },
  });
}

export async function getTransactionById(id) {
  return await prisma.transaction.findUnique({
    where: { id },
  });
}

export async function createTransaction(data) {
  return await prisma.transaction.create({
    data,
  });
}

export async function updateTransaction(id, data) {
  return await prisma.transaction.update({
    where: { id },
    data,
  });
}

export async function deleteTransaction(id) {
  return await prisma.transaction.delete({
    where: { id },
  });
}
