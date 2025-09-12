"use server";

import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

export async function getTransactions(userId: string, year: number, month: number, category_code: string) {
    try {
        let query = `
            SELECT 
                t.referencecode, 
                t.description, 
                t.amount, 
                TO_CHAR(t.transaction_date, 'YYYY-MM-DD') AS transaction_date, 
                c.type, 
                t.category_code,
                t.vault_code,
                v.description AS vault_description,
                t.is_recurring
            FROM transactions t
            JOIN categories c ON t.category_code = c.referencecode
            JOIN budgets b ON t.budget_code = b.referencecode
            LEFT OUTER JOIN vaults v ON t.vault_code = v.referencecode
            WHERE b.user_id = $1
            AND b.year = $2
            AND b.month = $3
        `;

        const params = [userId, year, month];

        if (category_code !== "") {
            query += ` AND t.category_code = $4`;
            params.push(category_code);
        }

        query += ` ORDER BY t.transaction_date desc`;

        const result = await pool.query(query, params);
        return result.rows;
    } catch {
        return [];
    }
}