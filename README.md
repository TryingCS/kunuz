 
# كنوز — Kunuz

Interactive "rooms": 2D static scenes (parchment-style illustrations) where glowing
hotspots reveal Quran / hadith / athar with Arabic text, translation, source,
grading, optional context note, and optional link to the full sharh on Dorar.net.

- **Live:** https://tryingcs.github.io/kunuz/
- **Repo:** github.com/TryingCS/kunuz → deploys to GitHub Pages on push to `main`
- **Stack:** vanilla HTML/CSS/JS + JSON. No framework, no build step.
- **Fonts:** Google Fonts — Amiri (body/sacred text), Aref Ruqaa (headings).

## Concept

- A **room** = one background image + a JSON list of hotspots (`x`,`y` in %).
- The **hub** (`index.html`) lists rooms as cards, grouped later by *series*.
- Umbrella name: **Kunuz / كنوز**. Series names live inside it
  (first series: "Prophetic Lens / العدسة النبوية").
- Desktop-first (hover, landscape) but touch-friendly: markers are 44px invisible
  buttons with a ~10px visible dot.
- Card = *tasting menu, not encyclopedia*: max ~4 entries per hotspot;
  depth lives behind the Dorar link.

## File map

```
index.html              hub; room cards built from data/rooms.json (styles inline in <style>)
room.html               the ONE room template; loads ?room=<id>
assets/css/main.css     shared room styles; CSS vars: --ink, --green, --panel-bg
assets/js/engine.js     engine: manifest → room data → markers/tooltip/panel/dismiss/edit-mode;
                        also holds the i18n dictionary (ar/en/fr)
assets/images/map.png   parchment map (Kaaba-center version). DO NOT REGENERATE (coords tuned)
data/rooms.json         manifest: [{id, title{ar,en,fr}, image, series, dataFile}]
data/map-virtues.json   room data (currently the only room; 5 hotspots)
```

## Data schema

**Manifest entry** (`data/rooms.json`):
`id`, `title{ar,en,fr}`, `image` (path), `series` (slug), `dataFile` (path).

**Hotspot** (room data file):
```json
{
  "id": "makkah",
  "x": 50, "y": 49,
  "place": { "ar": "مكة", "en": "Makkah", "fr": "La Mecque" },
  "entries": [ { "type": "hadith", "text_ar": "…", "tr": { "en": "…", "fr": "…" },
                 "source": "tirmidhi", "grade": "sahih",
                 "dorar": "https://dorar.net/hadith/sharh/…",
                 "note": { "ar": "…", "en": "…", "fr": "…" } } ]
}
```
- `entries` is **always an array** (single quote = 1-element array; panel shows
  pagination dots only when >1; dots are clickable).
- `type`: `hadith | quran | athar` (badge + i18n label).
- `source` / `grade`: **codes**, rendered through the i18n dictionary in engine.js.
- `dorar`: verified sharh URL or `""` (button hidden when empty).
- `note`: optional one-line context; `null`/absent → not rendered.

## i18n policy

- Default language: **Arabic** (page is `dir="rtl"`).
- Sacred text (`text_ar`) is **always shown in Arabic**, never replaced.
- Translations: currently AR sacred text + one translation alongside
  (`tr[currentLang] || tr.en`); future = toggle showing one at a time.
- Metadata (type/grade) via i18n dictionary in `engine.js`; **known gap:** source
  codes still render raw (`bukhari-muslim`) — add source labels to dictionary (TODO).
- Any new UI string goes into the dictionary, not hardcoded (footer disclaimer in
  `room.html` is still hardcoded AR — TODO).

## Content policy

- Only well-attested narrations; always include source + grade; skip or clearly
  flag disputed gradings.
- Verify every Dorar link by hand before pasting (search → open sharh → copy URL).
- Rooms may mix content types on one hotspot (ayah + hadith + athar) — that's the
  "ayat in context" feature.
- Stylized geography: keep the footer disclaimer «خريطة تقريبية للتمثيل».

## Art direction

- ONE style system: ancient parchment / sepia ink (medieval Islamic cartography,
  al-Idrisi vibe), "document on a desk" framing. Per-room **accent palettes** via
  CSS vars are allowed; mixing style systems is not.
- Kaaba drawn large & central on the map = medieval-authentic AND is the Makkah
  hotspot itself.
- Markers: green glowing dot + expanding ping ring; hover/focus = tooltip with
  place name + dot scale-up; `prefers-reduced-motion` disables animation.

## Engine behaviors (room.html)

- Hover/focus tooltip; click marker → panel with entry; dots paginate entries.
- Dismiss panel: ✕ button, click on empty map, or ESC.
- Edit mode: `room.html?room=<id>&edit=1` → clicking the map copies
  `"x": .., "y": ..` (percent, 1 decimal) to clipboard. Use this to place/tune
  hotspots; paste values into the room JSON.
- No `?room=` param → redirect to hub.

## Local dev & deploy

- `fetch()` needs a server: `python3 -m http.server` → `localhost:8000`
  (`file://` will fail silently).
- Deploy = push to `main`; GitHub Pages builds automatically.
- **Cache gotcha:** after deploy, hard-refresh (`Ctrl+Shift+R`) or use a private
  window; stale CSS/JSON is the #1 "my change didn't work" cause.

## Decisions log (why)

- Hub + per-room home link (TODO) instead of prev/next arrows: rooms are
  heterogeneous; series are expressed as hub sections, not navigation order.
- Future geo themes = same map image + different data file (layers); commission a
  new map asset only when geography changes (e.g. world map for a rihla room).
- All content types on one site: the hotspot→card mechanism is content-agnostic.
- Multi-entry hotspots with dots-only-when-needed keep simple hotspots minimal.

## Roadmap / TODO

- [ ] Room #2 (kitchen or a map layer: hijra/trade routes) to prove the template.
- [ ] Home/فهرس stamp button inside rooms (back to hub).
- [ ] Language toggle UI (AR default, one translation at a time).
- [ ] i18n: source labels in dictionary; move footer/hub strings into dictionary.
- [ ] Hub: series grouping + type filters.
- [ ] Self-host Amiri/Aref Ruqaa (drop Google CDN dependency).
- [ ] Optional: keyboard ←/→ for entry pagination; per-room accent var demo.
- [ ] Hub grid: with a single card, `auto-fit` stretches it full-width;
      `.room{max-width:350px;margin:0 auto}` keeps it tidy until more rooms exist.

## Invariants — read before changing anything
1. Keep vanilla HTML/CSS/JS + JSON; no frameworks, no build step.
2. `entries` stays an array; dots render only when >1.
3. Sacred text always Arabic; metadata as codes via i18n dictionary.
4. Parchment style system everywhere; accents via CSS vars only.
5. Verify hadith grading + Dorar URLs by hand before committing content.