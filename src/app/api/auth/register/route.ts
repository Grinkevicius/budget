import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Check if user exists
        const userCheck = await pool.query(`SELECT * FROM "user".users WHERE email = $1`, [email]);
        if (userCheck.rows.length > 0) {
            return NextResponse.json({ error: "Email already in use" }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        await pool.query(
            `INSERT INTO "user".users (name, email, password) VALUES ($1, $2, $3) RETURNING id`,
            [name, email, hashedPassword]
        );

        return NextResponse.json({ message: "User registered successfully!" }, { status: 201 });
    } catch (error) {
        console.error("Registration Error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
