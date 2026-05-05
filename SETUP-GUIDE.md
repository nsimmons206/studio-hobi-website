# Setup & deploy guide — studiohobi.com and nick-simmons.com

You have two starter projects ready: `studiohobi-website/` and `nick-simmons-website/`. This guide walks you from "files on disk" to "live site at your custom domain on Netlify."

The flow is the same for both sites, so I'll show it end-to-end for **Studio Hobi** first, then note the small differences for **nick-simmons.com**.

---

## 0. One-time prerequisites

You probably already have these from your earlier setup, but quickly verify:

- **Node.js (v20 or newer).** Open your terminal and run `node -v`. If you see anything older than `v20`, install the latest LTS from https://nodejs.org.
- **Git.** Run `git --version`. Comes pre-installed on macOS once you've used GitHub Desktop.
- **GitHub Desktop.** Already installed.
- **VS Code.** Already installed.
- **A GitHub account.** Already have one.
- **A Netlify account.** Sign up at https://app.netlify.com/signup using "Sign up with GitHub" — that auto-links the two services so Netlify can read your repos. (Free tier is plenty for both sites.)

---

## 1. Move the project folders somewhere permanent

Right now the two project folders live in my temporary working folder. Copy them to wherever you keep code projects (e.g. `~/Code/` or `~/Documents/Projects/`):

```
~/Code/
├── studiohobi-website/
└── nick-simmons-website/
```

Each folder is a complete, standalone project — they don't need to live next to each other, but it's tidier.

---

## 2. Run Studio Hobi locally (sanity check)

In VS Code, open the `studiohobi-website` folder. Then open the integrated terminal (`Ctrl+\`` / `Cmd+\``) and run:

```bash
npm install      # installs Vite + Tailwind into node_modules/ (~30 sec)
npm run dev      # starts the dev server
```

You'll see output like `Local: http://localhost:5173/`. Open that in your browser — you should see the Studio Hobi landing page with hero, about, work, and contact sections. Edits to `index.html` reload instantly.

When you're done looking around, press `Ctrl+C` in the terminal to stop the dev server.

---

## 3. Push Studio Hobi to GitHub

Using **GitHub Desktop**:

1. **File → Add local repository** → choose the `studiohobi-website/` folder.
2. GitHub Desktop will say "this directory is not a Git repository" → click **"create a repository"**.
3. Set:
   - Name: `studiohobi-website`
   - Description: `studiohobi.com — independent design studio`
   - Local path: (already filled in)
   - Git ignore: **None** (your project already has a `.gitignore`)
4. Click **Create Repository**.
5. You'll see all the project files staged for the initial commit. Add a summary like `Initial commit` and click **Commit to main**.
6. Click **Publish repository** at the top. Uncheck "Keep this code private" only if you want the source public; private is fine for Netlify either way. Click **Publish Repository**.

Your code is now on GitHub at `https://github.com/<your-username>/studiohobi-website`.

---

## 4. Deploy Studio Hobi to Netlify

