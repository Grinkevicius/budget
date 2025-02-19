import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // 🔍 Validate credentials and return user object
                if (credentials?.email === "admin@example.com" && credentials?.password === "password") {
                    return { id: "1", name: "Admin", email: "admin@example.com" };
                }
                return null;
            },
        }),
    ],
    pages: {
        signIn: "/auth/signin", // ✅ Custom sign-in page
    },
};
