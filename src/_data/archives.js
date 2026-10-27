import authors from "./authors.json" with { type: "json" };
import tagDefinitions from "./tagDefinitions.json" with { type: "json" };

export default ["zh", "en"].flatMap((lang) => [
  ...Object.keys(tagDefinitions).map((key) => ({ type: "tag", key, lang })),
  ...Object.keys(authors).map((key) => ({ type: "author", key, lang }))
]);