1. Go to https://app.netlify.com and sign in.
2. Click **Add new site → Import an existing project**.
3. Pick **GitHub** as the Git provider. (First time only, you'll authorize Netlify to access your repos. You can scope it to just the two repos if you prefer.)
4. Choose `studiohobi-website` from the list.
5. Netlify will auto-detect Vite. The fields should show:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - (These are also pinned in the project's `netlify.toml`, so Netlify will use those even if you skip this screen.)
6. Click **Deploy**.

After ~30 seconds you'll have a live URL like `https://glittering-otter-a1b2c3.netlify.app`. That's your site.

**Auto-deploy is now wired up.** Every time you push a commit to `main` on GitHub, Netlify rebuilds and redeploys automatically. No manual steps.

---

## 5. Connect studiohobi.com to the Netlify deploy

In Netlify, on your new site's dashboard:

1. **Site configuration → Domain management → Add a domain**.
2. Enter `studiohobi.com` and confirm "Yes, add domain".
3. Netlify will say something like *"To use studiohobi.com, configure your DNS"* and show you the records you need.

Now you have two ways to point the domain — **DNS at your registrar** (simpler, keep your current registrar) or **Netlify DNS** (move the whole DNS over to Netlify). I recommend **option A** since you said the two domains are at different registrars and you probably don't want to migrate them.

### Option A: Keep DNS at your current registrar (recommended)

At studiohobi.com's registrar, log in and find the DNS / DNS Records / Advanced DNS panel. Add **two** records:

| Type    | Host / Name | Value                               | TTL     |
|---------|-------------|-------------------------------------|---------|
| `A`     | `@`         | `75.2.60.5`                         | Default |
| `CNAME` | `www`       | `<your-site-name>.netlify.app`      | Default |

- `@` means "the root domain" — i.e. `studiohobi.com` itself. Some registrars want it written as the bare domain.
- The `A` record value Netlify gives you may differ from `75.2.60.5` (Netlify uses load-balanced IPs and occasionally rotates the recommended one). **Use whatever Netlify shows you in the dashboard**, not the value above.
- The `<your-site-name>.netlify.app` is the auto-generated subdomain Netlify gave you in step 4.

After saving, DNS can take anywhere from 5 minutes to a couple hours to propagate. Netlify will show a green checkmark next to the domain when it sees the change. SSL/HTTPS is then provisioned automatically by Netlify (Let's Encrypt) — usually within another minute.

### Option B: Use Netlify DNS

If you'd rather centralize DNS, click "Set up Netlify DNS" in the domain settings. Netlify gives you four nameservers like `dns1.p01.nsone.net`. At your registrar, find **Nameservers** (sometimes "Custom DNS") and replace whatever's there with Netlify's four. Then Netlify manages DNS entirely.

### Where to find DNS settings at common registrars

I don't know which registrars your two domains are at, but these are the paths for the popular ones:

- **Namecheap**: Domain List → Manage → Advanced DNS → Add New Record
- **GoDaddy**: My Products → DNS → DNS Records → Add
- **Squarespace Domains** (formerly Google Domains): Domains → your domain → DNS → DNS Records
- **Cloudflare**: Websites → your domain → DNS → Records → Add record
- **Porkbun**: Domain Management → DNS Records → Add
- **Hover**: Domains → your domain → DNS

If you tell me which registrars you're using, I can give you exact click paths.

---

## 6. Repeat for nick-simmons.com

The flow is identical, with two extra notes:

1. **Disconnect Vercel first.** Log into https://vercel.com, find the existing nick-simmons.com project, go to **Settings → Domains** and remove `nick-simmons.com` from that project. (You don't need to delete the Vercel project — just detach the domain so it doesn't fight Netlify for control.) The DNS records you'll add at the registrar will take effect once Vercel releases the domain.
2. **Use a fresh GitHub repo.** Since you said start fresh: when you `Add local repository` in GitHub Desktop, point it at the *new* `nick-simmons-website/` folder I created. The old Vercel-connected repo can stay on GitHub — just don't push to it anymore (or archive it from the GitHub web UI: Repo → Settings → scroll to Danger Zone → Archive).

After GitHub Desktop publishes the new repo, repeat steps 4 and 5: connect it to a new Netlify site, then point nick-simmons.com's DNS at Netlify the same way.

---

## 7. Day-to-day editing workflow

Once both are live:

1. Open the project folder in VS Code.
2. Edit `index.html` (text/sections) or `src/style.css` (custom CSS, though you'll rarely need it — Tailwind utility classes go directly on elements).
3. `npm run dev` to preview live.
4. In GitHub Desktop: write a commit summary → **Commit to main** → **Push origin**.
5. Netlify auto-rebuilds within ~30 seconds. Refresh the live site.

That's it — no manual deploys, no FTP, no Framer subscription.

---

## 8. Common gotchas

- **"npm: command not found"** — Node isn't installed. Install from https://nodejs.org.
- **"vite: command not found"** — You skipped `npm install`. Run it.
- **Tailwind classes not applying** — Make sure `index.html` includes `<script type="module" src="/src/main.js"></script>` and that `main.js` does `import './style.css'`. Both are already wired up in the scaffolds, but worth knowing if you restructure.
- **Netlify build fails with "command not found"** — Check `netlify.toml` is in the repo root and the Node version is set to 20.
- **DNS doesn't seem to update** — Run `dig studiohobi.com` (or use https://dnschecker.org). DNS can take up to 48 hours in the worst case but usually resolves in minutes. Browsers also cache DNS — try an incognito window.

---

## 9. What I'd do next (optional polish)

- Add a `favicon.svg` to each project's `public/` folder. The `<link rel="icon">` tag is already in the HTML, it just expects a file at `/favicon.svg`.
- For Studio Hobi, swap the placeholder copy in `index.html` for real content. Sections are already structured and styled.
- Add `<meta property="og:title">` / `<meta property="og:image">` tags for nicer link previews when the URL is shared.

Tell me when you're past step 4 on each site and I'll help with DNS for whichever registrars you're actually on.
