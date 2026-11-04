import pool from '../config/db.js';

export const getMatchHistory = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM vista_resumen_partidas');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al traer el historial:', error);
        res.status(500).json({ error: 'Error del servidor al obtener las partidas' });
    }
};

export const getFormOptions = async (req, res) => {
    try {
        const jugadores = await pool.query('SELECT id_jugador, nickname FROM JUGADOR ORDER BY nickname ASC');
        const campeones = await pool.query('SELECT id_campeon, nombre FROM CAMPEON ORDER BY nombre ASC');
        const partidas = await pool.query('SELECT id_partida, fecha FROM PARTIDA ORDER BY id_partida DESC');

        res.json({
            jugadores: jugadores.rows,
            campeones: campeones.rows,
            partidas: partidas.rows
        });
    } catch (error) {
        console.error('Error cargando opciones:', error);
        res.status(500).json({ error: 'Error al obtener opciones' });
    }
};

export const createMatchStat = async (req, res) => {
    const { id_jugador, id_partida, id_campeon, asesinatos, muertes, asistencias, oro_total } = req.body;

    try {
        const jug = Number(id_jugador);
        const part = Number(id_partida);
        const camp = Number(id_campeon);
        const oro = Number(oro_total);
        const ases = Number(asesinatos);
        const muer = Number(muertes);
        const asis = Number(asistencias);

        const queryString = `CALL registrar_estadistica_segura(${jug}, ${part}, ${camp}, ${oro}, ${ases}, ${muer}, ${asis})`;

        await pool.query(queryString);

        res.status(201).json({ message: 'Estadística registrada con éxito' });
    } catch (error) {
        console.error('Error al registrar:', error);
        res.status(500).json({ error: error.message || '¡Error al guardar en la base de datos!' });
    }
};

export const createNewMatch = async (req, res) => {
    const { id_partida, fecha, duracion_minutos, parche, equipo_ganador } = req.body;

    try {
        const query = `
      INSERT INTO PARTIDA (id_partida, fecha, duracion_minutos, parche, equipo_ganador) 
      VALUES ($1, $2, $3, $4, $5)
    `;
        await pool.query(query, [id_partida, fecha, duracion_minutos, parche, equipo_ganador]);

        res.status(201).json({ message: 'Partida base creada con éxito' });
    } catch (error) {
        console.error('Error al crear la partida:', error);
        res.status(500).json({ error: 'Error al insertar en la tabla PARTIDA. Verificá que el ID no exista.' });
    }
};