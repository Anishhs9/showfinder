import { getFavorites } from './storage.js';
import { createShowCard } from './components.js';

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('favorites-grid');
  const emptyState = document.getElementById('empty-state');

  const favorites = getFavorites();

  if (favorites.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    favorites.forEach(show => {
      grid.appendChild(createShowCard(show));
    });
  }
});
