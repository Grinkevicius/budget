"use server";

import { pool } from "@/lib/db";

interface AddTransactionData {
    userId: string;
    budgetCode: string;
    category: string;
    description: string;
    amount: number;
    transaction_date: string;
}

export async function addTransaction(data: AddTransactionData) {
    const query = `
    INSERT INTO transactions (user_id, budget_code, category_code, description, amount, transaction_date)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
    const values = [
        data.userId,
        data.budgetCode,
        data.category,
        data.description,
        data.amount,
        data.transaction_date,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
}
