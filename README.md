# Pino Pino 🌹

A static, six-scene birthday experience: gate → welcome → ocean of rose petals → rose garden → chocolate box → birthday wish. HTML, CSS and vanilla JS only. No backend, no tracking, nothing stored or sent.

## Run locally
```
python3 -m http.server 8000
```
Open http://localhost:8000

## Deploy
Upload the folder as-is to Cloudflare Pages or GitHub Pages (no build step; all paths are relative).

## Customize
- Copy, names and wishes: `index.html`
- Secret nickname: `SECRET` in `script.js` (matching ignores case and extra spaces)
- Garden questions: the `Q` array in `script.js`
- Colors: CSS variables at the top of `styles.css`
- Petal / star counts: top of `script.js`

## Notes
- The gate is a playful entrance, **not security**: the secret is readable in `script.js`.
- Sound is generated live with the Web Audio API (waves, a soft pad, sparse pentatonic notes). It is original and does not reproduce any copyrighted song. It never auto-plays; the button at top right toggles it, which also serves as mute.
- Fonts load from Google Fonts with Georgia / system fallbacks, so the site still works offline.
- `prefers-reduced-motion` disables animation and trims particles.
# for-my-pino
# for-my-pino
