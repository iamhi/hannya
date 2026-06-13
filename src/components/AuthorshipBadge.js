const WRITING_TYPES = {
  'ai-generated': { label: 'AI Generated', icon: 'cpu', className: 'ai' },
  'human-written': { label: 'Human Written', icon: 'user', className: 'human' },
  'hybrid-written': { label: 'Hybrid Written', icon: 'sparkles', className: 'hybrid' }
};

export function renderAuthorshipBadge(type, iconSize = 10) {
  const config = WRITING_TYPES[type] || WRITING_TYPES['human-written'];
  return `
    <span class="authorship-badge ${config.className}">
      <i data-lucide="${config.icon}" style="width: ${iconSize}px; height: ${iconSize}px;"></i>
      <span>${config.label}</span>
    </span>
  `;
}
