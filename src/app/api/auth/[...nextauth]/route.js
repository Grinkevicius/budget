import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }

                try {
                    // Fetch user from DB
                    const userCheck = await pool.query(
                        `SELECT * FROM "user".users WHERE email = $1`,
                        [credentials.email]
                    );

                    const user = userCheck.rows[0];

                    if (!user) {
                        throw new Error("User not found");
                    }

                    // Compare hashed password
                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isValid) {
                        throw new Error("Invalid password");
                    }

                    return { id: user.id, name: user.name, email: user.email };
                } catch (error) {
                    console.error("🚨 Authorization error:", error);
                    throw new Error("Internal server error");
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.id;
            return session;
        },
        async jwt({ token, user }) {
            if (user) token.id = user.id;
            return token;
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
