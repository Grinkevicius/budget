"use server";

import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

export async function getCategories() {
    try {
        const result = await pool.query(`
            SELECT referencecode, type FROM categories 
            ORDER BY weight
        `);
        return result.rows;
    } catch (error) {
        console.error("🚨 Database Error Fetching Categories:", error);
        return [];
    }
}
