# Portfolio Voice Rewrite Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rewrite the complete bilingual portfolio in Brucy Wu's conversational, stand-up-inspired voice without weakening factual credibility.

**Architecture:** Keep the existing HTML structure and translation mechanism. Update only user-facing copy in `index.html`, preserving direct navigation while concentrating deadpan humor in hooks, section introductions, skill labels, project placeholders, notes, and the footer.

**Tech Stack:** Semantic HTML, `data-zh` / `data-en` translations, vanilla JavaScript

---

### Task 1: Rewrite identity and biography

**Files:**
- Modify: `index.html`

**Step 1:** Rewrite the availability message, hero hook, and project CTA in a concise deadpan voice.

**Step 2:** Preserve the user's game philosophy verbatim in Chinese and adapt its punchline naturally in English.

**Step 3:** Keep all education and employment facts accurate while adding one clearly non-factual aside.

**Step 4:** Rewrite the skill list with concise technology-specific jokes.

### Task 2: Rewrite unfinished content honestly

**Files:**
- Modify: `index.html`

**Step 1:** Replace fictional portfolio projects with explicit, humorous placeholders.

**Step 2:** Rewrite Notes as game, AI, bug, and solo-development article placeholders.

**Step 3:** Rewrite the footer CTA without adding contact details the user has not supplied.

### Task 3: Verify bilingual parity

**Files:**
- Test: `index.html`
- Test: `assets/js/site.js`

**Step 1:** Run `git diff --check` and `node --check assets/js/site.js`.

**Step 2:** Confirm all changed Chinese strings have meaningful English adaptations.

**Step 3:** Confirm no fictional project claim, private location, or placeholder email remains.
