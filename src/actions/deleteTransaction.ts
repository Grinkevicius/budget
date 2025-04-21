"use server";

import { pool } from "@/lib/db"; // Your pg Pool instance

interface DeleteTransactionData {
    referencecode: string;
}

export async function deleteTransaction({ referencecode }: DeleteTransactionData) {
    const query = `
        DELETE FROM transactions
        WHERE referencecode = $1
        RETURNING referencecode;
    `;
    try {
        const result = await pool.query(query, [referencecode]);
        if (result.rows.length === 0) {
            throw new Error("Transaction not found");
        }
        return result.rows[0];
    } catch (error) {
        console.error("Error deleting transaction:", error);
        throw error;
    }
}
