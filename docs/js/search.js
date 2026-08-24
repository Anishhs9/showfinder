import { searchShows } from './api.js';
import { createShowCard, createSkeletonCards } from './components.js';

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const resultsContainer = document.getElementById('search-results');
  const stateMessage = document.getElementById('search-state');

  let debounceTimeout;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    
    clearTimeout(debounceTimeout);
    
    if (!query) {
      resultsContainer.innerHTML = '';
      stateMessage.classList.add('hidden');
      return;
    }

    // Show loading
    resultsContainer.innerHTML = '';
    resultsContainer.appendChild(createSkeletonCards(8));
    stateMessage.classList.add('hidden');

    debounceTimeout = setTimeout(async () => {
      try {
        const results = await searchShows(query);
        renderResults(results);
      } catch (error) {
        console.error('Search error:', error);
        resultsContainer.innerHTML = '';
        showMessage('An error occurred while searching. Please try again.');
      }
    }, 400); // 400ms debounce
  });

  function renderResults(results) {
    resultsContainer.innerHTML = '';
    
    if (results.length === 0) {
      showMessage('No results found. Try a different search term.');
      return;
    }

    results.forEach(result => {
      if (result.show) {
        resultsContainer.appendChild(createShowCard(result.show));
      }
    });
  }

  function showMessage(msg) {
    stateMessage.textContent = msg;
    stateMessage.classList.remove('hidden');
  }
});
