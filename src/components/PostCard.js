import { renderAuthorshipBadge } from './AuthorshipBadge.js';

export function renderPostCard(post) {
  const date = new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  return `
    <a href="#/post/${post.slug}" class="post-card">
      <div class="card-img-wrapper">
        ${post.coverImage ? `
          <img
            src="${post.coverImage}"
            alt="Cover image for ${post.title}"
            class="card-img"
            loading="lazy"
          />
        ` : ''}
        <span class="card-badge">${post.category}</span>
      </div>

      <div class="card-content">
        <div class="card-date-meta">
          <i data-lucide="calendar" style="width: 12px; height: 12px;"></i>
          <span>${date}</span>
          <span style="opacity: 0.3">•</span>
          <i data-lucide="clock" style="width: 12px; height: 12px;"></i>
          <span>${post.readTime}</span>
          <span style="opacity: 0.3">•</span>
          ${renderAuthorshipBadge(post.writingType)}
        </div>

        <h2 class="card-title">${post.title}</h2>
        <p class="card-excerpt">${post.excerpt}</p>

        <div class="card-footer">
          <span class="card-link">
            Read More <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
          </span>
        </div>
      </div>
    </a>
  `;
}
