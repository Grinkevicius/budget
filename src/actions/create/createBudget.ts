"use server";

import { pool } from "@/lib/db";

export async function createBudget(userId: string | number, year: number, month: number) {
    try {

        
        // First check if budget already exists
        const existingBudget = await pool.query(
            `SELECT referencecode FROM budgets 
             WHERE user_id = $1 AND year = $2 AND month = $3`,
            [userId, year, month]
        );

        if (existingBudget.rows.length > 0) {

            return existingBudget.rows[0];
        }

        // Generate budget reference code
        const budgetCode = `BUD${new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)}${Math.random().toString(36).substr(2, 2).toUpperCase()}`;
        
        // Create new budget
        const result = await pool.query(
            `INSERT INTO budgets (referencecode, user_id, year, month, created_at) 
             VALUES ($1, $2, $3, $4, NOW()) 
             RETURNING *`,
            [budgetCode, userId, year, month]
        );


        return result.rows.length ? result.rows[0] : null;
    } catch (error) {
        console.error("🚨 Database Error (createBudget):", error);
        throw error; // Re-throw to let the caller handle it
    }
}
