import { renderHeader, initHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { renderPostCard } from '../components/PostCard.js';

export function renderHome(posts) {
  const categories = ['All', ...new Set(posts.map(p => p.category))];

  return `
    ${renderHeader()}
    <main style="flex-grow: 1">
      <section class="hero">
        <h1 style="margin-bottom: 1.5rem">Welcome to my AI slop blog! 👋</h1>
        <div style="display: flex; justify-content: center; align-items: center; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 2rem">
          <span style="font-size: 0.9rem; font-weight: 500; color: var(--text-muted); margin-right: 0.2rem">
            Stuff I like:
          </span>
          <span class="tag-badge">☕ Java</span>
          <span class="tag-badge">⚛️ Vanilla JS</span>
          <span class="tag-badge">☸️ Kubernetes</span>
          <span class="tag-badge">🐳 Docker</span>
          <span class="tag-badge">🟢 Node.js</span>
          <span class="tag-badge">🐹 Golang</span>
          <span class="tag-badge">🛸 FPV Drones</span>
          <span class="tag-badge">🎮 Switch 2 & PC</span>
          <span class="tag-badge">🕹️ Retro Gaming</span>
        </div>

        <div class="search-container">
          <input
            id="search-input"
            type="text"
            placeholder="Search posts or tags..."
            class="search-input"
          />
          <i data-lucide="search" class="search-icon" style="width: 18px; height: 18px;"></i>
        </div>
      </section>

      <section class="blog-section">
        <div class="filter-tabs" id="filter-tabs">
          ${categories.map(cat => `
            <button class="tab-btn ${cat === 'All' ? 'active' : ''}" data-category="${cat}">
              ${cat}
            </button>
          `).join('')}
        </div>

        <div class="blog-grid" id="blog-grid">
          ${renderGrid(posts)}
        </div>
      </section>
    </main>
    ${renderFooter()}
  `;
}

function renderGrid(posts) {
  if (posts.length === 0) {
    return `
      <div class="empty-state">
        <i data-lucide="inbox" style="width: 48px; height: 48px;"></i>
        <h3>No articles found</h3>
        <p>We couldn't find any articles matching your search or category filter. Try clearing filters or typing a different query.</p>
        <button id="clear-filters" class="glow-btn" style="margin-top: 1.5rem; padding: 0.6rem 1.2rem; font-size: 0.9rem">
          Clear Filters
        </button>
      </div>
    `;
  }
  return posts.map(post => renderPostCard(post)).join('');
}

export function initHome(allPosts) {
  initHeader();

  const searchInput = document.getElementById('search-input');
  const filterTabs = document.getElementById('filter-tabs');
  const blogGrid = document.getElementById('blog-grid');

  let searchQuery = '';
  let selectedCategory = 'All';

  const updateGrid = () => {
    const filtered = allPosts.filter(post => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    blogGrid.innerHTML = renderGrid(filtered);

    // Re-initialize icons inside the new grid
    import('lucide').then(({ createIcons, icons }) => {
      createIcons({ icons, root: blogGrid });
    });

    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        selectedCategory = 'All';
        
        // Update tab styles
        Array.from(filterTabs.children).forEach(btn => {
          btn.classList.toggle('active', btn.dataset.category === 'All');
        });

        updateGrid();
      });
    }
  };

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      updateGrid();
    });
  }

  if (filterTabs) {
    filterTabs.addEventListener('click', (e) => {
      if (e.target.classList.contains('tab-btn')) {
        selectedCategory = e.target.dataset.category;
        
        // Update tab styles
        Array.from(filterTabs.children).forEach(btn => {
          btn.classList.remove('active');
        });
        e.target.classList.add('active');

        updateGrid();
      }
    });
  }
}
