import pg from 'pg';
import dotenv from 'dotenv'
dotenv.config()

const { Pool } = pg;

const connectionString = process.env.BASE_URL;

export const db = new Pool({
  allowExitOnIdle: true,
  connectionString,
});

const connectToDatabase = async () => {
  try {
    await db.query('SELECT NOW()');
    console.log('DATABASE CONNECTED');
  } catch (error) {
    console.log('Database connection error:', error);
  }
};

connectToDatabase();
