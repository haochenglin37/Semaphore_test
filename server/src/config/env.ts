import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
export const DATABASE_URL = process.env.DATABASE_URL || "";
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
