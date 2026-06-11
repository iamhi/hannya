# OniBlog Workspace Guidelines

This document outlines project conventions, build commands, and instructions for working in the OniBlog workspace.

## Build and Run Commands

- **Local Development**: `npm run dev`
- **Build Project**: `npm run build`
- **Lint Code**: `npm run lint`
- **Preview Build**: `npm run preview`
- **Deploy**: `npm run deploy` (or `bash deploy.sh`)

## Blog Writing & Style Guidelines

When writing or editing blog posts in this repository, you MUST adhere to the following rules:

### 1. Tone and Style Guide
- **Tone**: Keep it balanced, natural, and friendly. Avoid being overly energetic, hyped, or hyperactive (do not use excessive exclamation points, "get ready!" spam, or over-the-top marketing language). It should feel like a developer writing a personal, comfy blog. It does not need to be dry or formal.
- **Emojis**: Yes! Use emojis contextually (e.g., 🛸, 🎮, 💻, 🚀) to add character and visual interest to headings and inline text, but keep it tasteful.
- **Punctuation (CRITICAL)**: **NEVER use the em-dash character (`—`)** or double hyphens acting as an em-dash. Use colons (`:`), commas (`,`), semicolons (`;`), parentheses, or standard hyphens/dashes (`-`) instead.

### 2. Context & References
Before writing or modifying any blog post, consult these references to maintain content alignment:
- **[llms.txt](file:///Users/darkoorovchanec/Documents/workplace/playground/oni/hannya/public/llms.txt)**: Understand the developer's core profile, main skills, hobbies, and the existing list of blog posts.
- **[rss.xml](file:///Users/darkoorovchanec/Documents/workplace/playground/oni/hannya/public/rss.xml)**: Keep blog content, categories, and tags aligned with the blog structure.

### 3. File Formats & Frontmatter
Every blog post in [src/blogs/](file:///Users/darkoorovchanec/Documents/workplace/playground/oni/hannya/src/blogs/) must be a Markdown (`.md`) file containing a YAML frontmatter block:
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

### 4. Required Post-Writing Actions
When adding a new blog post:
1. **Plain Text Version**: Create a plain-text version in `public/<slug>.txt` (e.g., [hello-world-vibecoding.txt](file:///Users/darkoorovchanec/Documents/workplace/playground/oni/hannya/public/hello-world-vibecoding.txt)). It should feature clean text, with metadata fields formatted as bullet points (e.g., `- **Date**: YYYY-MM-DD`) at the top, and markdown content underneath.
2. **Update llms.txt**: Append the new post under the `## Blog Posts` section of [llms.txt](file:///Users/darkoorovchanec/Documents/workplace/playground/oni/hannya/public/llms.txt) using the format:
   `- [Title](/slug.txt) (WritingType) - Excerpt`
3. **Regenerate RSS Feed**: Run `node generate-rss.js` or `npm run build` to rebuild the project and automatically regenerate [rss.xml](file:///Users/darkoorovchanec/Documents/workplace/playground/oni/hannya/public/rss.xml).
