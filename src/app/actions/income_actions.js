"use server";

import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

export async function getSpendingAllocation(userId, year, month) {
    try {
        const result = await pool.query(`
            SELECT savings_percentage, needs_percentage, wants_percentage 
            FROM settings.spending_allocation 
            WHERE user_id = $1 AND year = $2 AND month = $3
        `, [userId, year, month]);

        return result.rows.length ? result.rows[0] : null;
    } catch (error) {
        console.error("🚨 Database Error:", error);
        return null;
    }
}

export async function updateSpendingAllocation(userId, year, month, savings, needs, wants) {
    try {
        await pool.query(`
            INSERT INTO settings.spending_allocation (user_id, year, month, savings_percentage, needs_percentage, wants_percentage)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (user_id, year, month)
            DO UPDATE SET savings_percentage = $4, needs_percentage = $5, wants_percentage = $6
        `, [userId, year, month, savings, needs, wants]);

        return { message: "Allocation updated successfully!" };
    } catch (error) {
        console.error("🚨 Database Update Error:", error);
        return { error: "Failed to update allocation." };
    }
}

export async function getUserIncome(userId, year, month) {
    try {
        const result = await pool.query(`
            SELECT income_amount 
            FROM settings.income 
            WHERE user_id = $1 AND year = $2 AND month = $3
        `, [userId, year, month]);

        return result.rows.length ? result.rows[0].income_amount : null;
    } catch (error) {
        console.error("🚨 Database Error:", error);
        return null;
    }
}

export async function updateUserIncome(userId, year, month, incomeAmount) {
    try {
        await pool.query(`
            INSERT INTO settings.income (user_id, year, month, income_amount)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id, year, month)
            DO UPDATE SET income_amount = $4
        `, [userId, year, month, incomeAmount]);

        return { message: "Income updated successfully!" };
    } catch (error) {
        console.error("🚨 Database Update Error:", error);
        return { error: "Failed to update income." };
    }
}
