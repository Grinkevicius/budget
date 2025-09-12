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

        if (result.rows.length > 0) {
            // Get user's default settings (income and allocations)
            const userSettings = await pool.query(
                `SELECT default_income, default_savings_percentage, default_needs_percentage, default_wants_percentage 
                 FROM "user".settings WHERE user_id = $1`,
                [userId]
            );

            if (userSettings.rows.length > 0) {
                const settings = userSettings.rows[0];
                
                // Create income entry if user has default income
                if (settings.default_income) {
                    const incomeCode = `INC${new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)}${Math.random().toString(36).substr(2, 2).toUpperCase()}`;
                    
                    await pool.query(
                        `INSERT INTO income (referencecode, user_id, year, month, income_amount, created_at) 
                         VALUES ($1, $2, $3, $4, $5, NOW())`,
                        [incomeCode, userId, year, month, settings.default_income]
                    );
                    
                    console.log(`✅ Created income entry: $${settings.default_income}`);
                }
                
                // Create spending allocation entry if user has default allocations
                if (settings.default_savings_percentage !== null || 
                    settings.default_needs_percentage !== null || 
                    settings.default_wants_percentage !== null) {
                    
                    const allocationCode = `ALL${new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)}${Math.random().toString(36).substr(2, 2).toUpperCase()}`;
                    
                    await pool.query(
                        `INSERT INTO spending_allocation (referencecode, user_id, year, month, savings_percentage, needs_percentage, wants_percentage, created_at) 
                         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
                        [
                            allocationCode, 
                            userId, 
                            year, 
                            month, 
                            settings.default_savings_percentage || 0,
                            settings.default_needs_percentage || 0,
                            settings.default_wants_percentage || 0
                        ]
                    );
                    
                    console.log(`✅ Created spending allocation: ${settings.default_savings_percentage}% savings, ${settings.default_needs_percentage}% needs, ${settings.default_wants_percentage}% wants`);
                }
            }
        }

        return result.rows.length ? result.rows[0] : null;
    } catch (error) {
        console.error("🚨 Database Error (createBudget):", error);
        throw error; // Re-throw to let the caller handle it
    }
}
