"use server";

import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

export async function getVaults(userid: string) {
    try {
        const result = await pool.query(
            `SELECT *
             FROM vaults
             WHERE user_id = $1
             `,
            [userid]
        );

        return result.rows;
    } catch (error) {
        console.error("🚨 Database Error (getVaults):", error);
        return [];
    }
}
