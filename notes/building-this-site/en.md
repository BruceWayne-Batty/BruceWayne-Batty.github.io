---
title: "How this website grew"
description: "From a bilingual landing page to an Eleventy static site: the portfolio rebuild, language routes, content architecture, accessibility and publishing checks."
deck: "The homepage introduces me. Notes preserve the process. What needed rebuilding was the maintenance system between them."
category: "Website development log"
slug: "building-this-site"
lang: en
translationKey: "building-this-site"
author: brucy
date: 2026-10-27
updated: 2026-10-27
logNumber: 6
noteTags: [debugging, solo-development]
tags: [notes]
draft: false
layout: layouts/note.njk
permalink: "/en/notes/building-this-site/index.html"
---
A personal website initially looks like a layout problem: add a name, projects and contact details, then choose a font that does not look like the default template. Once the site starts carrying projects and development logs, the question changes: how many places must I edit for the next update?

This note covers the October 2026 rebuild, not the site's entire history. It is based on repository commits, current source code and build checks. Design trade-offs are not presented as undocumented production incidents, and automated validation is not mistaken for complete browser acceptance testing.

## Stage one: make the homepage explain the work

Commit `bdb7a6f` cleared the previous site on October 21. On October 22, `ed73a81` introduced a bilingual portfolio landing page using HTML, CSS and JavaScript rather than a larger application framework.

The homepage needed to answer three questions quickly: who I am, what I am making and how to reach me. Projects and notes initially appeared as entry points. A dark background, typographic hierarchy, cards and fine rules supplied the visual language. The page could have personality without relying on animation to explain its content.

The initial bilingual approach kept both languages in one document and switched them in the browser. For a small landing page, that was a reasonable starting point: one layout to maintain, with both versions of a sentence nearby. The trade-off was that language behaved like browser state rather than a directly shareable address.

**The lesson was to establish the information hierarchy before making the system more complex.** A single page was not a mistake; the content eventually needed more than one page.

## Stage two: looking usable is not enough

Commit `8464293`, on October 26, focused on accessibility and publishing assets. These were gaps between visual implementation and actual use, not necessarily failures already observed in production.

### A hidden menu can still receive keyboard focus

Moving a mobile navigation panel offscreen does not necessarily remove its links from the Tab order. A visitor can end up focusing something they cannot see.

The current implementation treats the menu as a stateful interaction:

- `aria-expanded` communicates whether it is open;
- `inert` disables the closed navigation in the mobile layout;
- opening the menu moves focus to its first link;
- Escape closes it and returns focus to the menu button;
- outside clicks, link activation and layout breakpoint changes are handled explicitly.

These details rarely appear in a visual mockup, but they determine whether the interface is actually operable.

### Animation should enhance content, not unlock it

Scroll reveals use `IntersectionObserver` and check `prefers-reduced-motion`. Reveal behavior is enabled only when supported and when the visitor has not requested reduced motion. Otherwise, content remains readable without waiting for an animation.

Section navigation batches scroll updates with `requestAnimationFrame`, uses a passive scroll listener and exposes the active location through `aria-current`. Small interaction improvements like these matter more than adding another animation.

### A page that opens is not a complete publication

This stage also added a 404 page, favicon, sharing images, robots, sitemap and a validation script. The sharing card is a 1200 × 630 PNG, with its signature and dimensions checked automatically. The website also appears in search results, chat previews and the aftermath of broken links.

## Stage three: projects and notes need their own addresses

Later on October 26, `2951f83` split Projects and Notes into standalone pages. `0fa5fe3` then added a bilingual App Store review note.

This reduced the homepage's information burden. It no longer needed to contain every project detail and long article, and links could take readers directly to a particular topic.

More pages also made the cost of handwritten HTML clearer. Navigation, footers, bilingual metadata, article cards and indexes repeat. If publishing requires editing the homepage and several lists manually, it becomes easy to publish the article but forget its entry points.

The next architectural change addressed that repetition rather than adding technology for its own sake.

## Stage four: move content production to build time

On October 27, `d6db480` introduced the multilingual Eleventy build. The current development dependencies pin Eleventy 3.1.2 and Cheerio 1.1.2. The deployed result remains HTML, CSS, JavaScript and images, with no persistent application server or database required.

### Architecture: separate content, templates, builds and browser behavior

```text
notes/<slug>/zh.md, en.md     src/_data/*.json
            \                /
          Content and structured data
                     |
          Eleventy + Nunjucks templates
                     |
     Routes / collections / validation / localization
                     |
                  _site/
                     |
                GitHub Pages
                     |
     Browser: menu, clock, navigation, progressive motion
```

Each part has a clear responsibility:

| Location | Responsibility |
| --- | --- |
| `notes/` | Markdown articles and their metadata |
| `src/_data/` | Authors, tags, projects, site and page data |
| `src/_includes/` | Shared layouts and components |
| `src/pages/` | Home, Projects, Notes, archives, sitemap and compatibility templates |
| `eleventy.config.js` | Routes, collections, filters, content validation and HTML transformation |
| `assets/` | CSS, browser scripts and images |
| `scripts/check_site.py` | Generated-site validation |
| `_site/` | Build output, not the source of manually maintained articles |

