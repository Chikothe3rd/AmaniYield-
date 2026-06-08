import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function testConnection() {
  console.log('--- Database Connection Test ---');
  console.log(`Target: ${process.env.DB_USER}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
  
  try {
    await client.connect();
    console.log('✅ Success: Connected to PostgreSQL database via individual variables.');
    await client.end();

    console.log('\nTesting DATABASE_URL from .env...');
    const clientUrl = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    
    await clientUrl.connect();
    console.log('✅ Success: Connected to PostgreSQL database via DATABASE_URL string.');
    await clientUrl.end();

    process.exit(0);
  } catch (err) {
    console.error('❌ Error: Connection failed.');
    console.error('Details:', (err as Error).message);
    process.exit(1);
  }
}

testConnection();
