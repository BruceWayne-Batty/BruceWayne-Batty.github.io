import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";

const ROOT = process.cwd();
const SITE_URL = "https://brucewayne-batty.github.io";

function localePath(route, language) {
  const normalized = route.replace(/^\/+|\/+$/g, "");
  const suffix = normalized ? `/${normalized}/` : "/";
  return language === "en" ? `/en${suffix}` : suffix;
}

function notePath(slug, language) {
  return localePath(`notes/${slug}`, language);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
  })[character]);
}

function sortedNotes(items, language) {
  return items
    .filter((item) => !item.data.draft && item.data.lang === language)
    .sort((left, right) => right.date - left.date || right.data.logNumber - left.data.logNumber);
}

export default function (eleventyConfig) {
  const authors = JSON.parse(fs.readFileSync(path.join(ROOT, "src/_data/authors.json"), "utf8"));
  const tagDefinitions = JSON.parse(fs.readFileSync(path.join(ROOT, "src/_data/tagDefinitions.json"), "utf8"));

  eleventyConfig.addPassthroughCopy({ assets: "assets" });
  eleventyConfig.addPassthroughCopy("robots.txt");

  eleventyConfig.addCollection("publishedNotes", (collectionApi) => {
    const notes = collectionApi.getFilteredByTag("notes");
    const identities = new Set();
    const translations = new Map();
    for (const item of notes) {
      const data = item.data;
      for (const field of ["title", "description", "deck", "category", "slug", "lang", "translationKey", "author", "date", "updated", "logNumber", "noteTags"]) {
        if (data[field] === undefined || data[field] === "") throw new Error(`${item.inputPath}: missing required field ${field}`);
      }
      if (!["zh", "en"].includes(data.lang)) throw new Error(`${item.inputPath}: unsupported language ${data.lang}`);
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug) || data.translationKey !== data.slug) {
        throw new Error(`${item.inputPath}: slug and translationKey must be the same kebab-case value`);
      }
      if (!(data.date instanceof Date) || Number.isNaN(data.date.valueOf())) throw new Error(`${item.inputPath}: invalid date`);
      if (!(data.updated instanceof Date) || Number.isNaN(data.updated.valueOf())) throw new Error(`${item.inputPath}: invalid updated date`);
      if (!Number.isInteger(data.logNumber) || data.logNumber < 1) throw new Error(`${item.inputPath}: logNumber must be a positive integer`);
      if (!Array.isArray(data.noteTags) || !data.noteTags.length) throw new Error(`${item.inputPath}: noteTags must be a non-empty array`);
      if (!authors[data.author]) throw new Error(`${item.inputPath}: unknown author ${data.author}`);
      for (const tag of data.noteTags) {
        if (!tagDefinitions[tag]) throw new Error(`${item.inputPath}: unknown tag ${tag}`);
      }
      const identity = `${data.lang}:${data.slug}`;
      if (identities.has(identity)) throw new Error(`${item.inputPath}: duplicate language and slug ${identity}`);
      identities.add(identity);
      const expectedPath = `notes/${data.slug}/${data.lang}.md`;
      if (!item.inputPath.replace(/^\.\//, "").endsWith(expectedPath)) throw new Error(`${item.inputPath}: expected path ${expectedPath}`);
      const expectedPermalink = `${notePath(data.slug, data.lang)}index.html`;
      if (data.permalink !== expectedPermalink) throw new Error(`${item.inputPath}: permalink must be ${expectedPermalink}`);
      const siblings = translations.get(data.translationKey) || [];
      siblings.push(item);
      translations.set(data.translationKey, siblings);
    }
    for (const [translationKey, siblings] of translations) {
      if (siblings.length < 2) continue;
      const [first, second] = siblings;
      for (const field of ["author", "logNumber"]) {
        if (first.data[field] !== second.data[field]) throw new Error(`${translationKey}: translations disagree on ${field}`);
      }
      if (first.date.toISOString() !== second.date.toISOString()) throw new Error(`${translationKey}: translations disagree on date`);
      if ([...first.data.noteTags].sort().join() !== [...second.data.noteTags].sort().join()) throw new Error(`${translationKey}: translations disagree on noteTags`);
    }
    return notes.filter((item) => !item.data.draft);
  });

  eleventyConfig.addFilter("localePath", localePath);
  eleventyConfig.addFilter("notePath", notePath);
  eleventyConfig.addFilter("absoluteUrl", (url) => `${SITE_URL}${url}`);
  eleventyConfig.addFilter("localeNotes", sortedNotes);
  eleventyConfig.addFilter("limit", (items, count) => items.slice(0, count));
  eleventyConfig.addFilter("translationFor", (items, translationKey, language) =>
    items.find((item) => !item.data.draft && item.data.translationKey === translationKey && item.data.lang === language));
  eleventyConfig.addFilter("tagNotes", (items, tag, language) =>
    sortedNotes(items, language).filter((item) => item.data.noteTags.includes(tag)));
  eleventyConfig.addFilter("authorNotes", (items, author, language) =>
    sortedNotes(items, language).filter((item) => item.data.author === author));
  eleventyConfig.addFilter("previousNote", (items, inputPath, language) => {
    const notes = sortedNotes(items, language).reverse();
    return notes[notes.findIndex((item) => item.inputPath === inputPath) - 1];
  });
  eleventyConfig.addFilter("nextNote", (items, inputPath, language) => {
    const notes = sortedNotes(items, language).reverse();
    return notes[notes.findIndex((item) => item.inputPath === inputPath) + 1];
  });
  eleventyConfig.addFilter("displayDate", (date, language) => new Intl.DateTimeFormat(
    language === "zh" ? "zh-CN" : "en-GB",
    { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "UTC" }
  ).format(date));
  eleventyConfig.addFilter("padNumber", (value) => String(value).padStart(2, "0"));
  eleventyConfig.addFilter("blogPostingJson", (title, description, language, date, updated, url, image, author) => JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    inLanguage: language === "zh" ? "zh-CN" : "en",
    datePublished: date.toISOString(),
    dateModified: updated.toISOString(),
    url: `${SITE_URL}${url}`,
    image: `${SITE_URL}${image}`,
    author: { "@type": "Person", name: author.name[language], url: author.url }
  }).replace(/</g, "\\u003c"));

  eleventyConfig.addNunjucksShortcode("noteLink", (slug, text, language = "zh") => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`noteLink received invalid slug: ${slug}`);
    if (!["zh", "en"].includes(language)) throw new Error(`noteLink received invalid language: ${language}`);
    const preferred = path.join(ROOT, "notes", slug, `${language}.md`);
    const fallbackLanguage = language === "zh" ? "en" : "zh";
    const fallback = path.join(ROOT, "notes", slug, `${fallbackLanguage}.md`);
    if (fs.existsSync(preferred)) return `<a href="${notePath(slug, language)}">${escapeHtml(text)}</a>`;
    if (fs.existsSync(fallback)) return `<a href="${notePath(slug, fallbackLanguage)}" lang="${fallbackLanguage === "zh" ? "zh-CN" : "en"}">${escapeHtml(text)} <small>(${fallbackLanguage.toUpperCase()})</small></a>`;
    throw new Error(`noteLink references missing note: ${slug}`);
  });

  eleventyConfig.addTransform("localize-static-pages", function (content) {
    if (!this.page.outputPath?.endsWith(".html")) return content;
    if (path.basename(this.page.outputPath) === "404.html") return content;
    const language = this.page.outputPath.includes(`${path.sep}en${path.sep}`) ? "en" : "zh";
    const $ = cheerio.load(content, { decodeEntities: false });
    $("html").attr("lang", language === "zh" ? "zh-CN" : "en");
    $("[data-zh][data-en]").each((_, element) => {
      const selected = $(element).attr(`data-${language}`);
      if (element.tagName === "meta") $(element).attr("content", selected);
      else $(element).text(selected);
    });
    $("[data-aria-zh][data-aria-en]").each((_, element) => {
      $(element).attr("aria-label", $(element).attr(`data-aria-${language}`));
    });
    $("[data-lang-content]").each((_, element) => {
      if ($(element).attr("data-lang-content") !== language) $(element).remove();
      else $(element).removeAttr("hidden data-lang-content");
    });
    $("[data-zh], [data-en], [data-aria-zh], [data-aria-en]").removeAttr("data-zh data-en data-aria-zh data-aria-en");
    $("body").removeAttr("data-title-zh data-title-en data-language");
    return $.html();
  });

  return {
    dir: { input: ".", output: "_site", includes: "src/_includes", data: "src/_data" },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
}
