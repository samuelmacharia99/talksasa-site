import "server-only";
import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { getMysqlConfig } from "./config";
import * as schema from "./schema";

type Db = MySql2Database<typeof schema>;

const globalForDb = globalThis as unknown as {
  pool?: mysql.Pool;
  db?: Db;
  dbReady?: Promise<Db>;
};

async function createConnection(): Promise<Db> {
  const config = getMysqlConfig();
  const pool = mysql.createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 5,
    idleTimeout: 60_000,
    enableKeepAlive: true,
  });

  const db = drizzle(pool, { schema, mode: "default" });
  const migrationsFolder = path.join(process.cwd(), "lib", "db", "migrations");
  if (fs.existsSync(migrationsFolder)) {
    await migrate(db, { migrationsFolder });
  }

  globalForDb.pool = pool;
  globalForDb.db = db;
  return db;
}

export async function getDb(): Promise<Db> {
  if (globalForDb.db) return globalForDb.db;
  if (!globalForDb.dbReady) {
    globalForDb.dbReady = createConnection();
  }
  return globalForDb.dbReady;
}
