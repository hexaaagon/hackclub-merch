import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema",
  dialect: "postgresql",
  out: "./src/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
} satisfies Config;
