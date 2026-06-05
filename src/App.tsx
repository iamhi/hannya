import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Clock, 
  Calendar, 
  ArrowLeft, 
  Sun, 
  Moon, 
  ArrowRight,
  Sparkles,
  Inbox,
  Rss
} from 'lucide-react';
import { marked } from 'marked';
import { getAllPosts, getPostBySlug, getCategories } from './utils/blogLoader';
import type { BlogPost } from './utils/blogLoader';

function App() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Navigation state (using Hash routing for 100% static hosting compatibility)
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Check local storage or system preference
    if (localStorage.getItem('theme') === 'dark') return 'dark';
    if (localStorage.getItem('theme') === 'light') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Reading progress state for post detail page
  const [scrollProgress, setScrollProgress] = useState(0);

  // Load posts and categories on mount
  useEffect(() => {
    setPosts(getAllPosts());
    setCategories(getCategories());
  }, []);

  // Sync theme with DOM
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Handle Hash Routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/post/')) {
        const slug = hash.replace('#/post/', '');
        setCurrentSlug(slug);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentSlug(null);
      }
    };

    // Check hash on load
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Track scroll reading progress
  useEffect(() => {
    if (!currentSlug) {
      setScrollProgress(0);
      return;
    }

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSlug]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Render detail view
  if (currentSlug) {
    const post = getPostBySlug(currentSlug);
    
    if (!post) {
      return (
        <div className="post-detail-container">
          <button className="back-btn" onClick={() => window.location.hash = '#/'}>
            <ArrowLeft size={18} /> Back to home
          </button>
          <div className="empty-state">
            <Inbox size={48} />
            <h3>Post not found</h3>
            <p>The blog post you are looking for does not exist or has been moved.</p>
          </div>
        </div>
      );
    }

    const htmlContent = marked.parse(post.content) as string;

    return (
      <>
        {/* Reading Progress Indicator */}
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            height: '4px', 
            backgroundColor: 'var(--primary)', 
            width: `${scrollProgress}%`, 
            zIndex: 1000, 
            transition: 'width 0.1s ease-out' 
          }} 
        />

        {/* Detail Header / Nav */}
        <header className="nav-header glass-effect">
          <div className="nav-container">
            <a className="logo" onClick={() => window.location.hash = '#/'}>
              <span className="logo-icon">
                <BookOpen size={20} />
              </span>
              <span>Oni<span style={{ color: 'var(--primary)' }}>Blog</span></span>
            </a>
            
            <div className="nav-actions">
              <button 
                onClick={toggleTheme} 
                className="theme-toggle" 
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
              
              <a 
                href="rss.xml" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="theme-toggle" 
                aria-label="RSS Feed"
                style={{ textDecoration: 'none' }}
              >
                <Rss size={18} />
              </a>
              
              <a href="#/" className="glow-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                Home
              </a>
            </div>
          </div>
        </header>

        <article className="post-detail-container">
          <button className="back-btn" onClick={() => window.location.hash = '#/'}>
            <ArrowLeft size={18} /> Back to home
          </button>
          
          <header className="post-header">
            <span className="post-category-meta">{post.category}</span>
            <h1 className="post-detail-title">{post.title}</h1>
            
            <div className="post-meta-row">
              <div className="meta-item">
                <div className="author-avatar">{post.author.charAt(0)}</div>
                <span className="meta-author">{post.author}</span>
              </div>
              <div className="meta-item">
                <Calendar size={16} />
                <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="meta-item">
                <Clock size={16} />
                <span>{post.readTime}</span>
              </div>
            </div>
          </header>

          {post.coverImage && (
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="post-featured-image" 
            />
          )}

          <div 
            className="post-body" 
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
          />

          {post.tags.length > 0 && (
            <div className="post-tags-container">
              {post.tags.map(tag => (
                <span key={tag} className="tag-badge">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>

        <footer className="app-footer">
          <div className="footer-content">
            <p className="footer-text">© {new Date().getFullYear()} OniBlog. Powered by Vite + React + Markdown.</p>
          </div>
        </footer>
      </>
    );
  }

  // Render home list view
  return (
    <>
      <header className="nav-header glass-effect">
        <div className="nav-container">
          <a className="logo" onClick={() => window.location.hash = '#/'}>
            <span className="logo-icon">
              <BookOpen size={20} />
            </span>
            <span>Oni<span style={{ color: 'var(--primary)' }}>Blog</span></span>
          </a>
          
          <div className="nav-actions">
            <button 
              onClick={toggleTheme} 
              className="theme-toggle" 
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            
            <a 
              href="rss.xml" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="theme-toggle" 
              aria-label="RSS Feed"
              style={{ textDecoration: 'none' }}
            >
              <Rss size={18} />
            </a>
            
            <button 
              onClick={() => {
                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                  searchInput.focus();
                  searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }} 
              className="glow-btn"
            >
              <Sparkles size={16} /> Explore
            </button>
          </div>
        </div>
      </header>

      <main style={{ flexGrow: 1 }}>
        {/* Hero Section */}
        <section className="hero">
          <h1 style={{ marginBottom: '1.5rem' }}>Welcome to my digital garden! 👋</h1>
          <div style={{ maxWidth: '640px', margin: '0 auto 1.5rem', textAlign: 'center' }}>
            <p style={{ lineHeight: '1.7', marginBottom: '1rem', fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
              By day, I’m a <strong>Java + ReactJS Fullstack Developer</strong> who teams up with DevOps to orchestrate containerized microservices in <strong>Dockerized Kubernetes (K8s)</strong> environments. ☕️⚛️🐳☸️
            </p>
            <p style={{ lineHeight: '1.7', fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
              But by night? That's when the real chaos begins. Welcome to my digital garden, where I trade enterprise architecture for pure <strong>Vibecoding 🎶💻</strong>—building fast, breaking things, and letting the creative juices flow.
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <span className="tag-badge">☕ Java</span>
            <span className="tag-badge">⚛️ ReactJS</span>
            <span className="tag-badge">☸️ Kubernetes</span>
            <span className="tag-badge">🐳 Docker</span>
            <span className="tag-badge">🟢 Node.js</span>
            <span className="tag-badge">🐹 Golang</span>
            <span className="tag-badge">🛸 FPV Drones</span>
            <span className="tag-badge">🎮 Switch 2 & PC</span>
            <span className="tag-badge">🕹️ Retro Gaming</span>
          </div>

          {/* Search bar inside hero */}
          <div className="search-container">
            <input 
              id="search-input"
              type="text" 
              placeholder="Search posts or tags..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <Search 
              size={18} 
              className="search-icon"
            />
          </div>
        </section>

        {/* Blog section */}
        <section className="blog-section">
          {/* Categories bar */}
          <div className="filter-tabs">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`tab-btn ${selectedCategory === category ? 'active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Post Grid */}
          {filteredPosts.length > 0 ? (
            <div className="blog-grid">
              {filteredPosts.map(post => (
                <a 
                  href={`#/post/${post.slug}`} 
                  key={post.slug} 
                  className="post-card"
                >
                  <div className="card-img-wrapper">
                    {post.coverImage && (
                      <img 
                        src={post.coverImage} 
                        alt={post.title} 
                        className="card-img" 
                        loading="lazy"
                      />
                    )}
                    <span className="card-badge">{post.category}</span>
                  </div>
                  
                  <div className="card-content">
                    <div className="card-date-meta">
                      <Calendar size={12} />
                      <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span style={{ opacity: 0.3 }}>•</span>
                      <Clock size={12} />
                      <span>{post.readTime}</span>
                    </div>
                    
                    <h2 className="card-title">{post.title}</h2>
                    <p className="card-excerpt">{post.excerpt}</p>
                    
                    <div className="card-footer">
                      <div className="card-author">
                        <div className="author-avatar">{post.author.charAt(0)}</div>
                        <span>{post.author}</span>
                      </div>
                      
                      <span className="card-link">
                        Read More <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Inbox size={48} />
              <h3>No articles found</h3>
              <p>We couldn't find any articles matching your search or category filter. Try clearing filters or typing a different query.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="glow-btn"
                style={{ marginTop: '1.5rem', padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p className="footer-text">© {new Date().getFullYear()} OniBlog. Powered by Vite + React + Markdown.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
