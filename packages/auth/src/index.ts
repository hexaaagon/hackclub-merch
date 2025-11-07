import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { db } from "@merch/drizzle";
import * as schema from "@merch/drizzle/auth";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema,
  }),
  socialProviders: {
    slack: {
      clientId: process.env.SLACK_CLIENT_ID,
      clientSecret: process.env.SLACK_CLIENT_SECRET,
      team: "T0266FRGM",
    },
  },
  plugins: [nextCookies()],
});

export { authClient } from "./client";
export * from "better-auth";
