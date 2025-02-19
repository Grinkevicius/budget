// types/next-auth.d.ts

import type { DefaultSession } from "next-auth";

/**
 * Extends the built-in session object to always include a user with id, name, and email.
 */
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
        };
    }
}
