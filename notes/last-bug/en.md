---
title: "Why does the “last bug” always have a family?"
description: "Why do bugs arrive in families? Notes on state, boundaries, regression tests, and debugging as a solo developer."
deck: "“Fix this one and call it a day.” Usually not a plan. More of a summoning ritual."
category: "Bug archaeology · Dev essay"
slug: "last-bug"
lang: en
translationKey: "last-bug"
author: brucy
date: 2026-10-26
updated: 2026-10-26
logNumber: 1
noteTags: [debugging, solo-development]
tags: [notes]
draft: false
layout: layouts/note.njk
permalink: "/en/notes/last-bug/index.html"
---
One of development’s most tempting illusions is that bugs are independent items on a checklist: fix one, subtract one, close the laptop at zero. In practice, debugging is closer to archaeology. You uncover a stone, dig beside it, and find an entire family tree.

They are not necessarily new bugs introduced by the fix. Often, the first failure was hiding the next. Once the door opens, you finally discover that the lights do not work either. The door has a reasonable objection to taking all the blame.

## 01 / Different symptoms, common ancestors

Imagine a game awarding a reward twice after rapid clicks. Disabling the button is the obvious fix. But if a keyboard shortcut, animation callback, or restored save can invoke the same logic, the button is only one entrance. The missing rule is deeper: this reward may be settled only once.

That is where a bug’s relatives come from. One ambiguous state or unchecked assumption produces different symptoms through different entry points. A bandage on the interface does not stop the underlying logic from bleeding somewhere else.

## 02 / Record the evidence before touching the scene

Changing code the moment an error appears feels productive. It can also turn the crime scene into a freshly renovated showroom. I would rather start with three questions: what was the state beforehand, what action was taken, and how did the result differ from the expectation? Without those answers, a fix may merely make the symptom disappear for now.

When a failure is reproducible, shorten the sequence: remove unrelated actions and fix the inputs. If randomness matters, record the seed and relevant state. When reproduction is unreliable, add useful logs instead of fifty lines saying “got here.” A log should explain who acted, in what state, and why this branch was taken. The computer already knows it got here. I need to know why.

## 03 / Tests are not certificates of good behavior

After a fix, I want more than a commit: I want a test that can catch the same class of failure. In the duplicate-reward example, the useful assertion is that triggering the same reward twice increases the balance only once. Whether the button turns gray belongs in an integration test or manual check; it cannot replace the underlying rule.

A green test suite does not mean there are no bugs. It means the conditions we wrote down produced no unexpected results. Tests are valuable not because they prove the developer is brilliant, but because they preserve today’s expensive lesson for tomorrow. Otherwise, the same trap returns under a different filename and charges tuition again.

## 04 / “Last” needs a boundary

For solo developers, debugging can also become an endless task. Not every minor flaw should block a release, but corrupted saves, duplicate charges, and broken core flows cannot be dismissed because they happen only occasionally. Prioritizing by impact and trigger conditions is more reliable than fixing whatever feels most annoying.

I would rather define the “last bug” as this: the critical risks for this round are addressed, the core flow has been checked again, and the remaining issues are recorded and accepted. It is not a declaration that errors no longer exist. It is knowing where to stop this time, and why stopping is reasonable.

> A bug having relatives is not the scary part. Meeting every one of them as a stranger, every time, is.
