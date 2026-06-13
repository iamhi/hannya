export function renderHeader() {
  const theme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  const themeIcon = theme === 'light' ? 'moon' : 'sun';

  return `
    <header class="nav-header glass-effect">
      <div class="nav-container">
        <a class="logo" href="#/">
          <span class="logo-icon">
            <i data-lucide="book-open" style="width: 20px; height: 20px;"></i>
          </span>
          <span>Oni<span style="color: var(--primary)">Blog</span></span>
        </a>

        <div class="nav-actions">
          <button id="theme-toggle" class="theme-toggle" aria-label="Toggle Theme">
            <i data-lucide="${themeIcon}" style="width: 18px; height: 18px;"></i>
          </button>

          <a href="/rss.xml" target="_blank" rel="noopener noreferrer" class="theme-toggle" aria-label="RSS Feed" style="text-decoration: none;">
            <i data-lucide="rss" style="width: 18px; height: 18px;"></i>
          </a>

          <a href="/kodama/" class="glow-btn" style="text-decoration: none;">
            <i data-lucide="info" style="width: 16px; height: 16px;"></i> About
          </a>
        </div>
      </div>
    </header>
  `;
}

export function initHeader() {
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      if (newTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      
      localStorage.setItem('theme', newTheme);
      
      // Update icon
      import('lucide').then(({ createIcons, icons }) => {
        themeToggle.innerHTML = `<i data-lucide="${newTheme === 'light' ? 'moon' : 'sun'}" style="width: 18px; height: 18px;"></i>`;
        createIcons({ icons });
      });
    });
  }
}
