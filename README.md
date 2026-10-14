# Solomon Grinds — unofficial website concept

A complete static website based on information checked on 11 October 2026. It is marked as an unofficial concept, uses `noindex,nofollow`, and disallows crawling in `dist/robots.txt`.

## Open locally

From this project's folder, run:

```sh
python3 -m http.server 8080 --directory dist
```

Open `http://localhost:8080/`. No npm install or framework build is required. All visitor-facing dependencies and fonts are included in `dist/assets/`.

## Edit content

- `data.py`: the published weekly class data, subject directories and Easter time blocks.
- `creative.py`: revised homepage composition and actual class examples.
- `dist/assets/creative.css`: revised type, colour, radius and layout system.
- `build.py`: page content and HTML templates. Run `python3 build.py` after editing it or `data.py`.
- `dist/assets/site.css`: responsive design system and component styling.
- `dist/assets/site.js`: filtering, clash checks, fee estimates, local email drafts and GSAP motion.
- `docs/Solomon-Grinds-Design-and-Verification.md`: research, measured comparisons, design rules, decisions and launch requirements.
- `docs/verification.json`, `docs/home-verification.json`, `docs/motion-verification.json` and `docs/state-verification.json`: raw laboratory checks.

The generator overwrites generated HTML and class-data files. It does not overwrite CSS, JavaScript, fonts or legal attribution files.

## Static hosting

Upload the **contents of `dist/`** to the hosting site's document root. Preserve all folders and `robots.txt`. The site has relative asset and internal URLs, so it also works beneath a project prefix. An enquiry draft prepares a `mailto:` link; it does not contact a server. Confirm availability directly with the business.

### Exact GitHub Pages alternative

1. Create a GitHub repository named `solomon-grinds-concept`. Keep this concept separate from the business's existing live website.
2. Upload the project files, including `dist/` and `.github/workflows/pages.yml` from this package.
3. Use `main` as the repository's default branch.
4. In **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**.
5. Open **Actions → Publish static concept → Run workflow → main → Run workflow**, or push a commit to `main`.
6. Wait for the `deploy` job to finish successfully. Use the actual `page_url` output shown by the deployment, rather than guessing a username-based URL.
7. Open that URL and test the home page, `/timetable/`, `/contact-us/` and the deep links from the footer. The workflow deploys `dist` and does not require a build command.
8. Retain `noindex,nofollow` and `robots.txt` for the concept. Do not attach `solomongrinds.ie` to this deployment.

The supplied action versions and single-job workflow were checked against [GitHub's official custom Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) on 11 October 2026.

## Before an official launch

Use the launch checklist in the report. An approved submission endpoint, responsible inbox owner, lawful data handling and current legal policies are needed before activating live enquiries. Payments currently link to Solomon's existing invoice-payment page. This package does not contain an account system, booking inventory or payment processor.

Automated QA scripts are included as evidence. Their local browser/runtime paths refer to the creation environment; to rerun elsewhere, install Playwright and axe-core, set your Chromium path, and update those paths. The public site itself has no such dependency.
