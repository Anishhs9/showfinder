import { fetchShows } from './api.js';
import { createShowCard, createSkeletonCards } from './components.js';
import { getRecentlyViewed, isFavorite, toggleFavorite } from './storage.js';

document.addEventListener('DOMContentLoaded', initHome);

async function initHome() {
  const heroContainer = document.getElementById('hero-container');
  const popularShelf = document.getElementById('popular-shelf');
  const dramaShelf = document.getElementById('drama-shelf');
  const comedyShelf = document.getElementById('comedy-shelf');
  const recentSection = document.getElementById('recent-section');
  const recentShelf = document.getElementById('recent-shelf');

  // Load skeletons
  popularShelf.appendChild(createSkeletonCards(6));
  dramaShelf.appendChild(createSkeletonCards(6));
  comedyShelf.appendChild(createSkeletonCards(6));

  try {
    const shows = await fetchShows(); // fetches first 250 shows
    
    // Pick a highly rated show for hero
    const topShows = shows.filter(s => s.rating?.average >= 8.5 && s.image?.original);
    const heroShow = topShows[Math.floor(Math.random() * Math.min(topShows.length, 10))];
    
    renderHero(heroShow, heroContainer);

    // Populate shelves
    const sortedByRating = [...shows].sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
    
    renderShelf(popularShelf, sortedByRating.slice(0, 15));
    renderShelf(dramaShelf, shows.filter(s => s.genres.includes('Drama')).slice(0, 15));
    renderShelf(comedyShelf, shows.filter(s => s.genres.includes('Comedy')).slice(0, 15));

    // Recently Viewed
    const recent = getRecentlyViewed();
    if (recent.length > 0) {
      recentSection.style.display = 'block';
      renderShelf(recentShelf, recent);
    }

  } catch (error) {
    console.error('Error loading home page data:', error);
    heroContainer.innerHTML = '<div class="container" style="padding-top: 100px; text-align: center;"><h2>Failed to load data. Please try again later.</h2></div>';
  }
}

function renderHero(show, container) {
  if (!show) return;

  const rating = show.rating?.average ? show.rating.average.toFixed(1) : 'NR';
  const year = show.premiered ? show.premiered.substring(0, 4) : '';
  const genres = show.genres?.join(', ') || '';
  const isFav = isFavorite(show.id);

  // Strip HTML from summary for hero
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = show.summary || '';
  const summaryText = tempDiv.textContent || tempDiv.innerText || '';

  container.innerHTML = `
    <div class="hero">
      <div class="hero-bg">
        <img src="${show.image?.original || show.image?.medium || ''}" alt="${show.name}">
        <div class="hero-gradient"></div>
      </div>
      <div class="container hero-content">
        <h1 class="hero-title">${show.name}</h1>
        <div class="hero-meta">
          <span class="rating">★ ${rating}</span>
          ${year ? `<span>${year}</span>` : ''}
          ${genres ? `<span>${genres}</span>` : ''}
        </div>
        <p class="hero-desc">${summaryText}</p>
        <div class="hero-actions">
          <a href="details.html?id=${show.id}" class="btn btn-primary">View Details</a>
          <button class="btn btn-secondary" id="hero-fav-btn" data-id="${show.id}">
            ${isFav ? '− Remove Favorite' : '+ Add Favorite'}
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('hero-fav-btn').addEventListener('click', (e) => {
    const added = toggleFavorite(show);
    e.target.textContent = added ? '− Remove Favorite' : '+ Add Favorite';
  });
}

function renderShelf(shelfElement, shows) {
  shelfElement.innerHTML = '';
  shows.forEach(show => {
    shelfElement.appendChild(createShowCard(show));
  });
}
