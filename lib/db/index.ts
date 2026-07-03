import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import fs from "fs";
import path from "path";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  sqlite?: Database.Database;
  db?: ReturnType<typeof drizzle<typeof schema>>;
};

function resolveDbPath() {
  const configured = process.env.DATABASE_PATH;
  if (configured) return path.resolve(configured);
  return path.join(process.cwd(), "data", "talksasa.db");
}

function createConnection() {
  const dbPath = resolveDbPath();
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  sqlite.pragma("busy_timeout = 5000");

  const db = drizzle(sqlite, { schema });
  const migrationsFolder = path.join(process.cwd(), "lib", "db", "migrations");
  if (fs.existsSync(migrationsFolder)) {
    migrate(db, { migrationsFolder });
  }

  return { sqlite, db };
}

export function getDb() {
  if (!globalForDb.db) {
    const { sqlite, db } = createConnection();
    globalForDb.sqlite = sqlite;
    globalForDb.db = db;
  }
  return globalForDb.db;
}
