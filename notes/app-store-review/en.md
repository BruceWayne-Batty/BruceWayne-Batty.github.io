---
title: "The app is finished. Why did Apple reject it?"
description: "A practical guide to App Store review rules 2.3, 3.1, 4.2, and 4.3, including fixes, reviewer replies, and preflight checks."
deck: "Working code passes one exam. A publishable product has another to sit. A closer look at 2.3, 3.1, 4.2, and 4.3."
category: "App Store review · Dev essay"
slug: "app-store-review"
lang: en
translationKey: "app-store-review"
author: brucy
date: 2026-10-26
updated: 2026-10-26
logNumber: 4
noteTags: [app-store, solo-development]
tags: [notes]
draft: false
layout: layouts/note.njk
permalink: "/en/notes/app-store-review/index.html"
---
It is tempting to treat publishing as the final button: finish the code, run the tests, submit, wait for a notification. The notification arrives, but it says Rejected. Apple reviews more than crashes: what you promise, how you charge, why users need the product, and why the store needs another one of it.

This note follows Apple’s official App Review Guidelines, checked on October 26, 2026; the Chinese page lists June 8, 2026 as its last update. The scenarios below are illustrative, not personal case reports, and the recommendations are neither approval guarantees nor a ranking of rejection rates. Guidelines change, especially payment rules and regional exceptions. Recheck the source before submitting. [Official guidelines ↗](https://developer.apple.com/cn/app-store/review/guidelines/#performance)

## 01 / First identify what actually failed

Other common troubleshooting areas include completeness under 2.1: crashes, placeholders, unusable review credentials, or offline backend services; user-generated content moderation under 1.2; privacy disclosures, permissions, and account deletion under 5.1; and login-service requirements under 4.8. Those matter too, but this note focuses on four other groups that often confuse developers.

-   2.3 Accurate Metadata: does the product users receive match the one you describe?
-   3.1 Payments: what are you selling, and do payment and unlocking follow the applicable rules?
-   4.2 Minimum Functionality: does it offer enough utility or lasting entertainment to deserve being an app?
-   4.3 Spam: is it materially different, rather than the same product in another outfit?

## 02 / 2.3: screenshots are not a wish list

The key word in 2.3 is accurate, not attractive. Descriptions, screenshots, previews, and privacy information must reflect the current core experience. A feature in a mockup, roadmap, or promise for next week is not a feature users actually receive after downloading.

### Promising more than you deliver, or hiding what you do

2.3.1 prohibits hidden, dormant, or undocumented features. New functionality and product changes need specific review notes and reviewer access. Examples include advertising offline recognition that requires a network, switching the app to a different business after review using a remote flag, or failing to disclose a paid module visible only to certain accounts. This may be more than inaccurate copy: it can mislead the review process.

A normal staged rollout is not automatically a violation, but it is no excuse to conceal features. Explain what a flag changes, its scope, and access steps so reviewers can inspect the real experience. Unusable credentials usually also involve 2.1; deliberately presenting a different product is not something a new password can fix.

### Payment conditions, screenshots, and keywords are promises too

2.3.2 requires clear disclosure of content requiring additional purchases. Free to download does not mean every feature is free. Paid features can be shown, but should not look immediately available at no cost. Under 2.3.3, screenshots should show the app in use, not merely covers, login screens, or splash screens. Under 2.3.4, previews should use footage captured in the app; explanatory text and narration can help, but a concept film cannot substitute for the product.

2.3.7 also warns against stuffing metadata with popular app names, unrelated trademarks, or unsupported claims; app names are limited to 30 characters. Age ratings, asset rights, fictional rather than real personal details, other mobile-platform branding, and meaningful release notes have additional requirements under 2.3.6, 2.3.9, 2.3.10, and 2.3.12. Metadata is part of the product, not a form to fill in at the last minute.

Suggested fix: use the exact submitted build to check every store claim and reproduce every screenshot. Remove nonexistent capabilities, disclose paid conditions, and document non-obvious entry points. Correct assets when the assets are wrong; change the implementation when the feature is wrong, rather than merely finding a softer adjective.

[Read section 2.3 ↗](https://developer.apple.com/cn/app-store/review/guidelines/#accurate-metadata)

## 03 / 3.1: classify what you sell before collecting money

3.1 does not simply say that every payment in an app must go through Apple. The relevant questions are the product, where it is consumed, the service model, and the applicable storefront. The default under 3.1.1 is to use in-app purchase (IAP) for unlocking digital content or functionality, such as premium features, game currency, levels, paid content, and a full version. Apple Pay is not IAP; integrating a payment SDK does not satisfy digital-goods rules.

### The same label can describe very different purchases

-   Recorded lessons consumed in the app, premium editing tools, and AI generation credits: generally digital content or functionality. Start with 3.1.1; server-side computation does not automatically exempt them from IAP.
-   Food delivery, physical goods, and services consumed outside the app: 3.1.3(e) requires payment methods other than IAP, such as Apple Pay or card payments.
-   Live tutoring between two individuals: 3.1.3(d) permits other payment methods. One-to-few and one-to-many live services must use IAP. Calling a class a consultation does not change its nature.

Reader apps, multiplatform services, services sold only to organizations, and qualifying free companion apps have different conditions under 3.1.3(a), (b), (c), and (f). In particular, multiplatform access to purchases obtained elsewhere does not mean IAP can be omitted: that provision also requires those items to be available through IAP in the app. Having a web login is not a universal exemption.

### External purchase links: do not export one region’s exception worldwide

Under 3.1.1(a) as checked for this note, buttons, external links, and purchase calls to action in US-storefront apps do not require the link entitlements described there. Other storefronts still require checking the applicable exceptions, regional entitlements, and agreements. Reader-app account links have their own conditions. This concerns external purchase links; it does not mean arbitrary payment SDKs are allowed for digital features worldwide.

Imagine an editing app displaying “buy premium more cheaply on our website” in every storefront. That may violate the rules where no exception applies. Replacing the link with a QR code or hiding the purchase in support does not change its purpose. Design the entire flow around the actual applicable storefront and authorization, not device language or IP guesses—and never conceal it only from reviewers.

### Integrating IAP is not the finish line

3.1.1 also requires a restore mechanism for restorable purchases, and credits or game currency bought through IAP must not expire. Under 3.1.2, auto-renewable subscriptions must provide ongoing value, last at least seven days, and be accessible across the user’s devices. A static one-time feature should not become a subscription merely to charge repeatedly. Upgrades and downgrades must avoid unintended duplicate subscriptions to the same content.

Suggested fix: map the product, payment entry points, entitlement activation, and restoration. Before payment, explain benefits, duration, actual charges, post-trial pricing, and auto-renewal; provide privacy-policy and applicable terms links, and check the license-agreement requirements. Test success, cancellation, failure, restoration after reinstalling, and cross-device access. Missing or unusable IAP products can also trigger 2.1(b). Importing StoreKit is not a completed purchase flow.

[Read section 3.1 ↗](https://developer.apple.com/cn/app-store/review/guidelines/#payments)

## 04 / 4.2: small scope is not the problem; thin value is

4.2 sets no minimum number of pages, tabs, or lines of code. It asks for more than a repackaged website: sufficient functionality, content, and UI to provide appropriate utility or lasting entertainment. A focused tool can be valuable; an app with many menus leading only to web links can still be thin.

### Typical risks: web wrappers, brochures, and unfinished tasks

Examples include wrapping a company website in a WebView with About and Contact pages, or listing links while sending every meaningful task to the browser. 4.2.2 also says that, apart from catalogs, apps should not simply be marketing materials, ads, web clippings, content aggregators, or collections of links. Web technology itself is not automatically disqualifying; the delivered experience matters more than the framework name.

Other details are easy to overlook: 4.2.1 says placing a model in an AR view or replaying an animation is not a rich, integrated AR experience. 4.2.3 requires apps to work independently; if extra resources are needed at first launch, disclose their size and prompt the user beforehand. A demo effect is not necessarily a deliverable product.

### 4.2.6: template services also raise the question of who submits

For apps made with commercial templates or app-generation services, 4.2.6 requires direct submission by the content provider; otherwise they will be rejected. Template services can provide tools for clients to create innovative, differentiated experiences, or consider aggregating client content in one app, rather than submitting batches on their behalf. Direct submission is a condition of this provision, not an exemption from 4.2, 4.3, or other rules.

The useful response is to complete a task, not pad the feature count. A restaurant app might move from displaying a menu to making reservations, checking status, and managing visit arrangements. A field-recording tool might connect capture, storage, organization, and export. Offline access, notifications, the camera, or system integrations can help, but none is a mandatory approval bundle. Explain why users need the app, then let the workflow demonstrate it.

[Read section 4.2 ↗](https://developer.apple.com/cn/app-store/review/guidelines/#minimum-functionality)

## 05 / 4.3: a reskin is not differentiation; original code is not immunity

4.2 asks whether the product is useful enough. 4.3 asks why another one is needed. They can overlap, but call for different responses. A fully working app can still face 4.3 if it closely duplicates existing products or splits one product into dozens of bundles.

### 4.3(a): do not clone the same app city by city

This provision explicitly discourages multiple bundle IDs for the same app: a map app for every city with only the data changed, or a news app for every team with new colors and icons. If the core experience is the same, consider a single app with city, team, school, or content selection, and offer content or features under the applicable payment rules.

### 4.3(b): mature categories need material differences or improvements

The current provision names mature categories such as dating, flashlights, sound effects, wallpapers, simple timers, and fortune telling, requiring material differences or improvements in new submissions. This is not a permanent ban on those categories. A new name, color, or background is simply not enough. “I wrote the code myself” answers who wrote it, not why users need another one.

“A simpler timer” is hard to evaluate. A rehearsal-oriented timer with multistage sequences, group synchronization, unobtrusive cues, and session records offers concrete differences in tasks and experience. That still does not guarantee approval, but gives reviewers more to assess than “we are innovative.” Differentiation must be usable in the build, not merely asserted in a reply.

Suggested fix: establish whether the rejection concerns duplicate submissions under (a) or insufficiently differentiated experience under (b). For the former, consider consolidation; for the latter, revisit the target users, workflow, content, and experience. A new bundle ID, developer account, or package is not a solution. Repeatedly submitting unchanged products can have more serious consequences.

[Read section 4.3 ↗](https://developer.apple.com/cn/app-store/review/guidelines/#spam)

## 06 / After rejection, send reproducible evidence, not a confession

Start with the exact subclause, rejection text, screenshots, device, and reproduction steps, then verify the same build. Is the problem an asset, implementation, business model, or a feature the reviewer could not find? Fix the product where needed, provide evidence for misunderstandings, and use the official appeal channel if disagreement remains. “Fixed, please approve” is insufficient, and another app’s availability does not prove compliance.

A useful response follows this order: clause and issue → changes and build number → verification steps from the home screen → test account or required resources → screenshots, recordings, and supporting details. Identify where paid labels changed for 2.3.2, how to purchase and restore under 3.1, how to complete the task for 4.2, or how to experience the differences for 4.3. Attachments support an accessible feature; they do not replace one. Keep test credentials in review communications, not public articles or screenshots.

## 07 / Keep a checklist that actually helps before submitting

-   Reviewable: stable final build, live backend, valid demo account, accessible core flows and IAP, and documented permission, regional, or hardware requirements.
-   2.3: copy and screenshots match the build; paid content is clear; ratings and privacy details are accurate; assets are authorized; significant changes and non-obvious features are documented.
-   3.1: every product has a clear payment rationale; external links follow storefront and entitlement rules; subscription disclosures are complete; purchase, cancellation, restore, and cross-device access have been tested.
-   4.2: users can complete a valuable task, not merely view marketing or open links; if an app-generation service is used, the submitting party meets 4.2.6.
-   4.3: one product has not been split into a row of content-specific bundles; material differences from existing apps can be explained and verified in the app.

Publishing is not about persuading Apple to abandon its rules. It is about meeting them and making the facts clear. 2.3 asks for honesty, 3.1 for compliant payments, 4.2 for value, and 4.3 for differentiation. Review notes reduce the cost of understanding; they cannot rescue a product whose premise does not hold up.

> Spend less time asking how to get around review, and more time asking why users need the app. One tends to produce another rejection; the other may produce a better product.
