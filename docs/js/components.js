export function createShowCard(show, linkToDetails = true) {
  const card = document.createElement(linkToDetails ? 'a' : 'div');
  if (linkToDetails) {
    card.href = `details.html?id=${show.id}`;
  }
  card.className = 'show-card';
  card.dataset.id = show.id;

  const imageUrl = show.image?.medium || show.image?.original || '';
  
  const rating = show.rating?.average ? show.rating.average.toFixed(1) : 'NR';

  card.innerHTML = `
    <div class="show-poster-container">
      ${imageUrl ? `<img src="${imageUrl}" alt="${show.name} poster" class="show-poster" loading="lazy">` : `<div class="show-poster" style="display:flex;align-items:center;justify-content:center;color:var(--text-tertiary);text-align:center;padding:1rem;">No Image</div>`}
      <div class="show-overlay">
        <span class="btn btn-secondary">View Details</span>
      </div>
    </div>
    <div class="show-info">
      <h3 class="show-title" title="${show.name}">${show.name}</h3>
      <div class="show-meta">
        <span class="rating">★ ${rating}</span>
        ${show.premiered ? `<span>${show.premiered.substring(0, 4)}</span>` : ''}
      </div>
    </div>
  `;

  return card;
}

export function createSkeletonCards(count = 6) {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'show-card';
    el.innerHTML = `
      <div class="skeleton skeleton-card"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text short"></div>
    `;
    fragment.appendChild(el);
  }
  return fragment;
}

export function buildNavbar() {
  const currentPath = window.location.pathname;
  
  const navbarHTML = `
    <nav class="navbar">
      <a href="index.html" class="nav-brand">ShowFinder</a>
      <div class="nav-links">
        <a href="index.html" class="nav-link ${currentPath.endsWith('index.html') || currentPath === '/' ? 'active' : ''}">Home</a>
        <a href="browse.html" class="nav-link ${currentPath.endsWith('browse.html') ? 'active' : ''}">Browse</a>
        <a href="search.html" class="nav-link ${currentPath.endsWith('search.html') ? 'active' : ''}">Search</a>
        <a href="favorites.html" class="nav-link ${currentPath.endsWith('favorites.html') ? 'active' : ''}">Favorites</a>
      </div>
      <button class="mobile-menu-btn" aria-label="Toggle menu">☰</button>
    </nav>
    <div class="mobile-nav">
        <a href="index.html" class="nav-link">Home</a>
        <a href="browse.html" class="nav-link">Browse</a>
        <a href="search.html" class="nav-link">Search</a>
        <a href="favorites.html" class="nav-link">Favorites</a>
    </div>
  `;
  document.body.insertAdjacentHTML('afterbegin', navbarHTML);

  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  if (mobileBtn && mobileNav) {
    mobileBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
    });
  }
}
