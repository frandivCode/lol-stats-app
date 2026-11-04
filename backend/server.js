import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';
import matchRoutes from './routes/matchRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ success: true, timestamp: result.rows[0].now, message: "Backend y BD comunicados correctamente." });
    } catch (error) {
        console.error('Error conectando a la DB:', error);
        res.status(500).json({ success: false, error: 'Error interno de conexión' });
    }
});

app.use('/api/partidas', matchRoutes);

app.listen(port, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${port}`);
});