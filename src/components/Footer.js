export function renderFooter() {
  return `
    <footer class="app-footer">
      <div class="footer-content">
        <p class="footer-text">© ${new Date().getFullYear()} OniBlog. Powered by Vite + Vanilla JS + Markdown.</p>
      </div>
    </footer>
  `;
}
