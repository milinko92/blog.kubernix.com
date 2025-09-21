# Minimal Homelab Blog (Jekyll)

A minimalist Jekyll starter designed for tech/homelab blogs. Uses a sans-serif font stack and your palette:

- `#001b2e` (bg)
- `#1d3f58` (surface)
- `#537692` (muted)
- `#b3cde4` (accent)
- `#eef3f9` (foreground)

## Quick start (local)

1. **Install Ruby** (2.7+ recommended) and Bundler.
2. In this folder:
   ```bash
   bundle install
   bundle exec jekyll serve
   ```
3. Open http://127.0.0.1:4000

## Writing posts

Create Markdown files in `_posts` named like `YYYY-MM-DD-title.md` with front matter:
```yaml
---
layout: post
title: "My First Post"
tags: [homelab, proxmox]
---
```

## Deploying

### GitHub Pages (via Actions)
1. Push this repo to GitHub.
2. In **Settings → Pages**, pick **GitHub Actions**.
3. Add the included workflow `.github/workflows/jekyll.yml` (or enable Pages with Jekyll).
4. On push to `main`, Pages will build and deploy.

### Any static host
`bundle exec jekyll build` outputs the site into `_site/`. Upload that folder to your host.

## Customize
- Edit `_config.yml` for site title, description, permalinks.
- Tweak `assets/css/main.css` to adjust spacing/typography/colors.
- Add nav links in `_data/navigation.yml`.
