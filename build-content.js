import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOGS_DIR = path.join(__dirname, 'src', 'blogs');
const PUBLIC_DIR = path.join(__dirname, 'public');

const SITE_URL = 'https://ibeenhi.com/hannya';
const SITE_TITLE = 'OniBlog | Modern Tech & Minimalist Design';
const SITE_DESCRIPTION = 'Explore insights on modern web development, minimalist UI/UX design, and AI-assisted programming. A high-performance, statically-generated digital workspace.';

function parseFrontmatter(filePath, rawContent) {
  const slug = path.basename(filePath, '.md');
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = rawContent.trim().match(frontmatterRegex);

  const defaultMeta = {
    slug,
    title: 'Untitled Post',
    date: new Date().toISOString(),
    excerpt: '',
    category: 'General',
    readTime: '3 min read',
    coverImage: '',
    tags: [],
    writingType: 'human-written',
  };

  if (!match) {
    return { ...defaultMeta, content: rawContent, htmlContent: marked.parse(rawContent) };
  }

  const yamlBlock = match[1];
  const content = match[2].trim();
  const metadata = { slug };

  yamlBlock.split('\n').forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.substring(1, value.length - 1);
      }

      if (value.startsWith('[') && value.endsWith(']')) {
        metadata[key] = value
          .substring(1, value.length - 1)
          .split(',')
          .map((t) => t.trim().replace(/['"]/g, ''));
      } else {
        metadata[key] = value;
      }
    }
  });

  return { ...defaultMeta, ...metadata, content, htmlContent: marked.parse(content) };
}

function buildContent() {
  console.log('Building content & RSS...');

  if (!fs.existsSync(BLOGS_DIR)) {
    console.error(`Blogs directory not found: ${BLOGS_DIR}`);
    return;
  }

  const files = fs.readdirSync(BLOGS_DIR).filter(file => file.endsWith('.md'));
  const posts = [];

  files.forEach(file => {
    const filePath = path.join(BLOGS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const meta = parseFrontmatter(filePath, content);
    posts.push(meta);
  });

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  // 1. Generate JSON
  const postsJsonPath = path.join(PUBLIC_DIR, 'posts.json');
  fs.writeFileSync(postsJsonPath, JSON.stringify(posts, null, 2), 'utf-8');
  console.log(`Generated posts.json at: ${postsJsonPath}`);

  // 2. Generate RSS
  let rssItems = '';
  posts.forEach(post => {
    const postUrl = `${SITE_URL}/#/post/${post.slug}`;
    const pubDate = new Date(post.date || new Date()).toUTCString();

    rssItems += `    <item>
      <title><![CDATA[${post.title || 'Untitled Post'}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="false">${post.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.excerpt || ''}]]></description>
      <category><![CDATA[${post.category || 'General'}]]></category>
    </item>\n`;
  });

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${SITE_TITLE}]]></title>
    <link>${SITE_URL}</link>
    <description><![CDATA[${SITE_DESCRIPTION}]]></description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${rssItems}  </channel>
</rss>`;

  const rssPath = path.join(PUBLIC_DIR, 'rss.xml');
  fs.writeFileSync(rssPath, rssFeed, 'utf-8');
  console.log(`Generated RSS Feed at: ${rssPath}`);
}

buildContent();
