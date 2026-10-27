#!/usr/bin/env python3
"""Validate the generated multilingual static site without online requests."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json
import re
import struct
import sys
import xml.etree.ElementTree as ET

PROJECT = Path(__file__).resolve().parents[1]
ROOT = PROJECT / "_site"
HOST = "brucewayne-batty.github.io"
errors = []


class Document(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.ids = set()
        self.references = []
        self.meta = {}
        self.links = []
        self.h1_count = 0
        self.site_footer_count = 0
        self.html_lang = None
        self.canonical = None
        self.alternates = {}
        self.json_ld = []
        self._json_ld = False
        self._json_ld_text = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "html":
            self.html_lang = attrs.get("lang")
        if tag == "h1":
            self.h1_count += 1
        if tag == "footer" and "site-footer" in attrs.get("class", "").split():
            self.site_footer_count += 1
        identifier = attrs.get("id")
        if identifier:
            if identifier in self.ids:
                errors.append(f"{self.path.relative_to(ROOT)}: duplicate id {identifier}")
            self.ids.add(identifier)
        for key in ("href", "src"):
            if attrs.get(key):
                self.references.append(attrs[key])
        if tag == "a":
            self.links.append((attrs.get("href", ""), set(attrs.get("class", "").split())))
        if tag == "meta":
            key = attrs.get("property") or attrs.get("name") or attrs.get("http-equiv")
            if key:
                self.meta[key.lower()] = attrs.get("content", "")
        if tag == "link":
            if attrs.get("rel") == "canonical":
                self.canonical = attrs.get("href")
            elif attrs.get("rel") == "alternate" and attrs.get("hreflang"):
                self.alternates[attrs["hreflang"]] = attrs.get("href")
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self._json_ld = True
            self._json_ld_text = []

    def handle_endtag(self, tag):
        if tag == "script" and self._json_ld:
            self.json_ld.append("".join(self._json_ld_text))
            self._json_ld = False

    def handle_data(self, data):
        if self._json_ld:
            self._json_ld_text.append(data)

    handle_startendtag = handle_starttag


if not ROOT.is_dir():
    errors.append("_site is missing; run npm run build first")

documents = {}
for path in ROOT.rglob("*.html") if ROOT.is_dir() else []:
    document = Document(path)
    document.feed(path.read_text(encoding="utf-8"))
    documents[path.resolve()] = document
    if document.h1_count != 1 and path.name != "404.html" and "noindex" not in document.meta.get("robots", ""):
        errors.append(f"{path.relative_to(ROOT)}: expected exactly one h1")


def target_for(source, reference):
    url = urlsplit(reference)
    if url.scheme in ("mailto", "tel", "data"):
        return None, url.fragment
    if url.netloc and url.netloc.lower() != HOST:
        return None, url.fragment
    if url.scheme and url.scheme not in ("https", "http"):
        errors.append(f"{source.relative_to(ROOT)}: unsupported URL {reference}")
        return None, url.fragment
    url_path = unquote(url.path)
    if not url_path:
        target = source
    elif url_path.startswith("/"):
        target = ROOT / url_path.lstrip("/")
    else:
        target = source.parent / url_path
    if url_path.endswith("/") or target.is_dir():
        target /= "index.html"
    target = target.resolve()
    try:
        target.relative_to(ROOT)
    except ValueError:
        errors.append(f"{source.relative_to(ROOT)}: reference outside site: {reference}")
        return None, url.fragment
    return target, unquote(url.fragment)


for source, document in documents.items():
    for reference in document.references:
        target, fragment = target_for(source, reference)
        if target is None:
            continue
        if not target.is_file():
            errors.append(f"{source.relative_to(ROOT)}: missing resource {reference}")
        elif fragment and target.suffix == ".html":
            target_document = documents.get(target)
            if target_document and fragment not in target_document.ids:
                errors.append(f"{source.relative_to(ROOT)}: missing anchor {reference}")

    noindex = "noindex" in document.meta.get("robots", "")
    if source.name == "404.html" and document.site_footer_count != 1:
        errors.append("404.html: expected exactly one shared site footer")
    if not noindex:
        if document.site_footer_count != 1:
            errors.append(f"{source.relative_to(ROOT)}: expected exactly one shared site footer")
        if document.html_lang not in ("zh-CN", "en"):
            errors.append(f"{source.relative_to(ROOT)}: invalid or missing html lang")
        for key in ("description", "og:title", "og:description", "og:url", "og:image", "og:image:alt", "twitter:card", "twitter:title", "twitter:description", "twitter:image"):
            if not document.meta.get(key):
                errors.append(f"{source.relative_to(ROOT)}: missing metadata {key}")
        if not document.canonical:
            errors.append(f"{source.relative_to(ROOT)}: missing canonical")
        if document.meta.get("og:url") != document.canonical:
            errors.append(f"{source.relative_to(ROOT)}: og:url differs from canonical")
        if document.meta.get("og:image") != document.meta.get("twitter:image"):
            errors.append(f"{source.relative_to(ROOT)}: share preview images differ")
        if "x-default" not in document.alternates:
            errors.append(f"{source.relative_to(ROOT)}: missing x-default alternate")
        for alternate in document.alternates.values():
            target, _ = target_for(source, alternate)
            if target is not None and not target.is_file():
                errors.append(f"{source.relative_to(ROOT)}: alternate does not exist {alternate}")
    for payload in document.json_ld:
        try:
            parsed = json.loads(payload)
            if parsed.get("@type") == "BlogPosting" and not all(parsed.get(key) for key in ("headline", "datePublished", "author", "url")):
                errors.append(f"{source.relative_to(ROOT)}: incomplete BlogPosting JSON-LD")
        except json.JSONDecodeError as error:
            errors.append(f"{source.relative_to(ROOT)}: invalid JSON-LD: {error}")


def document_at(route):
    return documents.get((ROOT / route.lstrip("/") / "index.html").resolve())


for language, prefix in (("zh", ""), ("en", "en/")):
    home = document_at(prefix)
    notes = document_at(f"{prefix}notes")
    if not home or not notes:
        errors.append(f"missing {language} home or notes listing")
        continue
    home_notes = [href for href, classes in home.links if "note-row" in classes]
    listed_notes = [href for href, classes in notes.links if "note-row" in classes]
    if len(home_notes) != min(3, len(listed_notes)):
        errors.append(f"{language} homepage must show the latest three available notes")
    if not set(home_notes).issubset(listed_notes):
        errors.append(f"{language} homepage notes are not present in its notes listing")

try:
    sitemap = ET.parse(ROOT / "sitemap.xml")
    locations = {node.text for node in sitemap.findall("{http://www.sitemaps.org/schemas/sitemap/0.9}url/{http://www.sitemaps.org/schemas/sitemap/0.9}loc")}
    canonical_urls = {document.canonical for document in documents.values() if document.canonical and "noindex" not in document.meta.get("robots", "")}
    if locations != canonical_urls:
        errors.append(f"sitemap URLs differ from canonical pages (missing {canonical_urls - locations}, extra {locations - canonical_urls})")
except (ET.ParseError, OSError) as error:
    errors.append(f"sitemap.xml: {error}")

robots = (ROOT / "robots.txt").read_text(encoding="utf-8") if (ROOT / "robots.txt").is_file() else ""
if f"Sitemap: https://{HOST}/sitemap.xml" not in robots:
    errors.append("robots.txt: missing sitemap declaration")

try:
    image = (ROOT / "assets/images/social-card.png").read_bytes()
    if image[:8] != b"\x89PNG\r\n\x1a\n" or struct.unpack(">II", image[16:24]) != (1200, 630):
        errors.append("social-card.png: expected a 1200 x 630 PNG")
except (OSError, struct.error) as error:
    errors.append(f"social-card.png: {error}")

for path in documents:
    text = path.read_text(encoding="utf-8")
    if re.search(r"data-(?:zh|en|aria-zh|aria-en)=", text) and path.name != "404.html":
        errors.append(f"{path.relative_to(ROOT)}: unresolved bilingual attributes")
    if text.lower().count("<!doctype html>") != 1:
        errors.append(f"{path.relative_to(ROOT)}: expected one doctype")

if errors:
    print("Site check FAILED:\n" + "\n".join(f"- {error}" for error in errors))
    sys.exit(1)
print(f"Site check passed: {len(documents)} HTML pages, multilingual SEO, local links, archives, structured data and sharing assets.")
