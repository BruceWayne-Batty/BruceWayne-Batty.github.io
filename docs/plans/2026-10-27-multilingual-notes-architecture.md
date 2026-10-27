# Multilingual Notes Architecture

## Decisions

- Eleventy generates a static site; GitHub Pages receives only the `_site` artifact.
- Chinese uses root routes and English uses `/en/` routes.
- Notes live in `notes/<slug>/<language>.md`; either language may be published independently.
- `translationKey` connects translations without requiring both files to exist.
- Lists, archives, navigation, metadata, sitemap entries and legacy redirects are generated at build time.
- Authors, tags, projects and site metadata use central files under `src/_data`.

## Failure Handling

The build rejects invalid languages, duplicate language/slug combinations, missing required metadata, unknown authors, unknown tags and unresolved internal links. Missing translations are valid: the unavailable language is shown as disabled and no alternate URL is emitted.

## Deployment

GitHub Actions runs `npm ci` and `npm test`, then publishes `_site`. Existing `.html` note URLs remain as `noindex` compatibility pages with canonical targets and immediate client-side redirects because GitHub Pages cannot configure HTTP 301 redirects.
