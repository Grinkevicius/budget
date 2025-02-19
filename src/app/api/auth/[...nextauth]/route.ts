import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";

// ✅ Define Custom User Type
interface CustomUser extends User {
    id: string;
    name: string;
    email: string;
}

// ✅ NextAuth Configuration
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials): Promise<CustomUser | null> {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }

                try {
                    const userCheck = await pool.query(
                        `SELECT id, name, email, password FROM "user".users WHERE email = $1`,
                        [credentials.email]
                    );

                    const user = userCheck.rows[0];

                    if (!user) {
                        throw new Error("User not found");
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isValid) {
                        throw new Error("Invalid password");
                    }

                    return {
                        id: user.id.toString(),
                        name: user.name ?? "Unknown",
                        email: user.email,
                    };
                } catch (error) {
                    console.error("🚨 Authorization error:", error);
                    throw new Error("Internal server error");
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, token }: { session: Session; token: JWT }) {
            if (session.user) {
                session.user.id = token.sub as string;
            }
            return session;
        },

        async jwt({
                      token,
                      user,
                  }: {
            token: JWT;
            user?: User | AdapterUser;
        }): Promise<JWT> {
            if (user) {
                const customUser = user as CustomUser;

                token.sub = customUser.id ?? user.id?.toString() ?? token.sub;
                token.name = customUser.name ?? user.name ?? "Unknown";
                token.email = customUser.email ?? user.email ?? "";
            }
            return token;
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET as string,
};

// ✅ Correctly Export NextAuth for Next.js App Router
const handler = NextAuth(authOptions);
export const GET = handler;
export const POST = handler;
