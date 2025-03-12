"use server";

import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

export async function getVault(userid: string, referenceCode: string) {
    try {
        const result = await pool.query(
            `SELECT *
             FROM vaults
             WHERE user_id = $1 AND referenceCode = $2
             `,
            [userid, referenceCode]
        );

        return result.rows[0];
    } catch (error) {
        console.error("🚨 Database Error (getVaults):", error);
        return "";
    }
}
