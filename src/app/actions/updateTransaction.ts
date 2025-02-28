"use server";

import { pool } from "@/lib/db"; // Make sure you have a pg Pool exported from this module

interface UpdateTransactionData {
    referencecode: string;
    description: string;
    amount: number;
    transaction_date: string; // Format: YYYY-MM-DD
    note?: string;
    is_recurring: boolean;
}

export async function updateTransaction(data: UpdateTransactionData) {
    const query = `
        UPDATE transactions
        SET description = $1,
            amount = $2,
            transaction_date = $3,
            note = $4,
            is_recurring = $5
        WHERE referencecode = $6
        RETURNING
            referencecode,
            description,
            amount,
            transaction_date,
            note,
            is_recurring,
            category_code,
            budget_code,
            user_id,
            created_at
    `;
    const values = [
        data.description,
        data.amount,
        data.transaction_date,
        data.note || null,
        data.is_recurring,
        data.referencecode,
    ];

    try {
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            throw new Error("Transaction not found");
        }
        return result.rows[0];
    } catch (error) {
        console.error("Error updating transaction:", error);
        throw error;
    }
}
