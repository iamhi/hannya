import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOGS_DIR = path.join(__dirname, 'src', 'blogs');
const PUBLIC_DIR = path.join(__dirname, 'public');

// RSS Config - easy for the user to customize!
const SITE_URL = 'https://ibeenhi.com/hannya'; 
const SITE_TITLE = 'OniBlog | Modern Tech & Minimalist Design';
const SITE_DESCRIPTION = 'Explore insights on modern web development, minimalist UI/UX design, and AI-assisted programming. A high-performance, statically-generated digital workspace.';

function parseFrontmatter(filePath, rawContent) {
  const slug = path.basename(filePath, '.md');
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = rawContent.trim().match(frontmatterRegex);

  if (!match) {
    return {
      slug,
      title: 'Untitled Post',
      date: new Date().toISOString(),
      excerpt: '',
      category: 'General'
    };
  }

  const yamlBlock = match[1];
  const metadata = { slug };

  yamlBlock.split('\n').forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();

      // Remove surrounding quotes
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.substring(1, value.length - 1);
      }
      metadata[key] = value;
    }
  });

  return metadata;
}

function generateRss() {
  console.log('Generating RSS Feed...');

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

  // Sort posts by date descending
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  const outputPath = path.join(PUBLIC_DIR, 'rss.xml');
  fs.writeFileSync(outputPath, rssFeed, 'utf-8');
  console.log(`Successfully generated RSS Feed at: ${outputPath}`);
}

generateRss();
