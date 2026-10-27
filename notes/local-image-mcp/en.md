---
title: "Local Image MCP: Bringing Images Back to the Working Directory"
description: "A development note grounded in Local Image MCP's commits and code: two image protocols, New API routing, local files, and workflow and safety changes still in the working tree."
deck: "Calling an image model is only the beginning. Protocol differences, source images, and output files need a place in the workflow too."
category: "MCP DEVELOPMENT LOG"
slug: "local-image-mcp"
lang: en
translationKey: "local-image-mcp"
author: brucy
date: 2026-10-27
updated: 2026-10-27
logNumber: 5
noteTags: [ai, mcp, solo-development]
tags: [notes]
draft: false
layout: layouts/note.njk
permalink: "/en/notes/local-image-mcp/index.html"
---
An image in a chat window and an image in a project folder are two different definitions of done. The first means the model has answered. The second means the next tool can use the result. Downloading it, finding it, and copying its path rarely requires much expertise. It does require a remarkably reliable interruption of whatever you were thinking about.

Local Image MCP bridges that gap: an MCP client calls a remote image model, and the result becomes a local file. “Local” describes the service and file workflow, not on-device inference. This is not a new assignment for the GPU.

This note follows four repository commits and the current source. There are uncommitted changes in the working tree, so those are called out separately. Code is evidence of an implementation, not an automatic certificate that a live provider has passed an end-to-end test.

## A bridge, not another chat interface

The project uses TypeScript, Node.js 20+, and the MCP SDK over stdio. The entry point loads configuration and starts the server. Zod describes tool inputs; a separate client handles image requests; an output module writes files. The path is straightforward: MCP call → parameters and configuration → protocol request → image result → local file and tool response.

The useful part of this separation is not a tidy diagram. It is being able to investigate a network failure without also guessing what the filesystem did. The MCP layer makes the operation callable, the client speaks to the provider, and the output module gives the result a place on disk. Each job is ordinary. Combining them tends to make the failures less ordinary.

## Image compatibility means two distinct routes

The OpenAI route uses the Images API: JSON for generation, multipart form data for editing. An image response can contain Base64 or a URL. A URL needs another download before it counts as a local result. Gemini uses generateContent instead, with text and images inside contents and parts. The client extracts inlineData images and retains accompanying text.

Switching routes is not just replacing a GPT model name with a Gemini name. Uploads, response structures, and the placement of aspect-ratio and size options differ. The implementation normalizes results while keeping the request adapters separate. Shared workflow does not require pretending the protocols are identical.

For New API-style gateways, configurable base URLs and careful endpoint construction do much of the work. The URL helper handles existing /v1 and /v1beta suffixes rather than stacking version prefixes. Requests still go through the appropriate protocol endpoint. A gateway describing itself as compatible does not establish that every routed model supports every parameter; routing and model capabilities remain configuration responsibilities.

## Four commits, a few concrete changes

acd7e85 on September 8, 2026 is the initial commit. The September 11 Local Implement commit, 983dba5, develops local integration through configuration helpers, startup instructions, and URL and output handling. The problem is no longer only what to POST. It also includes how an MCP client launches the process and where the files end up.

de4dde3 on October 21 adds image editing. The actual diff introduces source-image loading, OpenAI multipart edits, Gemini image-and-text input, and the image\_edit tool. Generation asks for a new image. Editing asks to continue from this one. That difference requires an input pipeline, not merely another label in the tool list.

b60c283 on October 22 makes a smaller, specific change: configuration code and examples move the default OpenAI image model from gpt-image-1.5 to gpt-image-2.5-sunburst. The Gemini default remains gemini-3.1-flash-image. The commit contains no quality or speed comparison, nor proof that this model name works on every compatible service. A model-name update does not come with a complimentary benchmark legend.

## From source images to files the next step can find

The current input path accepts local paths (including ~/), public HTTP(S) URLs, Base64 data URLs, and raw Base64. Source images are restricted to PNG, JPEG, or WebP. Each source becomes image bytes and a MIME type before entering an adapter. OpenAI edits upload form data; Gemini edits use inlineData. The working tree adds multi-reference and batch editing: multiple references go into one request, whereas batch editing processes source images sequentially and records each success or error. Those are different operations, and the latter is not automatic parallelism.

