---
name: baksal-beauty-images2
description: Generate, regenerate, document, and integrate OpenAI Images 2.0 assets for the BAKSAL Beauty Next.js project. Use when Codex needs clinic hero images, treatment cards, doctor portraits, skincare product images, blog thumbnails, before/after comparison references, or prompt/workflow changes using `gpt-image-2`, `images2.0.md`, `.env` image API keys, or `scripts/generate-aesthetic-assets.mjs`.
---

# BAKSAL Beauty Images 2.0

Use this skill to keep generated imagery consistent with the BAKSAL Beauty design system.

## Source Files

- Read project root `images2.0.md` for the current OpenAI image API reference when API behavior matters.
- Use `scripts/generate-aesthetic-assets.mjs` for batch website asset generation.
- Save web-ready generated assets under `public/images/`.
- Never print, commit, or expose `.env` secrets.

## API Rules

- Use `gpt-image-2` for this project unless explicitly asked otherwise.
- Prefer Image API generation for one-shot site assets.
- Use JPEG output for photographic website images unless transparency or lossless output is required.
- Respect `gpt-image-2` constraints: no transparent background, dimensions must be valid multiples of 16, and long/short ratio must stay within API limits.
- The project script accepts `OPENAI_API_KEY`, `OPEN_API_SCRET_KEY`, or `OPENAI_API_SECRET_KEY` for local compatibility.

## Prompt Direction

Always include:

- Premium Korean plastic surgery and aesthetic medicine website photography.
- Photorealistic editorial image.
- Warm champagne highlights, deep burgundy shadow mood, ivory clinical accents.
- Elegant, calm, medically trustworthy, luxury clinic atmosphere.
- No text, no logo, no watermark, no UI, no frame.

Avoid:

- Children or teen subjects.
- Explicit nudity or sensational body imagery.
- Guaranteed medical-result framing.
- Readable product labels unless specifically requested.

## Workflow

1. Decide the asset slot: hero, philosophy, pillar, treatment card, comparison, doctor, consultation, shop, blog, newsletter.
2. Match the section's aspect ratio before generating.
3. Add or update the asset entry in `scripts/generate-aesthetic-assets.mjs`.
4. Run `npm run generate:images`.
5. Verify the target page with `npm run build` and browser screenshots.
6. Keep filenames descriptive and stable because `src/i18n/dictionaries.ts` references them.

## Common Sizes

- Hero/banner: `2048x1152`, `3840x2160`
- Horizontal section image: `1536x1024`
- Portrait treatment card: `1024x1536`
- Doctor/avatar/comparison base: `1024x1024`

Read `references/prompt-recipes.md` before creating new prompt families.
