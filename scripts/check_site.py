#!/usr/bin/env python3
"""Check the static site without installing third-party dependencies."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re
import struct
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
HOST = "brucewayne-batty.github.io"
errors = []


class Document(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.ids = set()
        self.references = []
        self.h1_count = 0
        self.meta = {}

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        identifier = attrs.get("id")
        if identifier:
            if identifier in self.ids:
                errors.append(f"{self.path.name}: duplicate id {identifier}")
            self.ids.add(identifier)
        if tag == "h1":
            self.h1_count += 1
        for key in ("href", "src"):
            if key in attrs:
                self.references.append(attrs[key])
        if tag == "meta":
            key = attrs.get("property") or attrs.get("name")
            self.meta[key] = attrs.get("content", "")
            if key in ("og:image", "twitter:image"):
                self.references.append(attrs.get("content", ""))
        for pair in (("data-zh", "data-en"), ("data-aria-zh", "data-aria-en")):
            if any(key in attrs for key in pair) and not all(attrs.get(key, "").strip() for key in pair):
                errors.append(f"{self.path.name}: incomplete bilingual attributes on <{tag}>")
        if "aria-controls" in attrs:
            self.references.extend("#" + item for item in attrs["aria-controls"].split())

    handle_startendtag = handle_starttag


documents = {}
for path in ROOT.glob("*.html"):
    document = Document(path)
    document.feed(path.read_text(encoding="utf-8"))
    documents[path.resolve()] = document
    if document.h1_count != 1:
        errors.append(f"{path.name}: expected exactly one h1")


def check_reference(source, reference):
    if not reference or reference == "#":
        errors.append(f"{source.name}: empty or placeholder reference")
        return
    url = urlsplit(reference)
    if url.scheme in ("mailto", "tel", "data"):
        return
    if url.netloc and url.netloc.lower() != HOST:
        return  # External destinations need a separate online check.
    if url.scheme and url.scheme not in ("https", "http"):
        errors.append(f"{source.name}: unsupported URL {reference}")
        return
    path = unquote(url.path)
    if not path:
        target = source
    elif path.startswith("/"):
        target = ROOT / path.lstrip("/")
    else:
        target = source.parent / path
    target = target.resolve()
    if not target.is_relative_to(ROOT):
        errors.append(f"{source.name}: reference outside site: {reference}")
        return
    if target.is_dir():
        target = target / "index.html"
    if not target.is_file():
        errors.append(f"{source.name}: missing resource {reference}")
    elif url.fragment:
        document = documents.get(target)
        if document and unquote(url.fragment) not in document.ids:
            errors.append(f"{source.name}: missing anchor {reference}")


for source, document in documents.items():
    for reference in document.references:
        check_reference(source, reference)
for source in (ROOT / "assets/css").glob("*.css"):
    pattern = r'''url\(\s*(?:"([^"]*)"|'([^']*)'|([^\s)]+))\s*\)'''
    for match in re.finditer(pattern, source.read_text(), re.IGNORECASE):
        check_reference(source, next(value for value in match.groups() if value is not None))

index = documents[ROOT / "index.html"]
for key in ("description", "og:title", "og:description", "og:url", "og:image", "og:image:alt", "twitter:card", "twitter:image"):
    if not index.meta.get(key):
        errors.append(f"index.html: missing metadata {key}")
if index.meta.get("og:image") != index.meta.get("twitter:image"):
    errors.append("index.html: share preview images differ")

try:
    sitemap = ET.parse(ROOT / "sitemap.xml")
    locations = sitemap.findall("{http://www.sitemaps.org/schemas/sitemap/0.9}url/{http://www.sitemaps.org/schemas/sitemap/0.9}loc")
    if not locations:
        errors.append("sitemap.xml: no URLs")
    for location in locations:
        url = urlsplit(location.text or "")
        if url.scheme != "https" or url.netloc != HOST:
            errors.append("sitemap.xml: unexpected domain or protocol")
        check_reference(ROOT / "sitemap.xml", location.text or "")
except (ET.ParseError, OSError) as error:
    errors.append(f"sitemap.xml: {error}")

if f"Sitemap: https://{HOST}/sitemap.xml" not in (ROOT / "robots.txt").read_text():
    errors.append("robots.txt: missing sitemap declaration")

try:
    image = (ROOT / "assets/images/social-card.png").read_bytes()
    if image[:8] != b"\x89PNG\r\n\x1a\n" or struct.unpack(">II", image[16:24]) != (1200, 630):
        errors.append("social-card.png: expected a 1200 x 630 PNG")
except (OSError, struct.error) as error:
    errors.append(f"social-card.png: {error}")

if errors:
    print("Site check FAILED:\n" + "\n".join(f"- {error}" for error in errors))
    sys.exit(1)
print(f"Site check passed: {len(documents)} HTML pages, local resources, anchors, bilingual attributes, SEO and sharing assets.")