Outputs need the same kind of normalization. Files go into the configured directory; without an override, output resolves relative to the server process's working directory. Tools return image content, readable information, and structured results containing saved paths. For the next local tool, a reliable path beats recovering an image from the chat. The directory used to launch the process is consequently part of the workflow, not incidental scenery.

The uncommitted output implementation also aligns extensions with image types, sanitizes filename prefixes, handles collisions, and uses exclusive creation to avoid silently replacing an older result. None of this improves composition. It does stop the second image from turning the first into a memory.

## The next layer is still in the working tree

Beyond generate\_image and image\_edit, the uncommitted server adds batch\_image\_edit, multi\_image\_reference, image\_edit\_continue, image\_edit\_history, and server\_info. Session records persist in .image-mcp-sessions under the output directory. Editing can continue from an earlier version, inspect history, or branch from a specified parent. Continuity comes from the parent image, prompt context, and constraints, not a provider-native chat session.

A more interesting choice than tool count is when a version becomes real: the session advances only after both the API request and file saving succeed. Failure does not add a version. Batch editing, meanwhile, requests and saves each item separately, allowing partial success. One rule keeps nonexistent images out of history; the other stops the last failed item from taking earlier work with it. Within a single multi-image save, the output module also removes files already written if that save fails.

Alongside the existing negative-prompt option, these changes expose background, output format, compression, and input fidelity, with protocol-specific restrictions. Masks and inputFidelity belong to OpenAI editing; negative prompts are appended to the text prompt. Sending an option correctly does not mean every compatible gateway will honor it.

These capabilities are present in the current code but not in the four commits above. Distinguishing “implemented in my working tree” from “included in the committed version” is a very inexpensive way to keep a development note honest.

## Defaults are a starting point

Environment variables take priority over the local JSON config, followed by field defaults. Both NEW\_API\_BASE\_URL and NEW\_API\_KEY are required. Without explicit settings, the protocol is OpenAI and the model is gpt-image-2.5-sunburst; the Gemini default is gemini-3.1-flash-image. Model names still need to match actual gateway routes, and calls can override the model. The timeout defaults to 120 seconds. IMAGE\_MCP\_CONFIG selects the config file, while IMAGE\_OUTPUT\_DIR controls where results are saved.

Configuration validates the protocol, key, and timeout. Requests report HTTP status and truncated provider error details, with an explicit timeout message. The MCP layer converts exceptions into tool results marked isError, and an empty image response is not treated as a successful save. The aim is a failure that can be investigated. “Something went wrong” is polite, but has few other qualifications.

## Local does not automatically mean safe

The key comes from configuration or the environment, not from tool-call arguments. Environment variables can keep it out of project files; a local JSON config still contains plaintext credentials and must not be committed or shared. Source images go to remote services. A local MCP process is not a promise that assets stay on the machine, nor does it impose a project-directory sandbox on files the process can read.

The working-tree download module validates HTTP(S) addresses, rejects embedded credentials and private-network targets, checks each redirect, limits downloads to 20 MiB, and checks image signatures. Its own comment draws an important boundary: DNS validation is not address pinning. Resisting DNS rebinding also needs an egress policy or a transport pinned to the validated address. These are defenses, not a certificate declaring SSRF permanently retired.

Collision protection does not replace restricted process permissions and a sensible output directory. Provider error details also enter error messages; they should be reviewed before appearing in public logs. Safety and usability are not competing product categories. Safety just tends to have less photogenic screenshots.

## What it is, and what comes next

This is a local MCP bridge, not an offline generator, a full image editor, or a hosted service. Its adapters do not make all models equivalent, and local session records are not a complete asset-management or backup system. The repository contains request and output tests, but this note does not run the source project's suite or verify live Gemini, OpenAI, or New API services. It therefore makes no claim of end-to-end success.

Useful next steps include reproducible compatibility tests for specific gateways, clearer parameter-capability documentation, tighter input-path permissions, and better credential and error-detail handling. Session-record migration and cleanup, resource limits, and a hardened download transport are also candidates. These are directions for further work, not future features quietly written in the present tense.

> A tool like this does not have to generate one more image to be useful. Making someone search the Downloads folder one fewer time can count too.

Connecting a model is the beginning. Much of the actual development happens in the parts that do not deserve a screenshot: one fewer duplicate URL prefix, one more useful error message, and an image on disk that the next step can actually find.
