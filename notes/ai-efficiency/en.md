---
title: "I used AI to save time, then spent all afternoon prompting it"
description: "A note on prompts, acceptance criteria, and AI workflows that actually save time in solo development."
deck: "The machine produces things quickly. Whether I get to finish earlier is a separate question."
category: "AI efficiency · Dev essay"
slug: "ai-efficiency"
lang: en
translationKey: "ai-efficiency"
author: brucy
date: 2026-10-26
updated: 2026-10-26
logNumber: 2
noteTags: [ai, solo-development]
tags: [notes]
draft: false
layout: layouts/note.njk
permalink: "/en/notes/ai-efficiency/index.html"
---
“Save time with AI” sounds like a straight line: hand over the task, wait for the result, finish. In practice, it can become a loop: explain the request, spot a problem, add a constraint, spot another problem, add another constraint. Eventually you are no longer doing the task; you are studying how to make another participant understand it. This participant skips coffee and charges by the token.

## 01 / Generation speed is not delivery speed

Code generated in seconds is not necessarily ready to enter a project in seconds. It still needs to be understood, checked for dependencies, aligned with the existing structure, and tested at the edges. If longer output creates more review work, “writing more” can simply mean assigning extra work to your future self.

The useful measure is total cost: time spent explaining, waiting, revising, verifying, and maintaining the result. AI’s efficiency has to be judged across that whole chain, not by how impressively text cascades down the screen. Waterfalls are lovely. I mostly need the water to land in a cup.

## 02 / Many prompt problems are specification problems

“Make this feature good” is not a clear assignment. How good? Which interfaces must remain unchanged? Are new dependencies allowed? What should happen on failure? If I cannot answer these questions myself, the model has to guess. The more confidently it guesses, the harder the review becomes.

For an image-generation workflow, “make it more reliable” is less useful than specifying the input fields, where files are saved, how filename collisions are avoided, what an API failure returns, and that secrets must never appear in logs. This is not a magic incantation. It is bringing acceptance criteria out of your head and onto the page.

That work is not wasted even if AI never gets used. Once the task is clear, it sometimes turns out to need only a few lines changed by hand. Then change them by hand. A tool does not suffer because it was left on the bench.

## 03 / Make the task small enough to verify

I prefer using AI for bounded work: explaining unfamiliar code, listing possible edge cases, adding tests for a defined interface, or offering a few copy directions to compare. What these tasks share is not simplicity, but that their results can be checked.

For implementation work, asking what will change and why, then reviewing a small diff, is easier to control than receiving a rewrite of the entire system. For tests, check that the assertions are grounded in the requirements rather than copied from the implementation. Code and tests can misunderstand the same requirement and pass together in perfect solidarity.

As for whether a design is actually fun, AI can propose hypotheses but cannot replace players trying it. A coherent explanation is not proof of a satisfying experience. Between a beautifully described mechanic and someone wanting another round lies the whole game.

## 04 / Give optimization a stopping rule

Repeated prompting is seductive because every round feels “almost there.” But if several rounds keep correcting the same misunderstanding, change the approach: shrink the task, add a concrete example, use a deterministic script, or do it manually. Time already spent is not a reason to keep increasing the budget.

What is worth keeping is not an ever-longer universal prompt, but reusable constraints, a few reliable examples, and a way to verify the result. Efficiency accumulates when the next similar task requires a little less explanation, guessing, and rework.

> AI is most useful not when it makes me look busy, but when it helps me do less unnecessary work.
