---
title: "Solo development: holding the meeting, doing the work, and zoning out"
description: "Why does a solo developer still need meetings? A note on switching roles, project scope, and finishing games."
deck: "The team has one person. The disagreements can fill an entire department."
category: "Solo development · Dev essay"
slug: "solo-development"
lang: en
translationKey: "solo-development"
author: brucy
date: 2026-10-26
updated: 2026-10-26
logNumber: 3
noteTags: [solo-development, game-development]
tags: [notes]
draft: false
layout: layouts/note.njk
permalink: "/en/notes/solo-development/index.html"
---
The freedom of solo development is easy to explain: nobody tells you what you must do today. So is the difficulty: nobody tells you what you must do today. You choose the direction, execute it, and decide whether “doing some research” is actually avoiding the hard part. With the boss and employee being the same person, there is very little room to pass the blame.

## 01 / One person does not mean one role

The designer wants deeper systems. The programmer wants cleaner architecture. The artist wants the game to stop looking like a debug screen. The producer wants to know whether there will be something playable this week. All of these voices can live in one head, and each has a perfectly reasonable case.

The problem is not the number of roles, but switching between them constantly. Halfway through coding, you adjust the palette. The palette suggests better names. The naming cleanup inspires a redesign of the core mechanic. The day feels full, but the project has received a stationary massage: everything was touched, very little moved forward.

I prefer separating “decide what to do” from “make it happen” for a while. Use a short planning period to choose the goal, then record new ideas during execution without letting them take over. Ideas deserve to be saved. They do not all deserve an emergency pass.

## 02 / A task should reveal where it ends

“Improve the combat system” looks like a task but behaves like a room with an endlessly renewable lease. What counts as improved? Damage calculation, enemy behavior, feedback animations, and balance can all move in. No matter how long you work, it can still be declared unfinished.

“The player can finish one battle, receive the correct win or loss result, and return to the next step” has a clearer boundary. It does not guarantee fun combat, but it creates a complete loop that can be checked. Then ask separately: do decisions matter, is feedback understandable, and where does the pacing drag? Each question is easier to act on than “polish it some more.”

## 03 / Scope control protects your future self

A feature rarely costs only the time needed to implement it. It also needs interface integration, rule explanations, content, save handling, tests, and peaceful coexistence with other systems. On arrival it is “just one little addition.” During maintenance it becomes “who put this thing here?” The answer is usually in the mirror.

Cutting scope should not mean cutting every distinctive feature. It means identifying the experience most worth keeping and concentrating resources there. If the core appeal is one tense decision, ten peripheral systems may be less valuable than making that decision’s costs and feedback clear. More content does not automatically create a richer experience.

Solo development does not mean rejecting outside feedback. Watching someone play a bounded build—where they hesitate, misunderstand, or lose interest—can be more useful than another week of thinking alone. Watch first, ask second, and resist explaining immediately. An experience that works only with the developer standing beside it still has some distance to go.

## 04 / Stopping work is part of the workflow

Working alone makes it easy to interpret every pause as falling behind. But the brain is not a server that keeps producing useful output just because it stays online. When tired, a simple problem can look like an architectural crisis. Tomorrow it may turn out to be a reversed condition. Staying late to prove today’s effort can create extra work for tomorrow.

A few handoff notes at the end of the day can be more useful than forcing one more change: what is done, what remains, and which file to open first next time. Tomorrow’s self does not have to excavate the project, and today’s self can safely zone out. A one-person team still needs a handoff.

> Solo development is not about proving one person can do everything. It is about deciding which things are worth that person finishing.
