import { initRouter } from './router.js';
import './index.css';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  
  // Initialize the router which will handle rendering the appropriate page
  initRouter(root);
});
