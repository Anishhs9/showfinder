import { fetchShows } from './api.js';
import { createShowCard, createSkeletonCards } from './components.js';

let allShows = [];
let currentGenre = 'All';
let currentSort = 'rating';

document.addEventListener('DOMContentLoaded', async () => {
  const resultsContainer = document.getElementById('browse-results');
  const resultsCount = document.getElementById('results-count');
  
  resultsContainer.appendChild(createSkeletonCards(12));

  try {
    allShows = await fetchShows();
    applyFiltersAndSort();
    setupEventListeners();
  } catch (error) {
    console.error('Failed to load browse shows:', error);
    resultsContainer.innerHTML = '<p>Error loading shows. Please try again.</p>';
  }
});

function setupEventListeners() {
  const chips = document.querySelectorAll('.chip');
  chips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      document.querySelector('.chip.active').classList.remove('active');
      e.target.classList.add('active');
      currentGenre = e.target.dataset.genre;
      applyFiltersAndSort();
    });
  });

  document.getElementById('sort-select').addEventListener('change', (e) => {
    currentSort = e.target.value;
    applyFiltersAndSort();
  });
}

function applyFiltersAndSort() {
  let filteredShows = [...allShows];

  if (currentGenre !== 'All') {
    filteredShows = filteredShows.filter(show => show.genres.includes(currentGenre));
  }

  filteredShows.sort((a, b) => {
    if (currentSort === 'rating') {
      return (b.rating?.average || 0) - (a.rating?.average || 0);
    } else if (currentSort === 'name') {
      return a.name.localeCompare(b.name);
    } else if (currentSort === 'latest') {
      const dateA = a.premiered ? new Date(a.premiered) : new Date(0);
      const dateB = b.premiered ? new Date(b.premiered) : new Date(0);
      return dateB - dateA;
    }
    return 0;
  });

  renderResults(filteredShows);
}

function renderResults(shows) {
  const resultsContainer = document.getElementById('browse-results');
  resultsContainer.innerHTML = '';
  
  document.getElementById('results-count').textContent = `${shows.length} shows found`;

  if (shows.length === 0) {
    resultsContainer.innerHTML = '<p>No shows found for this genre.</p>';
    return;
  }

  // To not overload the DOM, we can slice it for now
  shows.slice(0, 100).forEach(show => {
    resultsContainer.appendChild(createShowCard(show));
  });
}
