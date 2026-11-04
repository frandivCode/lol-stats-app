# Div.GG - Estadísticas de League of Legends

Aplicación web Full-Stack desarrollada como proyecto universitario. Permite consultar el historial de partidas, filtrar estadísticas de jugadores y campeones en tiempo real mediante un buscador global, y registrar nuevos datos aplicando un diseño moderno inspirado en la temática oscura de **Noxus** (Dark UI).

---

## Tecnologías Utilizadas

- **Frontend:** HTML5 semántico, CSS3 (Metodología BEM, Variables CSS `:root`, CSS Nesting nativo), JavaScript Vanilla (ES6 Modules, Intersection Observer API).
- **Backend:** Node.js, Express.js, ES Modules, `dotenv`, `cors`.
- **Base de Datos:** PostgreSQL (Procedimientos almacenados, transacciones con `COMMIT`/`ROLLBACK`, vistas complejas e integridad referencial con claves foráneas).

---

## Requisitos Previos

Antes de iniciar el proyecto, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (Versión 18 o superior).
- [PostgreSQL](https://www.postgresql.org/) y **pgAdmin**.

---

## Instalación y Puesta en Marcha

### 1. Clonar el repositorio

```bash
git clone https://github.com/frandivCode/lol-stats-app.git
cd lol-stats-app
```

### 2. Configurar la Base de Datos

1. Abre **pgAdmin** y crea una base de datos llamada `League of Legends`.
2. Ejecuta el siguiente script SQL para crear las tablas, la vista y el procedimiento almacenado:

```sql
CREATE TABLE JUGADOR (
    id_jugador INTEGER PRIMARY KEY,
    nickname VARCHAR(50),
    nombre_real VARCHAR(100),
    rol_preferencia VARCHAR(20)
);

CREATE TABLE CAMPEON (
    id_campeon INTEGER PRIMARY KEY,
    nombre VARCHAR(50),
    clase_principal VARCHAR(50),
    tipo_dano VARCHAR(20)
);

CREATE TABLE PARTIDA (
    id_partida INTEGER PRIMARY KEY,
    fecha DATE,
    duracion_minutos INTEGER,
    parche VARCHAR(10),
    equipo_ganador VARCHAR(10)
);

CREATE TABLE ESTADISTICA_PARTIDA (
    id_jugador INTEGER,
    id_partida INTEGER,
    id_campeon INTEGER,
    oro_total INTEGER,
    asesinatos INTEGER,
    muertes INTEGER,
    asistencias INTEGER,
    PRIMARY KEY (id_jugador, id_partida),
    FOREIGN KEY (id_jugador) REFERENCES JUGADOR(id_jugador),
    FOREIGN KEY (id_partida) REFERENCES PARTIDA(id_partida),
    FOREIGN KEY (id_campeon) REFERENCES CAMPEON(id_campeon)
);

INSERT INTO JUGADOR (id_jugador, nickname, nombre_real, rol_preferencia) VALUES
(1, 'Faker', 'Lee Sang-hyeok', 'Mid'), (2, 'Zeus', 'Choi Woo-je', 'Top'),
(3, 'ShowMaker', 'Heo Su', 'Mid'), (4, 'Chovy', 'Jeong Ji-hoon', 'Mid'),
(5, 'Caps', 'Rasmus Winther', 'Mid'), (6, 'Ruler', 'Park Jae-hyuk', 'ADC'),
(7, 'Keria', 'Ryu Min-seok', 'Support'), (8, 'Bin', 'Chen Ze-Bin', 'Top'),
(9, 'Canyon', 'Kim Geon-bu', 'Jungla'), (10, 'Peanut', 'Han Wang-ho', 'Jungla'),
(11, 'Fran', 'Francisco Zapata', 'Jungla'), (12, 'Mati', 'Matias', 'ADC'),
(13, 'Oner', 'Moon Hyeon-joon', 'Jungla'), (14, 'Gumayusi', 'Lee Min-hyeong', 'ADC'),
(15, 'Beryl', 'Cho Geon-hee', 'Support');

INSERT INTO CAMPEON (id_campeon, nombre, clase_principal, tipo_dano) VALUES
(1, 'Ahri', 'Mago', 'Magico'), (2, 'Jayce', 'Luchador', 'Fisico'),
(3, 'Lee Sin', 'Luchador', 'Fisico'), (4, 'Syndra', 'Mago', 'Magico'),
(5, 'Jinx', 'Tirador', 'Fisico'), (6, 'Nautilus', 'Tanque', 'Magico'),
(7, 'Aatrox', 'Luchador', 'Fisico'), (8, 'Orianna', 'Mago', 'Magico'),
(9, 'Lucian', 'Tirador', 'Fisico'), (10, 'Nami', 'Soporte', 'Magico'),
(11, 'Garen', 'Luchador', 'Fisico'), (12, 'Ashe', 'Tirador', 'Fisico'),
(13, 'Thresh', 'Soporte', 'Magico'), (14, 'Yasuo', 'Luchador', 'Fisico'),
(15, 'Zed', 'Asesino', 'Fisico');

INSERT INTO PARTIDA (id_partida, fecha, duracion_minutos, parche, equipo_ganador) VALUES
(1001, '2026-10-20', 35, '14.20', 'Rojo'), (1002, '2026-10-21', 42, '14.20', 'Azul'),
(1003, '2026-10-22', 25, '14.20', 'Rojo'), (1004, '2026-10-23', 30, '14.20', 'Azul'),
(1005, '2026-10-24', 50, '14.20', 'Rojo'), (1006, '2026-10-25', 28, '14.20', 'Azul'),
(1007, '2026-10-26', 33, '14.20', 'Rojo'), (1008, '2026-10-26', 40, '14.20', 'Azul'),
(1009, '2026-10-27', 22, '14.21', 'Rojo'), (1010, '2026-10-27', 38, '14.21', 'Azul'),
(1011, '2026-10-28', 45, '14.21', 'Rojo'), (1012, '2026-10-28', 31, '14.21', 'Azul'),
(1013, '2026-10-29', 27, '14.21', 'Rojo'), (1014, '2026-10-29', 36, '14.21', 'Azul'),
(1015, '2026-10-29', 29, '14.21', 'Rojo');

INSERT INTO ESTADISTICA_PARTIDA (id_jugador, id_partida, id_campeon, oro_total, asesinatos, muertes, asistencias) VALUES
(1, 1001, 1, 15000, 10, 2, 8), (3, 1001, 4, 16000, 8, 1, 5),
(9, 1001, 3, 14200, 6, 4, 12), (4, 1002, 8, 18500, 11, 2, 8),
(6, 1002, 5, 21000, 15, 3, 7), (7, 1002, 6, 8000, 1, 5, 20),
(11, 1003, 11, 12000, 5, 2, 10), (12, 1003, 12, 17500, 12, 1, 6),
(2, 1004, 7, 14000, 7, 3, 4), (5, 1004, 15, 19000, 14, 4, 3),
(8, 1005, 2, 22000, 9, 6, 11), (10, 1005, 3, 13500, 4, 5, 15),
(13, 1006, 3, 15500, 8, 2, 9), (14, 1006, 9, 18000, 10, 1, 5),
(15, 1006, 13, 9000, 2, 4, 18);

CREATE OR REPLACE PROCEDURE registrar_estadistica_segura(
    p_id_jugador INTEGER, p_id_partida INTEGER, p_id_campeon INTEGER,
    p_oro INTEGER, p_asesinatos INTEGER, p_muertes INTEGER, p_asistencias INTEGER
)
LANGUAGE plpgsql AS $$ BEGIN IF EXISTS (SELECT 1 FROM ESTADISTICA_PARTIDA WHERE id_jugador = p_id_jugador AND id_partida = p_id_partida) THEN ROLLBACK; RAISE NOTICE 'Transacción cancelada con ROLLBACK: El jugador \% ya tiene datos cargados en la partida \%.', p_id_jugador, p_id_partida; ELSE INSERT INTO ESTADISTICA_PARTIDA (id_jugador, id_partida, id_campeon, oro_total, asesinatos, muertes, asistencias) VALUES (p_id_jugador, p_id_partida, p_id_campeon, p_oro, p_asesinatos, p_muertes, p_asistencias);  COMMIT; RAISE NOTICE 'La estadística de partida se guardó correctamente.'; END IF; END; $$;

CREATE OR REPLACE VIEW vista_resumen_partidas AS
SELECT
    p.id_partida AS "ID Match",
    p.duracion_minutos AS "Duracion",
    j.nickname AS "Jugador",
    j.rol_preferencia AS "Rol",
    c.nombre AS "Campeon",
    c.clase_principal AS "Clase",
    p.fecha AS "Fecha",
    p.equipo_ganador AS "Ganador",
    e.asesinatos AS "Kills",
    e.muertes AS "Deaths",
    e.asistencias AS "Assists",
    e.oro_total AS "Oro"
FROM ESTADISTICA_PARTIDA e
INNER JOIN JUGADOR j ON e.id_jugador = j.id_jugador
INNER JOIN CAMPEON c ON e.id_campeon = c.id_campeon
INNER JOIN PARTIDA p ON e.id_partida = p.id_partida;
```

### 3. Configurar las Variables de Entorno

Crea un archivo llamado `.env` en la raíz del proyecto con tus credenciales de PostgreSQL:

```env
DB_USER=postgres
DB_PASSWORD=tu_contraseña_real
DB_HOST=localhost
DB_PORT=5432
DB_NAME="League of Legends"
PORT=3000
```

### 4. Instalar las dependencias

Ejecuta en la terminal:

```bash
npm install
```

### 5. Iniciar el servidor backend

```bash
npm run dev
```

### 6. Ejecutar el Frontend

Abre la carpeta `frontend` y utiliza la extensión **Live Server** de VS Code para abrir el archivo `index.html`.

---

## 📋 Funcionalidades Principales

- **Buscador Global en Tiempo Real:** Filtra por nombre de invocador, campeón, rol o clase, actualizando el KDA promedio.
- **Gestión Segura de Datos (POST):** Permite registrar estadísticas mediante procedimientos almacenados con control de transacciones (`COMMIT`/`ROLLBACK`).
- **Validación y UX:** Modales interactivos con selectores dinámicos conectados a la base de datos.
