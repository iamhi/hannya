import { createIcons, icons } from 'lucide';
import { renderHome, initHome } from './pages/Home.js';
import { renderPostDetail, initPostDetail } from './pages/PostDetail.js';

let postsData = null;

// Fetch posts.json generated at build time
async function fetchPosts() {
  if (postsData) return postsData;
  try {
    const res = await fetch('/posts.json');
    postsData = await res.json();
    return postsData;
  } catch (error) {
    console.error('Failed to load posts', error);
    return [];
  }
}

function updateMetaTags(title, description) {
  document.title = title || 'OniBlog | Modern Tech & Minimalist Design';
  
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && description) {
    metaDesc.setAttribute('content', description);
  }
  
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle && title) {
    ogTitle.setAttribute('content', title);
  }
}

export async function initRouter(rootElement) {
  const posts = await fetchPosts();

  const render = () => {
    const hash = window.location.hash || '#/';
    
    if (hash.startsWith('#/post/')) {
      const slug = hash.replace('#/post/', '');
      const post = posts.find(p => p.slug === slug);
      
      if (post) {
        updateMetaTags(`${post.title} | OniBlog`, post.excerpt);
        rootElement.innerHTML = renderPostDetail(post);
        initPostDetail(post);
      } else {
        updateMetaTags('Post Not Found | OniBlog');
        rootElement.innerHTML = `
          <div class="post-detail-container">
            <button class="back-btn" onclick="window.location.hash = '#/'">
              <i data-lucide="arrow-left" style="width: 18px; height: 18px;"></i> Back to home
            </button>
            <div class="empty-state">
              <i data-lucide="inbox" style="width: 48px; height: 48px;"></i>
              <h3>Post not found</h3>
              <p>The blog post you are looking for does not exist or has been moved.</p>
            </div>
          </div>
        `;
      }
    } else {
      updateMetaTags('OniBlog | Modern Tech & Minimalist Design');
      rootElement.innerHTML = renderHome(posts);
      initHome(posts);
    }

    // Initialize Lucide icons
    createIcons({ icons });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  window.addEventListener('hashchange', render);
  render(); // Initial render
}
