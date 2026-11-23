import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { db, mongoClient } from "./mongodb";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || appUrl,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, { client: mongoClient }),
  // production domain must be listed here (brief: deployment guideline)
  trustedOrigins: [appUrl, "http://localhost:3000"],
  emailAndPassword: { enabled: true, minPasswordLength: 6, autoSignIn: true },
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer", input: true },
      phone: { type: "string", required: false, defaultValue: "", input: true },
      area: { type: "string", required: false, defaultValue: "", input: true },
      bio: { type: "string", required: false, defaultValue: "", input: true },
    },
  },
  databaseHooks: {
    user: {
      create: {
        // Server-side guard: nobody can sign up as admin, anything unknown becomes customer
        before: async (user) => {
          const role = (user as { role?: string }).role;
          return {
            data: { ...user, role: role === "technician" ? "technician" : "customer" },
          };
        },
      },
    },
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
