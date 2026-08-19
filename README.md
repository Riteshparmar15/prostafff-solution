# ProStafff Solution Private Limited — website

Static retail staffing site. Add or edit openings in `src/data/jobs.js`.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

Deploy the `dist/` folder to any static host (Netlify, Cloudflare Pages, GitHub Pages, S3).

## Connect the contact forms

1. Create a free key at [web3forms.com](https://web3forms.com).
2. Replace `YOUR_WEB3FORMS_ACCESS_KEY` in both forms inside `index.html`.

Formspree alternative: set each form `action` to `https://formspree.io/f/YOUR_FORM_ID` and `method="POST"`.
