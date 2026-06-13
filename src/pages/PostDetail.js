import { renderHeader, initHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { renderAuthorshipBadge } from '../components/AuthorshipBadge.js';

export function renderPostDetail(post) {
  const date = new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return `
    <div id="scroll-progress" style="
      position: fixed;
      top: 0;
      left: 0;
      height: 4px;
      background-color: var(--primary);
      width: 0%;
      z-index: 1000;
      transition: width 0.1s ease-out;
    "></div>

    ${renderHeader()}

    <article class="post-detail-container">
      <button class="back-btn" onclick="window.location.hash = '#/'">
        <i data-lucide="arrow-left" style="width: 18px; height: 18px;"></i> Back to home
      </button>

      <header class="post-header">
        <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem; align-items: center">
          <span class="post-category-meta" style="margin-bottom: 0">${post.category}</span>
          ${renderAuthorshipBadge(post.writingType, 12)}
        </div>
        <h1 class="post-detail-title">${post.title}</h1>

        <div class="post-meta-row">
          <div class="meta-item">
            <i data-lucide="calendar" style="width: 16px; height: 16px;"></i>
            <span>${date}</span>
          </div>
          <div class="meta-item">
            <i data-lucide="clock" style="width: 16px; height: 16px;"></i>
            <span>${post.readTime}</span>
          </div>
        </div>
      </header>

      ${post.coverImage ? `
        <img
          src="${post.coverImage}"
          alt="Cover image for ${post.title}"
          class="post-featured-image"
        />
      ` : ''}

      <div class="post-body">
        ${post.htmlContent}
      </div>

      ${post.tags.length > 0 ? `
        <div class="post-tags-container">
          ${post.tags.map(tag => `<span class="tag-badge">#${tag}</span>`).join('')}
        </div>
      ` : ''}
    </article>

    ${renderFooter()}
  `;
}

export function initPostDetail(post) {
  initHeader();

  const progressBar = document.getElementById('scroll-progress');
  
  const handleScroll = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }
    }
  };

  window.addEventListener('scroll', handleScroll);
  
  // Clean up listener when navigating away
  const cleanUp = () => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('hashchange', cleanUp);
  };
  window.addEventListener('hashchange', cleanUp);
}
