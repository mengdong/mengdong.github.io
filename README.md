# Personal Website & Blog

This is a personal website and blog built with [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), and [TypeScript](https://www.typescriptlang.org/).

## Features

- **Static Export**: Configured for GitHub Pages hosting.
- **Blog**: Write posts in Markdown (`posts/*.md`).
- **Styling**: Dark mode support and typography plugin.
- **Latest Tech**: Next.js App Router, Tailwind CSS v4.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Adding a Blog Post

1. Create a new `.md` file in the `posts` directory.
2. Add the frontmatter:
   ```markdown
   ---
   title: "My New Post"
   date: "2023-10-27"
   excerpt: "A short description."
   ---
   
   Your content here...
   ```
3. The post will automatically appear on the Blog page.

## Deployment

To deploy to GitHub Pages:

1. Push this repository to GitHub.
2. Go to Repository Settings > Pages.
3. Select **GitHub Actions** as the source.
4. Use the default Next.js static export workflow or configure it manually.

Alternatively, if using the `gh-pages` branch method (classic):
1. Run `npm run build`.
2. The `out` directory contains the static files.
