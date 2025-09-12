"use server";

import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

export type Props = {
    userId: string;
    referenceCode: string;
};

export async function deleteIncomeEntry({ userId, referenceCode }: Props) {
    try {
        const result = await pool.query(
            `
        DELETE FROM income
        WHERE referencecode = $1 
          AND user_id = $2
      `,
            [referenceCode, userId]
        );

        return { success: true, rowCount: result.rowCount };
    } catch (error) {
        console.error("🚨 Database Error (deleteIncomeEntry):", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
