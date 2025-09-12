import {Pool} from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error('Please add your DATABASE_URL to .env.local');
}

export const pool = new Pool({
    connectionString,
});

export async function query(text: string, params?: unknown[]) {
    return await pool.query(text, params);
}