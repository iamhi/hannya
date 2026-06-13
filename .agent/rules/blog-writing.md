---
description: Scoped rules and style guidelines for writing and editing blog posts.
globs: src/blogs/*.md, public/*.txt
---
# Blog Post Writing & Editing Rules

Always adhere to the following rules when creating, editing, or revising blog posts in `src/blogs/` and their plain text equivalents in `public/`.

## 1. Tone and Style Guide
- **Tone**: Keep it balanced, natural, and friendly. Avoid being overly energetic, hyped, or hyperactive (do not use excessive exclamation points, "get ready!" spam, or over-the-top marketing language). It should feel like a developer writing a personal, comfy blog. It does not need to be dry or formal.
- **Emojis**: Yes! Use emojis contextually (e.g., 🛸, 🎮, 💻, 🚀) to add character and visual interest to headings and inline text, but keep it tasteful.
- **Punctuation (CRITICAL)**: **NEVER use the em-dash character (`—`)** or double hyphens acting as an em-dash. Use colons (`:`), commas (`,`), semicolons (`;`), parentheses, or standard hyphens/dashes (`-`) instead.

## 2. Dependencies and References
Before writing or modifying any blog post, consult these references for context alignment:
- **[llms.txt](file:///Users/darkoorovchanec/Documents/workplace/playground/oni/hannya/public/llms.txt)**: Understand the developer's core profile, main skills, hobbies, and the existing list of blog posts.
- **[rss.xml](file:///Users/darkoorovchanec/Documents/workplace/playground/oni/hannya/public/rss.xml)**: Keep blog content, categories, and tags aligned with the blog structure.

## 3. Blog Frontmatter & Formats
Every post in `src/blogs/` must be a Markdown (`.md`) file containing a YAML frontmatter:
```yaml
---
title: "A clear, engaging title"
date: "YYYY-MM-DD"
excerpt: "A short, descriptive summary of the blog post"
category: "Technology category"
readTime: "X min read"
coverImage: "https://images.unsplash.com/photo-..."
tags: ["Tag1", "Tag2"]
writingType: "ai-generated" | "human-written" | "hybrid-written"
---
```

## 4. Required Post-Writing Actions
When adding a new blog post:
1. **Plain Text Version**: Create a plain-text version in `public/<slug>.txt`. It should feature clean text, with metadata fields formatted as bullet points (e.g., `- **Date**: YYYY-MM-DD`) at the top, and markdown content underneath.
2. **Update [llms.txt](file:///Users/darkoorovchanec/Documents/workplace/playground/oni/hannya/public/llms.txt)**: Append the new post under the `## Blog Posts` section using the format:
   `- [Title](/slug.txt) (WritingType) - Excerpt`
3. **Regenerate RSS Feed**: Run `npm run build` or `node generate-rss.js` to rebuild the project and automatically regenerate [rss.xml](file:///Users/darkoorovchanec/Documents/workplace/playground/oni/hannya/public/rss.xml).

## 5. Accessibility (a11y) Standards
- **Alt Text**: Always provide descriptive alt text for informative images (`alt="Description of image contents"`). Use an empty alt attribute (`alt=""`) for purely decorative images.
- **Heading Order**: Maintain a logical nesting hierarchy (H1 for title, H2 for main sections, H3 for subsections). Never skip levels (e.g., jumping from H2 to H4).
- **Descriptive Links**: Link text must describe the destination. Never use generic labels like "click here," "read more," or raw URLs as link text.
- **Semantic HTML**: Use proper semantic elements for structures (e.g., list tags, table tags) instead of styling plain text with bold or font-size adjustments.

## 6. Answer Engine Optimization (AEO)
- **Front-Load Answers**: Answer the core question of any section directly in the first 1-2 sentences to help readers and AI crawlers find answers instantly.
- **Search-Intent Headings**: Phrase headings as questions or queries that developers commonly search for (e.g., `## How do I configure Vite plugins?` rather than `## Plugins`).

## 7. Readability & Formatting
- **Paragraph Length**: Keep paragraphs short (2-4 lines) to avoid overwhelming the reader.
- **Lists and Visual Breaks**: Use bullet points, numbered lists, and code blocks to break up text and make the post easy to scan.
- **Topic Pillars & E-E-A-T**: Focus topics within the blog's core pillars. Back up technical claims with real experiences, examples, and/or reference links to official documentation.

