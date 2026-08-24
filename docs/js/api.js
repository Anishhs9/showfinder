const BASE_URL = 'https://api.tvmaze.com';

export async function fetchShows() {
  const response = await fetch(`${BASE_URL}/shows`);
  if (!response.ok) throw new Error('Failed to fetch shows');
  return response.json();
}

export async function searchShows(query) {
  const response = await fetch(`${BASE_URL}/search/shows?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Failed to search shows');
  return response.json();
}

export async function fetchShowDetails(id) {
  const response = await fetch(`${BASE_URL}/shows/${id}`);
  if (!response.ok) throw new Error('Failed to fetch show details');
  return response.json();
}

export async function fetchShowEpisodes(id) {
  const response = await fetch(`${BASE_URL}/shows/${id}/episodes`);
  if (!response.ok) throw new Error('Failed to fetch episodes');
  return response.json();
}

// Additional helpers for grouping shows etc.
export async function fetchShowsByPage(page = 0) {
  const response = await fetch(`${BASE_URL}/shows?page=${page}`);
  if (!response.ok) throw new Error('Failed to fetch page of shows');
  return response.json();
}
