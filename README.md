# Playstore Wizard

[![Made with Next.js 15](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)](https://nextjs.org)
[![Deploys to Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com)
[![License: Source-available](https://img.shields.io/badge/License-Source--available-blueviolet)](#license)

A guided publishing studio for Google Play. Compliance, listings, asset auto-resize, AI descriptions, one-click submit — built for indie developers who do not want to lose two hours every time Google updates a policy.

Live: **[playstorewizard.pro](https://playstorewizard.pro)**

---

## What this is

A production Next.js 15 web app implementing all 14 build pillars:

1. **STRATEGIC_PAGE_STRUCTURE** — 47 routes: home, 6 marketing pages, 6 legal pages, 15 long-form guides, 12-step wizard, 7 API routes, sitemap, robots
2. **CINEMATIC_ART_DIRECTION** — high-contrast dark UI with aurora gradients, glass cards, italic-serif accent treatments
3. **RESPONSIVE_3D_BACKGROUND** — canvas-based particle aurora with three layered radial gradients, DPR-capped, pauses offscreen
4. **TEXTURE_GRADIENT_COLOR_SYSTEM** — design tokens for bg/border/text + brand color ramp + aurora gradients + SVG noise overlay
5. **PREMIUM_FONT_STACK** — Bricolage Grotesque (display) + Instrument Serif (italic accent) + IBM Plex Mono (mono)
6. **MOTION_LAYER_STACK** — reveal/stagger primitives, hover-lift, click-scale, ripple, shimmer, ping-slow, float — all reduced-motion-safe
7. **SCROLL_TRIGGERED_REVEALS** — IntersectionObserver-based, with optional once/repeat, threshold, and stagger delay
8. **HOVER_MICRO_INTERACTIONS** — subtle translateY + glow on cards, color transitions on nav, gradient shifts
9. **CLICK_FEEDBACK_EFFECTS** — global `active:scale-[0.97]` on buttons + optional ripple wrapper
10. **LIVE_PREVIEW_STATE_ENGINE** — Zustand store with localStorage persistence drives wizard state across all 12 steps
11. **MONETIZATION_BLOCKS** — AdSense slots placed strategically on home, features, FAQ, guides index, in every long-form guide
12. **SEO_STRUCTURE** — full metadata API, JSON-LD (Organization, SoftwareApplication, Article, Breadcrumb, FAQPage), sitemap.xml, robots.txt
13. **PERFORMANCE_LIMITER** — Edge runtime API routes, DPR cap on canvas, IntersectionObserver lazy reveals, contain CSS, fixed-size hero images
14. **ACCESSIBILITY_SAFETY** — skip link, semantic landmarks, ARIA labels on icons, prefers-reduced-motion honored everywhere, focus rings

---

## Quick start (local development)

```bash
git clone https://github.com/3000Studios/playstorewizard.pro.git
cd playstorewizard.pro

# Use Node 20+ (see .nvmrc)
nvm use 20

# Install
pnpm install     # or: npm install --legacy-peer-deps

# Copy and edit env
cp .env.example .env.local

# Run dev server on :3000
pnpm dev
```

Open <http://localhost:3000>.

### What works without configuration

- Every marketing, legal, and guide page
- The full 12-step wizard (state persists in your browser)
- The compliance checker and pricing calculator (run client-side)
- The AAB parser (runs in your browser, your bundle never leaves your device)

### What needs configuration

- AdSense ads (need a publisher ID)
- AI generation endpoints (need a Cloudflare AI binding or local Ollama)
- The `/api/publish` endpoint (needs a Google service-account JSON)

See [Configuration](#configuration) below.

---

## Verification

The build is verified to pass `typecheck && lint && build` clean with zero warnings.

```bash
pnpm typecheck   # 0 errors
pnpm lint        # 0 warnings
pnpm build       # 47 routes generated
```

---

## Deploying to Cloudflare Pages (free tier)

Cloudflare Pages is the recommended deployment target — free tier, free SSL, free Workers AI binding, free KV namespace, no cold starts.

### 1. Connect repo

In the Cloudflare dashboard, create a new Pages project and connect the GitHub repository. Use these build settings:

- **Framework preset:** Next.js
- **Build command:** `npx @cloudflare/next-on-pages@1`
- **Build output directory:** `.vercel/output/static`
- **Root directory:** (leave blank)
- **Node version:** `20`

### 2. Add the AI binding (free Workers AI)

After the first deploy succeeds, go to your Pages project **Settings → Functions → Bindings**:

- Click **Add binding → Workers AI**
- Binding variable name: `AI`
- Save and redeploy

This unlocks the listing generator, privacy policy generator, and review-reply generator at no cost (free tier ≈ 10,000 inferences/day).

### 3. Add the Google service-account secret (only if you want one-click publish)

```bash
pnpm wrangler pages secret put GOOGLE_SA_JSON --project-name playstorewizard-pro
# Paste your service-account JSON when prompted (single line)
```

### 4. Set the AdSense client ID (when approved)

In the Pages dashboard **Settings → Environment variables**:

- `NEXT_PUBLIC_ADSENSE_CLIENT_ID` = `ca-pub-XXXXXXXXXXXXXXXX` (your real publisher ID)
- `NEXT_PUBLIC_SITE_URL` = `https://playstorewizard.pro`

Redeploy. AdSense ads will replace the placeholder slots automatically.

### 5. Custom domain

In the Pages project **Custom domains** tab, add `playstorewizard.pro` and follow the DNS instructions. Cloudflare handles the SSL certificate automatically.

---

## Activating Google AdSense

The site is **AdSense-ready** out of the box. The 2026 approval checklist is fully satisfied:

| Requirement | How this repo handles it |
|---|---|
| 15+ pages of original, high-quality content | 15 long-form guides (1000–1800 words each) + 6 marketing pages |
| Required legal pages | `/about`, `/contact`, `/privacy`, `/terms`, `/cookies`, `/disclaimer` |
| HTTPS | Free SSL via Cloudflare Pages |
| Mobile-friendly | All pages responsive, mobile-first |
| `ads.txt` at root | `public/ads.txt` |
| AdSense ownership meta tag | Auto-injected via `metadata.other` in `app/layout.tsx` when client ID is set |
| AdSense script (afterInteractive) | `src/components/adsense/google-adsense.tsx` |
| `sitemap.xml` | `src/app/sitemap.ts` (47 URLs) |
| `robots.txt` | `src/app/robots.ts` |
| Clear navigation | Sticky top nav + comprehensive footer with all major routes |
| No broken links | All internal routes type-checked |

### Activation steps

1. Apply for AdSense at [google.com/adsense](https://www.google.com/adsense)
2. Add `playstorewizard.pro` as a site
3. Get your publisher ID (format: `ca-pub-XXXXXXXXXXXXXXXX`)
4. Update `public/ads.txt`:
   ```
   google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
   ```
5. Set `NEXT_PUBLIC_ADSENSE_CLIENT_ID` in your Pages environment variables
6. Redeploy
7. Wait 1–14 days for AdSense review

Until your real publisher ID is set, every AdSense slot renders as a dashed placeholder labeled "Advertisement · AdSense slot · &lt;id&gt;" so the layout stays testable.

---

## Configuration

Environment variables (see `.env.example`):

| Variable | Required? | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | for ads | `ca-pub-0000000000000000` | Your AdSense publisher ID |
| `NEXT_PUBLIC_SITE_URL` | recommended | `https://playstorewizard.pro` | Used for canonical, OG, sitemap |
| `OLLAMA_HOST` | dev only | `http://localhost:11434` | Local Ollama for free AI in dev |
| `OLLAMA_MODEL` | dev only | `qwen2.5-coder:7b` | Local model name |
| `GOOGLE_SA_JSON` | for publish | — | Service-account JSON for Play Developer API (Cloudflare secret) |

Cloudflare bindings (set in dashboard, not in `.env`):

| Binding | Type | Purpose |
|---|---|---|
| `AI` | Workers AI | Free-tier inference for AI features |
| `LICENSE_KV` | KV namespace | Pro license revocation (optional) |

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout — AdSense, AuroraBg, nav, footer
│   ├── page.tsx                      # Home — hero, features, how-it-works, CTA
│   ├── globals.css                   # Design tokens, fonts, motion utilities
│   ├── sitemap.ts                    # Dynamic sitemap
│   ├── robots.ts                     # Dynamic robots
│   ├── (marketing)/                  # Marketing route group
│   │   ├── features/
│   │   ├── pricing/                  # Server wrapper + client component
│   │   ├── how-it-works/
│   │   ├── compare/
│   │   ├── changelog/
│   │   └── faq/
│   ├── (legal)/                      # Legal route group (AdSense-required pages)
│   │   ├── about/
│   │   ├── contact/
│   │   ├── privacy/
│   │   ├── terms/
│   │   ├── cookies/
│   │   └── disclaimer/
│   ├── guides/                       # 15 long-form content pages for AdSense depth
│   │   ├── page.tsx                  # Guides index with category filtering
│   │   └── <15 guide slugs>/
│   ├── wizard/
│   │   ├── layout.tsx                # Progress bar + step nav
│   │   ├── page.tsx                  # Redirects to first step
│   │   └── [step]/page.tsx           # Dynamic step renderer
│   └── api/                          # Edge-runtime API routes
│       ├── ai/
│       │   ├── description/
│       │   ├── privacy/
│       │   └── review-reply/
│       ├── compliance/check/
│       ├── pricing/recommend/
│       ├── bundle/parse/
│       ├── publish/
│       └── contact/
├── components/
│   ├── ui/                           # Button, Card, Input, Badge, etc.
│   ├── adsense/                      # AdSense script + AdUnit + InArticleAd
│   ├── motion/                       # Reveal, Stagger, Ripple
│   ├── bg/                           # Aurora background canvas
│   ├── nav/                          # TopNav, Footer
│   ├── seo/                          # JsonLd
│   ├── content/                      # GuideLayout shared shell
│   └── wizard/                       # WizardStep dispatcher + 12 step components
└── lib/
    ├── ai/                           # AI client + description/privacy/review-reply generators
    ├── compliance/                   # 22 Google Play rules + checker
    ├── timeline/                     # Realistic submission timeline estimator
    ├── pricing/                      # Fee calculator (current + post-June-2026 regimes)
    ├── bundle/                       # Browser-side AAB/APK parser (pure TS, uses fflate)
    ├── assets/                       # Image resizer specs + browser-side resizer
    ├── publish/                      # Play Developer API v3 client (Web Crypto JWT)
    ├── pro/                          # Tier definitions + HMAC license signing
    ├── seo/                          # Metadata + JSON-LD builders
    ├── content/                      # Guide registry
    ├── utils.ts                      # cn, SITE_URL, formatters
    ├── store.ts                      # Zustand wizard store
    ├── steps.ts                      # 12-step definitions
    └── types.ts                      # Wizard state shape
```

---

## Tech stack

- **Framework:** Next.js 15 (App Router, Edge Runtime where possible)
- **UI:** React 18.3, Tailwind CSS 3.4 with `@tailwindcss/typography`
- **State:** Zustand 5 with localStorage persistence
- **Validation:** Zod 3
- **Icons:** lucide-react
- **AAB/APK parsing:** fflate (browser-side, no bundletool)
- **AI:** Cloudflare Workers AI (free tier) with Ollama fallback for local dev
- **Deployment:** Cloudflare Pages via `@cloudflare/next-on-pages`
- **CI:** GitHub Actions running `typecheck && lint && build` on push

Zero paid APIs in the default configuration. Every feature works on the free tier.

---

## Development

```bash
pnpm dev          # dev server on :3000
pnpm typecheck    # strict tsc --noEmit
pnpm lint         # eslint via next lint
pnpm build        # production build (verifies all routes)
pnpm check        # typecheck + lint + build in sequence
pnpm pages:preview  # local Cloudflare Pages preview
pnpm pages:deploy   # one-shot deploy to Cloudflare Pages
```

---

## Contributing

The compliance rule definitions, the AAB parser, and the privacy policy generator are open-source under MIT. The wizard UI and Pro-tier features are source-available; you can read them but not redistribute without permission.

Bug reports and feature requests are welcome — open a GitHub issue or email <bugs@playstorewizard.pro>.

---

## License

Source-available. The `src/lib/compliance/`, `src/lib/bundle/`, and `src/lib/ai/privacy.ts` modules are dual-licensed MIT for non-commercial use. Everything else is reserved.

---

## Disclaimer

Playstore Wizard is built by 3000Studios. We are **not affiliated with Google LLC**. "Google Play", "Play Store", "Play Console", and "Android" are trademarks of Google LLC, used here only to describe the platform this tool helps you publish to. The compliance check reflects our best understanding of current Google Play policies — Google retains sole discretion over policy enforcement and Play Store approval decisions. This tool is not legal advice.
