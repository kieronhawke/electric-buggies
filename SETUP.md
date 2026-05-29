# Mayfair Vehicles — Setup & Kickoff (do these in order)

This gets your machine ready, gathers everything Claude Code needs, and starts the autonomous build. Do **Step 1 and Step 2 once** — after that, Claude Code does the work.

> Tell me your operating system (macOS or Windows) if you'd like these tailored. Commands below cover both.

---

## STEP 1 — Create accounts & collect keys (≈20 min, one time)

This is the part only you can do. Gather these into a scratch note; you'll paste them when Claude Code asks. Free tiers are fine for all of them.

| Service | What it's for | Get from |
|---|---|---|
| **GitHub** ✅ (you have) | stores the code | github.com |
| **Vercel** | hosting + live URL + auto-deploy | vercel.com → sign up **with GitHub** |
| **Sanity** | your admin / content + image CDN | sanity.io → sign up |
| **Resend** | sends quote-request emails | resend.com → create an API key |
| **remove.bg** *(optional)* | one-click background removal in admin | remove.bg → API → key (free tier) |
| **Anthropic** | powers Claude Code | claude.com (your existing plan/login) |

You do **not** need a domain yet — we launch on a free Vercel URL.

---

## STEP 2 — Install the tools (one time)

**a) Node.js (LTS) + git**
- **macOS:** install Homebrew (brew.sh) then:
  ```bash
  brew install node git
  ```
- **Windows:** download and run the installers from nodejs.org (LTS) and git-scm.com.

Verify:
```bash
node -v        # expect v20+ (LTS)
git --version
```

**b) Claude Code**
```bash
npm install -g @anthropic-ai/claude-code
```
Then start it once to log in:
```bash
claude
```
Follow the prompt to authenticate with your Anthropic account. (If you hit any install issue, see https://docs.claude.com/en/docs/claude-code/overview.)

---

## STEP 3 — Create the project folder & drop in the brief

```bash
mkdir mayfair-vehicles && cd mayfair-vehicles
mkdir references references/logo data
```

Now place these files (download them from this chat) into the folder:

| File from chat | Put it here |
|---|---|
| `PROJECT-BRIEF.md` | `mayfair-vehicles/PROJECT-BRIEF.md` |
| `eagle-catalog.json` | `mayfair-vehicles/data/eagle-catalog.json` |
| `index.html` (the homepage prototype) | `mayfair-vehicles/references/prototype-homepage.html` |
| your **logo** PNG | `mayfair-vehicles/references/logo/` |
| your **reference screenshots** (Land Rover / Porsche / Tesla) | `mayfair-vehicles/references/` |

The reference screenshots matter — Claude Code will look at them to match the design. Add as many as you have.

---

## STEP 4 — Start the autonomous build

From inside the `mayfair-vehicles` folder:
```bash
claude
```

Then paste this as your first message to it:

> Read `PROJECT-BRIEF.md` in full and look at every file in `/references`. Then build the entire Mayfair Vehicles site exactly as specified, working through Phases 0–6 in order. Initialise the Next.js + TypeScript + Tailwind project, set up the repo, and deploy to Vercel as early as Phase 0 so I get a live URL, then keep shipping. Work autonomously and do not stop for confirmation on implementation details — only pause to ask me when you need a credential/API key or a genuine brand decision. When you need a key, ask for one at a time and tell me exactly where to get it. Keep `main` always deployable and commit frequently. Start now.

**To let it run hands-off:** when Claude Code asks permission to run a command or edit files, choose the option to **allow and not ask again** for that type of action. From then on it proceeds without interrupting you, except for the credential/decision points above.

---

## STEP 5 — What to expect (and the few times it'll need you)

Claude Code will, on its own: scaffold the app, build the pages to match the design, set up Sanity (your admin), build the configurator, wire SEO, import and process your images, and deploy.

It will pause only to:
1. **Paste a key** — it'll ask for Vercel / Sanity / Resend / remove.bg credentials one at a time (from your Step 1 note).
2. **Confirm a brand call** — e.g. the warranty term, or final model names.
3. **Give it your curated image list** — the URLs you selected in the gallery, so it knows which photos go on which model.

Everything else is automatic. Each push auto-deploys, so your live URL updates itself.

---

## STEP 6 — After it's live (owner checklist)

Claude Code will leave a README, but you'll want to:
- Add the site to **Google Search Console** and submit the sitemap.
- Add **GA4** for analytics.
- Confirm the **warranty term** and **contact email/phone** in `/studio`.
- When ready, buy a domain and point it at Vercel (one settings change — ask Claude Code to walk you through it).

---

### Quick reference — the whole thing in order
```
1. Create accounts, collect keys (Step 1)
2. brew install node git   (or installers on Windows)
3. npm install -g @anthropic-ai/claude-code
4. claude   (log in once)
5. mkdir mayfair-vehicles && cd mayfair-vehicles
6. add PROJECT-BRIEF.md, data/, references/ files
7. claude  →  paste the kickoff message
8. paste keys when asked; otherwise let it run
```
