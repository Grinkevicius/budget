"use server";

import { pool } from "@/lib/db";

export async function clearBudgets() {
    try {
        // Clear all related data first (foreign key constraints)
        await pool.query('DELETE FROM income');
        await pool.query('DELETE FROM spending_allocation');
        await pool.query('DELETE FROM transactions');
        
        // Then clear budgets
        await pool.query('DELETE FROM budgets');
        
        console.log("✅ All budgets and related data cleared successfully");
        return { success: true, message: "All budgets cleared successfully" };
    } catch (error) {
        console.error("🚨 Database Error (clearBudgets):", error);
        return { success: false, error: "Failed to clear budgets" };
    }
}