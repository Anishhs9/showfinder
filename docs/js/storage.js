const FAVORITES_KEY = 'showfinder_favorites';
const RECENT_KEY = 'showfinder_recent';

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

export function addFavorite(show) {
  const favorites = getFavorites();
  if (!favorites.find(f => f.id === show.id)) {
    favorites.push({
      id: show.id,
      name: show.name,
      image: show.image,
      rating: show.rating,
      genres: show.genres,
      premiered: show.premiered
    });
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
}

export function removeFavorite(id) {
  let favorites = getFavorites();
  favorites = favorites.filter(f => f.id !== id);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function isFavorite(id) {
  return getFavorites().some(f => f.id === parseInt(id));
}

export function toggleFavorite(show) {
  if (isFavorite(show.id)) {
    removeFavorite(show.id);
    return false;
  } else {
    addFavorite(show);
    return true;
  }
}

export function getRecentlyViewed() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

export function addRecentlyViewed(show) {
  let recent = getRecentlyViewed();
  recent = recent.filter(r => r.id !== show.id);
  
  // Store a minimal representation
  recent.unshift({
    id: show.id,
    name: show.name,
    image: show.image,
    rating: show.rating
  });
  
  if (recent.length > 10) {
    recent.pop();
  }
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
}
