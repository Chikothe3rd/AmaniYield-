"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = new pg_1.Client({
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
        const clientUrl = new pg_1.Client({
            connectionString: process.env.DATABASE_URL,
        });
        await clientUrl.connect();
        console.log('✅ Success: Connected to PostgreSQL database via DATABASE_URL string.');
        await clientUrl.end();
        process.exit(0);
    }
    catch (err) {
        console.error('❌ Error: Connection failed.');
        console.error('Details:', err.message);
        process.exit(1);
    }
}
testConnection();