Nunjucks places content into layouts, while Eleventy discovers articles and generates collections. Cheerio processes existing bilingual attributes at build time, turning the previous dual-language structure into separate localized HTML documents.

This is a practical migration compromise: reuse useful page structures without making readers depend on client-side JavaScript to obtain the correct language. Updating an article no longer requires changing browser code.

## The important bilingual change: language is part of the URL

Chinese uses root-level routes; English lives under `/en/`.

```text
/notes/building-this-site/
/en/notes/building-this-site/
```

Each language can have its own title, description, `html lang` and self-referencing canonical URL. `hreflang` points only to language versions that actually exist, rather than assuming every article has a translation.

The build selects localized text and aria-labels, removes the other language's content blocks and cleans up bilingual attributes. The published document already has a language; it is not carrying two languages while waiting for a script to choose. Browser JavaScript can focus on interactions instead of controlling the article body.

When a translation is missing, the article page states that explicitly. It does not pretend a different destination is the translated article. Internal references use `noteLink`: prefer the requested language, fall back to the available language with a label, and fail the build if the target does not exist at all.

Old `notes-*.html`, `notes.html` and `projects.html` addresses remain as `noindex` compatibility pages. A new architecture should not announce itself by breaking old links.

## Content modeling: turn reminders into build rules

Each Note has a stable slug, with language versions linked through `translationKey`. Changing the title does not change the URL.

```text
notes/
└── building-this-site/
    ├── zh.md
    └── en.md
```

Front matter holds the title, description, deck, language, author, dates, log number, tags, draft state, layout and permalink. The build validates required fields, dates, registered authors and tags, slug syntax, file paths and permalinks. It also checks that translations agree on author, publication date, log number and tags.

This catches relationship errors as well as malformed data. Moving a file into a new directory while leaving an old slug should fail before publication, not produce a surprising address afterward.

Published collections exclude drafts and sort by date and log number. The homepage's latest three notes, article index, tag pages, author pages and previous/next navigation are generated from those collections. Adding this record should require writing the article and its metadata, not maintaining several separate indexes.

## Publishing: validate the files that will actually deploy

The local commands are:

```bash
npm run dev
npm run build
npm test
```

The build cleans its output first, preventing deleted or renamed articles from surviving as stale files. `npm test` builds the site, checks browser JavaScript syntax and runs the Python site validator.

Validation targets `_site`. It covers local files and anchors, canonical URLs, language alternatives, the sitemap, structured data, archives, the homepage's latest three notes and sharing assets. It also checks for unresolved bilingual attributes. Article `BlogPosting` JSON-LD is generated from the same article data rather than a separately maintained copy of titles and dates.

GitHub Actions installs locked dependencies, validates the site and deploys `_site` after pushes to `main`. There is no manual copying of build files into a publication directory.

These checks have limits. A valid link says nothing about visual layout. ARIA attributes alone do not prove a good screen-reader experience. Generated SEO metadata does not establish search-engine indexing. Browsers, keyboard navigation, mobile devices and real sharing previews still require manual review.

## Problems and solutions at a glance

| Problem or maintenance risk | Current approach |
| --- | --- |
| Language is browser state rather than a shareable version | Separate language URLs and build-time localized content and metadata |
| Homepage carries introductions, project details and long articles | Separate Projects, Notes and article pages |
| Shared structures and article entry points require repeated edits | Shared templates, structured data and generated collections |
| Closed mobile navigation can retain keyboard focus | `inert`, focus management, Escape and breakpoint handling |
| Motion becomes a prerequisite for reading | Feature detection, reduced-motion preferences and progressive enhancement |
| Title changes or migrations disrupt existing links | Stable slugs and compatibility pages |
| Missing translations or references produce misleading destinations | Explicit missing-translation states, `noteLink` fallback and build failures |
| Deleted articles remain in old build output | Clean `_site` before building |
| Source checks miss problems in the deployed result | Validate generated links, SEO, data and assets |

## Current boundaries and next steps

The architecture fits the present requirements: a personal introduction, project showcase, bilingual long-form notes and GitHub Pages publishing. It is not an online editing CMS. This rebuild did not add accounts, comments or a database. If those become necessary, the architecture should be reconsidered then rather than built speculatively now.

Maintenance has not disappeared. Translations still need careful review, project materials and facts need updating, and visual and assistive-technology behavior needs real testing. The domain also appears in several configuration locations, so changing it requires coordinated edits; that remains a candidate for further consolidation.

The most important result is not that the homepage is finally arranged. It is that publishing the next article feels more like writing and less like copying HTML, updating lists and checking several places for omissions.

**The homepage introduces me. Notes preserve the process. The build system makes it practical to keep doing both.**
