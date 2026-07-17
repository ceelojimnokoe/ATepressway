# Deploy & rollback — ATEL site

The app is a standard Next.js 15 (App Router) project. Vercel auto-detects
it; no `vercel.json` is needed. Security headers, redirects, and image
settings all live in `next.config.ts` and are applied by Vercel.

> This project could not be deployed from the build environment used to
> prepare it (no Vercel CLI, and the Vercel connector needs interactive
> sign-in). The commands below are what to run to deploy and roll back.

## First-time setup

```bash
npm i -g vercel        # install the CLI
vercel login           # authenticate (interactive, one time)
vercel link            # link this folder to a Vercel project (one time)
```

## Deploy

Either path works; pick one.

**A. Git integration (recommended).** Connect the repo to the Vercel
project once, then every push to `main` ships to production and every
branch/PR gets a preview URL:

```bash
git add -A && git commit -m "Launch content + config"
git push origin main
```

**B. CLI.**

```bash
vercel            # deploy a preview, prints a preview URL
vercel --prod     # promote to production, prints the production URL
```

The production URL is `https://<project>.vercel.app` (plus any custom
domain added under Project → Settings → Domains). Set
`NEXT_PUBLIC_SITE_URL` to the final domain (Project → Settings →
Environment Variables) so canonical URLs, the sitemap, and JSON-LD point
at the real host — see `src/lib/site.ts`.

## Rollback

Production is a pointer to a specific immutable deployment, so rollback is
instant and non-destructive — no rebuild.

**Dashboard:** Project → **Deployments** → pick the last-known-good
deployment → **⋯ → Promote to Production** (or **Instant Rollback**).

**CLI:**

```bash
vercel ls                      # list recent deployments, copy the good URL
vercel promote <deployment-url>   # make that deployment production again
vercel rollback                # or: revert to the immediately previous prod
```

If the bad deploy came from git, also revert the commit so the next push
doesn't reintroduce it:

```bash
git revert <bad-commit-sha> && git push origin main
```

## Pre-deploy check

```bash
pnpm build     # must exit 0 with zero TS errors before promoting to prod
```
