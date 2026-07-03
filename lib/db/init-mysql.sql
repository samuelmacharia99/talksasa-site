-- Run once on your MySQL server before deploying the app:
-- mysql -u root -p < lib/db/init-mysql.sql

CREATE DATABASE IF NOT EXISTS talksasa
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Create app user (adjust password):
-- CREATE USER IF NOT EXISTS 'talksasa'@'%' IDENTIFIED BY 'your_password';
-- GRANT ALL PRIVILEGES ON talksasa.* TO 'talksasa'@'%';
-- FLUSH PRIVILEGES;

-- The `leads` table is created automatically by Drizzle migrations on first app start.
