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
            FROM spending_allocation 
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
            INSERT INTO "user".settings (user_id, default_savings_percentage, default_needs_percentage, default_wants_percentage)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (user_id)
            DO UPDATE SET default_savings_percentage = $4, default_needs_percentage = $5, default_wants_percentage = $6
        `, [userId, year, month, savings, needs, wants]);

        return { message: "Allocation updated successfully!" };
    } catch (error) {
        console.error("🚨 Database Update Error:", error);
        return { error: "Failed to update allocation." };
    }
}

export async function getUserIncome(userId) {
    try {
        const result = await pool.query(`
            SELECT default_income 
            FROM "user".settings 
            WHERE user_id = $1
        `, [userId]);

        return result.rows.length ? result.rows[0].default_income : null;
    } catch (error) {
        console.error("🚨 Database Error:", error);
        return null;
    }
}

export async function updateUserIncome(userId, default_income) {
    try {
        await pool.query(`
            INSERT INTO "user".settings (user_id, default_income)
            VALUES ($1, $2)
            ON CONFLICT (user_id)
            DO UPDATE SET default_income = $2
        `, [userId, default_income]);

        return { message: "Income updated successfully!" };
    } catch (error) {
        console.error("🚨 Database Update Error:", error);
        return { error: "Failed to update income." };
    }
}
