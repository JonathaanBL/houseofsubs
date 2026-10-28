# houseofsubs

Redesigned website for **House of Subs** — glatt kosher deli & Persian grill, 579B Middle Neck Rd, Great Neck NY.

Static site (no build step): `index.html`, `style.css`, `app.js`, `assets/`.

- Video hero and section backgrounds (`assets/video/`, rendered from the restaurant's own photos)
- 3D tilt cards and a draggable 3D photo carousel
- Full menu with category tabs (data lives in `MENU` at the top of `app.js` — edit prices there)
- Shabbat specials, Flame Caterers, hours (today highlighted) and map
- Original colors kept: wine `#391018`, gold `#EFAF4C`, cream `#F7E9E3`

Run locally:

```bash
python -m http.server 5173
```

Publish with GitHub Pages: Settings → Pages → Deploy from branch → `main` / root.
