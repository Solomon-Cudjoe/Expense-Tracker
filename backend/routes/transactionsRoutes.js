import express from "express";
import { sql } from "../config/db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || !amount || !category || !user_id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const transaction = await sql`
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})

      RETURNING *;
    `;
    console.log(transaction);
    res.status(201).json({ message: "Transaction added", transaction });
  } catch (error) {
    console.error("Error adding transaction:", error);
    res.status(500).json({ error: "Failed to add transaction", error });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await sql`
      SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC;
    `;
    if (!transactions || transactions.length === 0) {
      return res
        .status(404)
        .json({ error: "No transactions found for this user" });
    }
    console.log(transactions);

    return res.status(200).json(transactions);
  } catch (error) {
    console.error("Error getting transaction:", error);
    res.status(500).json({ error: "Failed to get transaction", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result =
      await sql` DELETE FROM transactions WHERE id = ${id} RETURNING *; `;

    if (result.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res
      .status(200)
      .json({ message: "Transaction deleted", transaction: result[0] });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: "Failed to delete transaction", error });
  }
});

router.get("/summary/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`
  SELECT COALESCE(SUM(amount), 0) AS balance
  FROM transactions
  WHERE user_id = ${userId};
  `;
    const incomeResult = await sql`
  SELECT COALESCE(SUM(amount), 0) AS income
  FROM transactions
  WHERE user_id = ${userId} AND amount > 0;
  `;
    const expenseResult = await sql`
  SELECT COALESCE(SUM(amount), 0) AS expense
  FROM transactions
  WHERE user_id = ${userId} AND amount < 0;
  `;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expense: expenseResult[0].expense,
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: "Failed to delete transaction", error });
  }
});

export default router;
