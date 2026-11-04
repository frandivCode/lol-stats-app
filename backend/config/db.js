import pg from 'pg';
import dotenv from 'dotenv';

// Cargamos las variables del .env
dotenv.config();
const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

pool.on('connect', () => {
    console.log('Conexión a PostgreSQL establecida con éxito.');
});

export default pool;