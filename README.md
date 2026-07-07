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
4. Disable the screensaver / sleep timer on the TV so it stays on during opening hours.

The display auto-refreshes every 5 minutes, so changes from the admin page appear without touching the TV.

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

The default **bright** theme uses a cream background, darker text, and heavier font weights for legibility in bright or glare-prone areas. For a dim indoor setting, set in `.env.local`:

```bash
NEXT_PUBLIC_DISPLAY_THEME=dark
```

Restart the dev server after changing this variable.

## Tech stack

- [Next.js](https://nextjs.org) — web app and admin
- [Tailwind CSS](https://tailwindcss.com) — TV-optimised styling
- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) — optional persistent storage for production
