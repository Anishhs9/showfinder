import { fetchShowDetails, fetchShowEpisodes } from './api.js';
import { isFavorite, toggleFavorite, addRecentlyViewed } from './storage.js';

document.addEventListener('DOMContentLoaded', initDetails);

async function initDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const showId = urlParams.get('id');

  if (!showId) {
    document.getElementById('details-container').innerHTML = '<div class="container" style="padding: 100px 0;"><h2>Show not found.</h2></div>';
    return;
  }

  try {
    const [show, episodes] = await Promise.all([
      fetchShowDetails(showId),
      fetchShowEpisodes(showId)
    ]);

    // Save to recently viewed
    addRecentlyViewed(show);

    renderDetails(show);
    renderEpisodes(episodes);

  } catch (error) {
    console.error('Error fetching details:', error);
    document.getElementById('details-container').innerHTML = '<div class="container" style="padding: 100px 0;"><h2>Error loading show details.</h2></div>';
  }
}

function renderDetails(show) {
  const container = document.getElementById('details-container');
  const rating = show.rating?.average ? show.rating.average.toFixed(1) : 'NR';
  const year = show.premiered ? show.premiered.substring(0, 4) : '';
  const network = show.network?.name || show.webChannel?.name || 'Unknown Network';
  const isFav = isFavorite(show.id);

  const bgImage = show.image?.original || show.image?.medium || '';
  const posterImage = show.image?.medium || show.image?.original || '';

  const tags = show.genres.map(g => `<span class="tag">${g}</span>`).join('');

  container.innerHTML = `
    <div class="details-hero">
      <div class="details-bg">
        ${bgImage ? `<img src="${bgImage}" alt="">` : ''}
        <div class="details-gradient"></div>
      </div>
      <div class="container details-content">
        <div class="details-poster">
          ${posterImage ? `<img src="${posterImage}" alt="${show.name}">` : '<div style="width:100%; aspect-ratio:2/3; background:#222; border-radius:16px;"></div>'}
        </div>
        <div class="details-info">
          <h1 class="details-title">${show.name}</h1>
          <div class="details-meta">
            <span class="rating">★ ${rating}</span>
            <span>${year}</span>
            <span>${show.averageRuntime || show.runtime || '?'} min</span>
            <span>${show.status}</span>
          </div>
          <div class="details-tags">
            ${tags}
          </div>
          <div class="details-summary">
            ${show.summary || 'No summary available.'}
          </div>
          <div>
            <button class="btn btn-primary" id="details-fav-btn" data-id="${show.id}">
              ${isFav ? '− Remove from Favorites' : '+ Add to Favorites'}
            </button>
          </div>
          
          <div class="extra-info">
            <div class="info-group">
              <h4>Network</h4>
              <p>${network}</p>
            </div>
            <div class="info-group">
              <h4>Language</h4>
              <p>${show.language || 'Unknown'}</p>
            </div>
            <div class="info-group">
              <h4>Type</h4>
              <p>${show.type || 'Unknown'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('details-fav-btn').addEventListener('click', (e) => {
    const added = toggleFavorite(show);
    e.target.textContent = added ? '− Remove from Favorites' : '+ Add to Favorites';
  });
}

function renderEpisodes(episodes) {
  if (!episodes || episodes.length === 0) return;

  const section = document.getElementById('episodes-section');
  const container = document.getElementById('episodes-container');
  section.style.display = 'block';

  // Group by season
  const seasons = {};
  episodes.forEach(ep => {
    if (!seasons[ep.season]) seasons[ep.season] = [];
    seasons[ep.season].push(ep);
  });

  Object.keys(seasons).forEach(seasonNum => {
    const seasonEps = seasons[seasonNum];
    
    const seasonDiv = document.createElement('div');
    seasonDiv.className = 'season-group';
    
    // Header
    const header = document.createElement('div');
    header.className = 'season-header';
    header.innerHTML = `<span>Season ${seasonNum}</span> <span style="font-size: 0.9rem; color: var(--text-tertiary);">${seasonEps.length} Episodes ▾</span>`;
    
    // Episodes list
    const epsList = document.createElement('div');
    epsList.className = 'season-episodes';
    
    seasonEps.forEach(ep => {
      const epDate = ep.airdate ? new Date(ep.airdate).toLocaleDateString() : 'Unknown';
      const row = document.createElement('div');
      row.className = 'episode-row';
      row.innerHTML = `
        <div class="episode-num">S${String(ep.season).padStart(2, '0')}E${String(ep.number).padStart(2, '0')}</div>
        <div class="episode-name">${ep.name}</div>
        <div class="episode-meta">
          <span>${epDate}</span>
          <span>${ep.runtime ? ep.runtime + ' min' : ''}</span>
        </div>
      `;
      epsList.appendChild(row);
    });
    
    header.addEventListener('click', () => {
      epsList.classList.toggle('active');
      const icon = header.querySelector('span:last-child');
      if (epsList.classList.contains('active')) {
        icon.innerHTML = `${seasonEps.length} Episodes ▴`;
      } else {
        icon.innerHTML = `${seasonEps.length} Episodes ▾`;
      }
    });

    seasonDiv.appendChild(header);
    seasonDiv.appendChild(epsList);
    container.appendChild(seasonDiv);
  });
}
