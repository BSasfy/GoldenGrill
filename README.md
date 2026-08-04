# Golden Grill — TV Menu Display

A fullscreen menu board for your TV, with a simple admin page to update daily specials.

## Screens

| URL | Purpose |
|-----|---------|
| `/display` | **Recommended for TV** — rotates between main menu and specials every 45 seconds |
| `/menu` | Main menu only |
| `/specials` | Daily specials only |
| `/admin` | Password-protected editor for menu and specials |

## Quick start (local)

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables and set your admin password:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`:
   - `ADMIN_PASSWORD` — password for the admin page
   - `AUTH_SECRET` — any long random string (signs session cookies)

3. Run the dev server:

   ```bash
   npm run dev
   ```

4. Open in your browser:
   - TV display: [http://localhost:3000/display](http://localhost:3000/display)
   - Admin: [http://localhost:3000/admin](http://localhost:3000/admin) (password: `changeme` by default)

## TV setup

1. Open the TV's web browser (or connect a Fire TV Stick / Chromecast with a browser app).
2. Navigate to your deployed URL + `/display` (e.g. `https://goldengrill.vercel.app/display`).
3. Enter fullscreen if the browser supports it (F11 on a connected keyboard, or the browser's menu).
4. Disable the screensaver / sleep timer on the TV so it stays on during opening hours (see below — software alone often cannot override this).

### Stay-on behaviour (in the app)

The display routes (`/display`, `/menu`, `/specials`) run `DisplayKeepAlive`, which:

- **Screen Wake Lock API** — keeps Chromium browsers from dimming/locking the screen (Chrome desktop, many Fire TV / Android TV Chromium browsers). Re-checked every 30s and re-acquired when the tab becomes visible again.
- **Muted video fallback** — tiny invisible looping video as a second keep-awake signal when Wake Lock is weak or missing.
- **Soft reload** — `router.refresh()` every 5 minutes so admin edits appear without a full page load (skipped while offline; runs again when the network returns).
- **Hard reload** — full `location.reload()` every hour to clear memory leaks on long-running TV browsers.
- **Fullscreen on first remote press** — tries `requestFullscreen()` after the first key/click (helps hide chrome; needs a remote OK once).

Native LG webOS browsers often **do not** support Wake Lock; the OS power settings still matter most there.

### If the TV still goes dark

| Fix | Why it helps |
|-----|----------------|
| **TV sleep / screensaver off** | Settings → General / OLED Care / Eco → set Screen Off / Auto Power Off / Energy Saving to Off (or max timer). OLED TVs may force pixel care after long static content. |
| **“Always on” / store / gallery mode** | Some LGs have Retail Mode or permanent display modes that resist sleep. |
| **HDMI stick instead of built-in browser** | Fire Stick / Chromecast / cheap Android stick with Chrome usually has better Wake Lock support than LG webOS browser. |
| **Disable Eco / AI brightness** | Eco sensors can dim a static menu until it looks “off”. |
| **Fullscreen the tab** | Leave only the menu visible; avoid home screens under the browser. |
| **Network stability** | Soft reload needs a connection; unstable Wi‑Fi can leave a blank page after refresh. Prefer Ethernet on the stick/TV if possible. |
| **External always-on player** | Apps like Fully Kiosk (Android) can force stay-awake + reload schedules beyond what a stock browser allows. |

Hard rule: Wake Lock and reloads cannot override a TV that is powered off by the manufacturer’s sleep timer. Set the panel not to sleep, then use the app keep-alive as a second line of defence.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Add environment variables in Vercel project settings:
   - `ADMIN_PASSWORD`
   - `AUTH_SECRET`
   - `BLOB_READ_WRITE_TOKEN` — **required for saving edits on Vercel**

   To get a Blob token: Vercel dashboard → Storage → Create Blob store → connect to project. Vercel adds `BLOB_READ_WRITE_TOKEN` automatically.

4. Deploy. Your TV points at `https://your-project.vercel.app/display`.

Without Blob storage, the app reads the default menu from `data/` but **admin saves won't persist** on Vercel's serverless platform. Blob storage fixes that.

## Daily workflow

1. Each morning, open `/admin` on your phone or laptop.
2. Update the **Daily specials** section (hero deal + any extra offers).
3. Click **Save specials** — the TV picks it up within a few minutes.
4. Update the main menu only when prices or items change long-term.

## Customisation

- Default menu data lives in `data/menu.json` and `data/specials.json`.
- Colours and layout are in `src/app/globals.css` (TV themes) and `src/components/MenuBoard.tsx` / `SpecialsBoard.tsx`.
- Rotation interval is 45 seconds in `src/components/DisplayRotator.tsx`.

### TV theme (bright vs dark)

Use the **TV display theme** toggle at the top of `/admin` to switch between light and dark on the live TV (`/display`, `/menu`, `/specials`). The choice is saved and picked up within a few minutes.

For a default before any admin save, you can optionally set in `.env.local`:

```bash
NEXT_PUBLIC_DISPLAY_THEME=bright
```

## Tech stack

- [Next.js](https://nextjs.org) — web app and admin
- [Tailwind CSS](https://tailwindcss.com) — TV-optimised styling
- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) — optional persistent storage for production
