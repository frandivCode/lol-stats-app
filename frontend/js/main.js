import { initScrollAnimations } from './observer.js';

const API_URL = 'http://localhost:3000/api/partidas';
let todasLasPartidas = [];

async function inicializarApp() {
  try {
    const respuesta = await fetch(API_URL);
    const data = await respuesta.json();

    todasLasPartidas = [...data].reverse();

    renderizarDashboard(todasLasPartidas);
    cargarOpcionesFormulario();
  } catch (error) {
    console.error('Error:', error);
  }

  document.getElementById('searchInput').addEventListener('input', (e) => {
    const termino = e.target.value.toLowerCase();
    const partidasFiltradas = todasLasPartidas.filter(p =>
      p.Jugador.toLowerCase().includes(termino) ||
      p.Campeon.toLowerCase().includes(termino) ||
      p.Rol.toLowerCase().includes(termino) ||
      p.Clase.toLowerCase().includes(termino)
    );
    renderizarDashboard(partidasFiltradas);
  });
}

function renderizarDashboard(partidas) {
  const container = document.getElementById('match-container');
  const statsContainer = document.getElementById('stats-container');
  container.innerHTML = '';

  if (partidas.length === 0) {
    container.innerHTML = '<p>No se encontraron partidas.</p>';
    statsContainer.innerHTML = '<p>Sin datos.</p>';
    return;
  }

  let totalKills = 0, totalDeaths = 0, totalAssists = 0;

  partidas.forEach(partida => {
    const esVictoria = partida.Kills > partida.Deaths;
    const modificadorClase = esVictoria ? 'match-card--win' : 'match-card--loss';
    const textoResultado = esVictoria ? 'Victoria' : 'Derrota';

    totalKills += partida.Kills;
    totalDeaths += partida.Deaths;
    totalAssists += partida.Assists;

    const fechaCorta = new Date(partida.Fecha).toLocaleDateString('es-AR');
    const oroFormateado = (partida.Oro / 1000).toFixed(1) + 'k';

    const tarjetaHTML = `
      <article class="match-card ${modificadorClase}">
        <div class="match-card__content">
          
          <div class="match-card__info">
            <span class="match-card__result">${textoResultado}</span>
            <time class="match-card__date">${fechaCorta}</time>
            <div class="match-card__match-id">Partida #${partida["ID Match"]}</div>
          </div>
          
          <div class="match-card__champion">
            <span class="match-card__champ-name">${partida.Campeon}</span>
            <span class="match-card__role">${partida.Rol}</span>
          </div>
          
          <div class="match-card__kda">
            <div class="match-card__kda-label">KILLS / DEATHS / ASSISTS</div>
            <p class="match-card__kda-numbers">${partida.Kills} / ${partida.Deaths} / ${partida.Assists}</p>
            <small class="match-card__kda-player">${partida.Jugador}</small>
          </div>

          <div class="match-card__extra">
            <p>Oro: <strong>${oroFormateado}</strong></p>
            <p>Duración: <strong>${partida.Duracion} min</strong></p>
          </div>

        </div>
      </article>
    `;
    container.insertAdjacentHTML('beforeend', tarjetaHTML);
  });

  const promKills = (totalKills / partidas.length).toFixed(1);
  const promDeaths = (totalDeaths / partidas.length).toFixed(1);
  const promAssists = (totalAssists / partidas.length).toFixed(1);

  statsContainer.innerHTML = `
    <p style="margin-bottom: 1.5rem;">Partidas analizadas: <strong>${partidas.length}</strong></p>
    
    <div>
      <p style="color: var(--color-text-muted); font-size: 0.9rem; margin: 0 0 8px 0; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">KDA Promedio</p>
      <p style="font-size: 1.6rem; font-weight: 700; margin: 0;">
        <span style="color: #82a8f5">${promKills}</span> <span style="font-size: 1rem; color: var(--color-text-muted)">K</span> / 
        <span style="color: #e35959">${promDeaths}</span> <span style="font-size: 1rem; color: var(--color-text-muted)">D</span> / 
        <span>${promAssists}</span> <span style="font-size: 1rem; color: var(--color-text-muted)">A</span>
      </p>
    </div>
  `;

  initScrollAnimations();
}
const modal = document.getElementById('statModal');
const btnOpen = document.getElementById('btnOpenModal');
const btnClose = document.getElementById('btnCloseModal');
const form = document.getElementById('statForm');

btnOpen.addEventListener('click', () => modal.showModal());
btnClose.addEventListener('click', () => {
  modal.close();
  form.reset();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      modal.close();
      form.reset();
      inicializarApp();
      alert('Estadística guardada correctamente');
    } else {
      const errorData = await response.json();
      alert('Error: ' + errorData.error);
    }
  } catch (error) {
    console.error('Error en la petición POST:', error);
    alert('Error al conectar con el servidor.');
  }
});

async function cargarOpcionesFormulario() {
  try {
    const res = await fetch('http://localhost:3000/api/partidas/opciones');
    if (!res.ok) throw new Error('No se pudo conectar con la ruta de opciones');

    const opciones = await res.json();

    const selectJugador = document.getElementById('selectJugador');
    selectJugador.innerHTML = '<option value="" disabled selected>Seleccioná al Jugador</option>';
    opciones.jugadores.forEach(j => {
      selectJugador.innerHTML += `<option value="${j.id_jugador}">${j.nickname}</option>`;
    });

    const selectCampeon = document.getElementById('selectCampeon');
    selectCampeon.innerHTML = '<option value="" disabled selected>Seleccioná el Campeón</option>';
    opciones.campeones.forEach(c => {
      selectCampeon.innerHTML += `<option value="${c.id_campeon}">${c.nombre}</option>`;
    });

    const selectPartida = document.getElementById('selectPartida');
    selectPartida.innerHTML = '<option value="" disabled selected>Seleccioná la Partida</option>';
    opciones.partidas.forEach(p => {
      const fechaCorta = new Date(p.fecha).toLocaleDateString('es-AR');
      selectPartida.innerHTML += `<option value="${p.id_partida}">Partida #${p.id_partida} (${fechaCorta})</option>`;
    });

  } catch (error) {
    console.error('Error crítico cargando listas desplegables:', error);
  }
}

const modalNewMatch = document.getElementById('newMatchModal');
const formNewMatch = document.getElementById('newMatchForm');

document.getElementById('btnOpenNewMatch').addEventListener('click', () => modalNewMatch.showModal());
document.getElementById('btnCloseNewMatch').addEventListener('click', () => {
  modalNewMatch.close();
  formNewMatch.reset();
});

formNewMatch.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(formNewMatch);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('http://localhost:3000/api/partidas/nueva', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      modalNewMatch.close();
      formNewMatch.reset();

      await cargarOpcionesFormulario();
      alert('Partida creada correctamente. Ya podés cargarle estadísticas.');
    } else {
      const errorData = await response.json();
      alert('Error: ' + errorData.error);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al conectar con el servidor.');
  }
});

document.addEventListener('DOMContentLoaded', inicializarApp);
