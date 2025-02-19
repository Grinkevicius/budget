import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";

// 1. Define a CustomUser interface (optional).
//    - If you strictly want your user to have id, name, email as strings.
interface CustomUser extends User {
    id: string;
    name: string;
    email: string;
}

// 2. Keep authOptions as a LOCAL constant. Do NOT export it.
//    - Next.js routes only allow GET, POST, etc. exports.
const authOptions: NextAuthOptions = {
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
                    // Fetch user from DB
                    const userCheck = await pool.query(
                        `SELECT id, name, email, password FROM "user".users WHERE email = $1`,
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
        // 3. session callback sets session.user.id from token.sub
        async session({ session, token }: { session: Session; token: JWT }) {
            if (session.user) {
                session.user.id = token.sub as string;
            }
            return session;
        },

        // 4. jwt callback sets token.sub, token.name, token.email from the user
        async jwt({
                      token,
                      user,
                  }: {
            token: JWT;
            user?: User | AdapterUser; // NextAuth might pass default 'User' or 'AdapterUser'
        }): Promise<JWT> {
            if (user) {
                // Cast to your custom user shape if you want strict fields
                const customUser = user as CustomUser;

                // Fallback safely for name, email if NextAuth's user is partial
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
    secret: process.env.NEXTAUTH_SECRET,
};

// 5. Export GET & POST from NextAuth, NOT authOptions
const handler = NextAuth(authOptions);
export const { GET, POST } = handler;
