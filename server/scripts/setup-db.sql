-- Create the database if it doesn't exist
CREATE DATABASE wonderfood;

-- Connect to the database
\c wonderfood;

-- Create the schema
CREATE SCHEMA IF NOT EXISTS public;

-- Grant all privileges to the admin user
GRANT ALL PRIVILEGES ON DATABASE wonderfood TO admin;
GRANT ALL PRIVILEGES ON SCHEMA public TO admin; 