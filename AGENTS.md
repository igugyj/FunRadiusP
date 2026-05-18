# Pblog — Agent Guide

## Stack
Next.js 16.2.2 (App Router) + TypeScript + Tailwind CSS, fully static export (`output: "export"`, `distDir: "output"`). No server, no API routes, no database.

## Commands
| Cmd | What |
|---|---|
| `npm run dev` | Dev server at localhost:3000 |
| `npm run build` | Build + postbuild (copy assets, RSS, sitemap) → `output/` |
| `npm run deploy` | Build + submit URLs to IndexNow and/or Bing (non-fatal) |
| `npm run postsubmit` | Regenerate sitemap + submit URLs (resumes if partial) |

## Next.js 16 Quirks
- `params` and `searchParams` are **Promises** — must `await` them.
- All pages use `generateStaticParams()` for dynamic routes.
- `trailingSlash: true` — URLs end with `/`, output is `path/index.html`.

## Content System
- `content/posts/[id]/index.md` — frontmatter: `title`, `published`, `description`, `category`, `tags`, `draft`.
- `content/docs/[collection]/{*.md, meta.json}` — `meta.json: published: false` hides the collection.
- `content/spec/{about,projects,information,journey}/index.md` — static spec pages.
- `content/moments/[id]/index.md` — short posts with photos.
- `content/demos/[id]/{meta.json, demo.html}` — iframe demos.
- Paths **must be ASCII/lowercase/hyphenated** — no spaces, no non-ASCII.

## i18n
Client-side only (React Context + localStorage + JSON translations in `lib/i18n/translations/`). No `[locale]` route param. 6 languages: zh, en, es, ja, de, fr.

## Build Pipeline
`next build` → `postbuild`: `copy-assets.js` → `generate-rss.js` → `generate-sitemap.js`. The sitemap only includes `posts/`, `docs/`, `spec/` content (excludes demos, moments).

## IndexNow
Key: `public/c323c6da4b4949cf9b4f87cdcc7586e3.txt` (Bing API key). Submit via `npm run deploy` or `npm run postsubmit`. Tries IndexNow first, falls back to Bing URL Submission API if IndexNow rejects.

## Cloudflare Pages
Build command: `npm run deploy`. Output dir: `output`. Set env vars in dashboard (`.env` is gitignored except `.env.example`).

## Architecture (data flow)
```
content/*/ → lib/*.ts (read + parse) → app/*/page.tsx (generateStaticParams) → static HTML
```
`lib/markdown.ts` handles unified/remark/rehype pipeline. Key libs: `lib/posts.ts`, `lib/docs.ts`, `lib/moments.ts`, `lib/demos.ts`, `lib/markdown.ts`.

## Component Conventions
- Business/client components use `'use client'` suffix pattern, live in `components/features/`.
- i18n context in `components/i18n/`, UI primitives in `components/ui/`.
- No state management library — React Context for i18n, `useState`/`useEffect` for local state.
- Giscus for comments, Live2D for mascot, `natural-falling-js` for seasonal particles.

## Content
- `docs/.ai/` — full AI dev docs (read `index.md` first for priority-ordered docs).
- `docs/deploy-cloudflare.md` — CF Pages setup details.
- `docs/prompts.txt`, `docs/demo.txt` — scratch/user notes.
- `README.md` — has content format examples and env reference.
