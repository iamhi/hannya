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
