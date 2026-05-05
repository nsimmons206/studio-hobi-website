# Studio Hobi website

Static site built with [Vite](https://vitejs.dev/) and [Tailwind CSS v4](https://tailwindcss.com/). Deployed to Netlify.

## Local development

```bash
npm install
npm run dev
```

Visit http://localhost:5173.

## Production build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the built site locally
```

## Project layout

```
.
├── index.html          # the page itself — edit text/sections here
├── src/
│   ├── style.css       # Tailwind entry — `@import "tailwindcss"`
│   └── main.js         # tiny JS (just sets the footer year)
├── vite.config.js      # registers the Tailwind Vite plugin
├── netlify.toml        # tells Netlify how to build (npm run build → dist/)
└── package.json
```

## Editing content

Most edits happen in `index.html`. Tailwind classes go right on the elements
— there's no separate CSS file to maintain. The full class list is at
https://tailwindcss.com/docs.
