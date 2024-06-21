import dotenv from "dotenv";
dotenv.config();

interface DBConfig {
  username: string;
  password: string | null;
  database: string;
  host: string;
  dialect: string;
  port?: number;
}

interface Config {
  development: DBConfig;
  test: DBConfig;
  production: DBConfig;
}

const config: Config = {
  development: {
    username: process.env.SUPABASE_USER || "",
    password: process.env.SUPABASE_PASSWORD || "",
    database: process.env.SUPABASE_DB_NAME || "",
    host: process.env.SUPABASE_HOST || "",
    dialect: "postgres",
    port: Number(process.env.SUPABASE_PORT),
  },
  test: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_DATABASE || "database_test",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_DATABASE || "database_production",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
  },
};

export default config;
