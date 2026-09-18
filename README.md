# Software & Security Engineering Portfolio

A responsive, dark personal portfolio for a Georgia Tech student. Built with React, TypeScript, Vite, Tailwind CSS v4, and Lucide icons. No backend, tracking, external fonts, or runtime services are required.

## Run locally

Use Node.js 22.12+ (Node 22 LTS is used in CI).

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To check a production build:

```sh
npm run build
npm run preview
```

`npm run build` runs strict TypeScript checking before generating `dist/`. `npm run typecheck` checks types separately. Commit `package-lock.json` so CI can install the same dependencies using `npm ci`.

## Make it yours

Edit **`src/data/portfolio.ts`** for your name, initials, introduction, about text, social links, email, resume, experience, skills, education, optional activities, and search/social metadata. Edit **`src/data/projects.ts`** for projects. Components live in `src/components/`; the design and responsive rules are in `src/styles.css`.

Before publishing:

- Replace `Your Name`, `YN`, and every `REPLACE_ME` value with your own details.
- Set `email` to your real email address. The contact button generates a `mailto:` link.
- Set `githubUrl` and `linkedinUrl` to your full profile URLs.
- Replace the example experience with your actual roles and accomplishments; remove `placeholder: true` once accurate. An empty experience array removes the sample card.
- Review every skill and set `skillsAreExamples: false` only once the list reflects your experience.
- Update degree and graduation details. GPA, coursework, and additional education details are optional; blank values stay hidden.
- Replace all three illustrative projects with work you actually built. Sample concepts are explicitly labeled and do not claim completed work.
- Update `seo.title` and `seo.description`. Vite injects these into HTML at build time, including Open Graph tags, so crawlers do not need JavaScript for metadata.
- Replace `public/favicon.svg` with your own icon if desired.

Empty values, `REPLACE_ME`, and `example.com` destinations display disabled controls with a “Not configured yet” tooltip. They do not navigate to fake profiles or create placeholder emails. Configured HTTP(S) links open in a new tab with `noopener noreferrer`. Root-relative resume paths open in the current tab. JavaScript and other unsupported URL schemes are rejected.

### Add your resume

Place your PDF at `public/resume.pdf`, then set `resumeUrl: '/resume.pdf'` in `portfolio.ts`. A full HTTPS resume URL also works. Do not configure the local path before adding the file.

### Add a project

Add an object to the `projects` array; no component edits needed:

```ts
{
  id: 'unique-project-id',
  name: 'Your project',
  category: 'FULL STACK / WEB',
  description: 'What you built, the problem it solves, and your contribution.',
  technologies: ['React', 'TypeScript'],
  githubUrl: 'https://github.com/your-handle/your-repository',
  demoUrl: '', // Disabled when no public demo exists.
  featured: true,
  placeholder: false,
  illustration: 'layers', // 'network', 'terminal', or 'layers'
  // Optional: place image in public/projects/ and provide meaningful alt text.
  // image: { src: '/projects/your-project.webp', alt: 'Description of the project interface' },
}
```

The decorative illustrations are CSS and Lucide icons, with no stock images or extra animation dependencies. An optional image replaces the illustration. Long descriptions and tags wrap naturally.

### Activities and hackathons

`activities: []` hides the section. Add actual entries with `name`, `role`, `date`, and `description`. The config contains a commented example for JPMorgan Chase Code for Good; participation is not assumed.

## GitHub Pages deployment

The repository is intended for a `username.github.io` site, so `vite.config.ts` uses `base: '/'`. Section links are local anchors and need no SPA routing fallback.

1. In the GitHub repository, open **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**.
2. Commit the source and lockfile, then push to `main`.
3. The workflow in `.github/workflows/deploy.yml` installs dependencies, type-checks and builds, uploads `dist/` as a Pages artifact, then deploys it with the official Pages action.
4. Check the **Actions** tab for the deployment result and site URL. You can also run the workflow manually.

This follows [GitHub’s custom Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages). Only the deploy job gets Pages and OIDC write permissions. Built files and dependencies are ignored by Git; do not commit `dist/` or `node_modules/`.

If you later use a project repository hosted under `/repository-name/`, update Vite's base and root-relative asset/resume paths accordingly. That is not needed for this user-site repository.

## Accessibility and verification

Includes semantic sections, a skip link, one primary heading, keyboard focus rings, labeled icon links, Escape-to-close mobile navigation, and reduced-motion support. The mobile menu uses normal document navigation rather than trapping keyboard focus.

After content edits, run `npm run build`, preview at mobile and desktop widths, check each destination, and ensure your resume and project images load. No secrets or environment configuration are needed; all portfolio data is public. `.env` files are ignored.
