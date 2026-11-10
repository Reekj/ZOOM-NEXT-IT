# Zoom x NEXT-IT Webinar Landing Page

React + Vite + Three.js (React Three Fiber) + GSAP prototype.

## Start locally

```bash
npm install
cp .env.example .env
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Registration

Registration CTAs open a clear placeholder notice until an official Zoom registration URL has been configured. To activate them, add the URL in `.env`:

```
VITE_ZOOM_REGISTRATION_URL=https://your-official-webinar-registration-url
```

Restart the dev server after changing `.env`. No form data is stored in this prototype.

## Files

- `src/App.jsx`: three page-length sections, navigation, loading animation, CTAs and scroll animations.
- `src/components/OrbScene.jsx`: real WebGL interactive object.
- `src/styles.css`: responsive layouts and editorial visual system.
- `public/images/nextit-logo.jpg`: supplied NEXT-IT logo.

## Content and branding notes

- Event date/time, confirmed speakers and exact Zoom product capabilities still require organizer approval.
- The title and copy are draft campaign language, not a verified Zoom partnership endorsement.
- For production, replace demo/Unsplash remote photo URLs with approved, locally hosted imagery and confirm rights.
- Official Zoom brand assets can replace the prototype text-based Zoom wordmark after brand approval.
- Language terms are used as decorative vocabulary; have a native-language reviewer check final orthography.
- Optimize 3D and test midrange mobile devices before production launch.
