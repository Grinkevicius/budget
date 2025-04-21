"use server";

import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

export async function getCategoryData(
    category_code: string,
    userId: string,
    year: number,
    month: number
) {
    try {
        const result = await pool.query(
            `SELECT * FROM getcategorydata($1, $2, $3, $4)`,
            [userId, category_code, year, month]
        );
        return result.rows.length ? result.rows[0] : null;
    } catch (error) {
        console.error("🚨 Database Error (getCategoryData):", error);
        return null;
    }
}
