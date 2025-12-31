# Batcave
Personal website of Bruce Wu based on a jekyll theme [matjek](https://github.com/ShawnTeoh/matjek?tab=readme-ov-file)

## Features

* [Google Analytics](#google-analytics-configuration)
* Disqus
* [GitHub project page](https://brucewayne-batty.github.io/projects)
* [Tags](https://brucewayne-batty.github.io/tags) and [Categories](https://brucewayne-batty.github.io/categories)
* [Modular CSS and JS includes](#modular-css-and-js-includes)
* [Fancy "About" page](https://brucewayne-batty.github.io/about)

## Installation

Clone or fork this repo and edit `_config.yml` as needed.

## Configuration

Most of the configurations can be found in `_config.yml`. The configurations listed below are specific to MatJek. If you are not using `google_tracking_id` or `disqus_shortname`, just remove them completely.

```yaml
github_profile: "github_profile_url"
user: "your_name" # Appears at sidebar
user_email: "your_email" # Appears at sidebar, remove whole variable if unwanted
contact_url: "google_form_link"
google_tracking_id: "google_analytics_ID"
disqus_shortname: "shortname_given_by_Disqus"
```

### Google Analytics Configuration

This theme uses **Google Analytics 4 (GA4)** with the modern `gtag.js` implementation. To set up Google Analytics for your site:

1. **Create a GA4 Property** (if you don't have one):
   - Go to [Google Analytics](https://analytics.google.com/)
   - Create a new GA4 property for your website

2. **Get your Measurement ID**:
   - In your GA4 property, go to **Admin** → **Data Streams**
   - Select your web stream
   - Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)

3. **Update `_config.yml`**:
   ```yaml
   google_tracking_id: "G-XXXXXXXXXX"  # Replace with your GA4 Measurement ID
   ```

4. **If you don't want to use Google Analytics**:
   - Simply remove or comment out the `google_tracking_id` line in `_config.yml`
   - The tracking code will not be included in your site

**Note**: The old Universal Analytics (UA) format (`UA-XXXXXXXXX-X`) is no longer supported. Make sure to use the GA4 Measurement ID format (`G-XXXXXXXXXX`).

### GitHub Project Page

This project will automatically display your GitHub projects with the profile link you set in `_config.yml`.

**Note**: To display GitHub projects, you need to configure GitHub API authentication. Otherwise, you'll see a warning message and the projects page will show a helpful message instead of your repositories.

#### Configuring GitHub API Authentication (Optional but Recommended)

If you want to display your GitHub repositories on the projects page, you need to set up a GitHub Personal Access Token:

1. **Create a GitHub Personal Access Token**:
   - Go to [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
   - Click "Generate new token (classic)"
   - Give it a descriptive name (e.g., "Jekyll GitHub Metadata")
   - Select the `public_repo` scope (or `repo` for private repos)
   - Click "Generate token" and copy the token

2. **Set the token as an environment variable**:
   ```bash
   export JEKYLL_GITHUB_TOKEN=your_token_here
   ```

3. **Run Jekyll with the token**:
   ```bash
   bundle exec jekyll serve
   ```

   Or on Windows:
   ```cmd
   set JEKYLL_GITHUB_TOKEN=your_token_here
   bundle exec jekyll serve
   ```

**Alternative**: If you don't configure the token, the projects page will still work but will display a message explaining how to configure it. The warning message during build is harmless and won't break your site.

### Logo and Image
Edit the images in `assets/res` to suit your liking, but try to stick to the original resolutions.

### Comment
If you would like to enable comments in a post (disqus_shortname must be provided), add this line to the front matter of the post.

```yaml
comments: 1
```

### Tags and Categories
Add tags and categories to your posts in the front matter as well. Multiple tags/categories can be assigned but need to be separated by spaces.

```yaml
categories: default default2
tags: test test2
```

### Modular CSS and JS Includes

This theme supports **modular CSS and JavaScript includes**, allowing you to load page-specific stylesheets and scripts only when needed. This improves page load performance by avoiding unnecessary resource loading.

#### How it works

In the page's front matter, you can specify `css` and `js` arrays. The theme will automatically include these files in the HTML:

**For CSS files:**
- Local files (from `assets/css/`): Just specify the filename
- External CDN links: Use the full URL (must contain `//`)

**For JS files:**
- Local files (from `assets/js/`): Just specify the filename  
- External CDN links: Use the full URL (must contain `//`)

#### Examples

**Example 1: Loading local CSS and JS files** (`projects.md`):
```yaml
---
layout: page
title: "GitHub Projects"
css: ["projects.css"]
js: ["projects.js"]
---
```

**Example 2: Mixing local files and CDN links** (`about.md`):
```yaml
---
layout: page
title: "About Me"
css: ["about.css", "animate.css", "morphext.css"]
js: ["morphext.min.js", "about.js"]
---
```

**Example 3: Using external CDN libraries**:
```yaml
---
layout: page
title: "My Page"
css: ["custom.css"]
js: ["https://cdnjs.cloudflare.com/ajax/libs/geopattern/1.2.3/js/geopattern.min.js", "custom.js"]
---
```

**Note**: The theme automatically handles the path resolution:
- Local files are loaded from `{{site.baseurl}}/assets/css/` or `{{site.baseurl}}/assets/js/`
- URLs containing `//` are treated as external links and used as-is

## Contributing

Bug reports and pull requests are welcomed on GitHub at [this project](https://github.com/BruceWayne-Batty/BruceWayne-Batty.github.io). This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## Development

To set up your environment to develop this theme, clone/fork the repo and run `bundle install`.

To test your theme, run `bundle exec jekyll serve` and open your browser at `http://localhost:4000`. This starts a Jekyll server using your theme. Add pages, documents, data, etc. like normal to test your theme's contents. As you make modifications to your theme and to your content, your site will regenerate and you should see the changes in the browser after a refresh, just like normal.

## License

The theme is available as open source under the terms of the [GPL v3 License](https://www.gnu.org/licenses/gpl-3.0.en.html).

## Libraries
* [Materialize.css](http://materializecss.com/)
* [GeoPattern](https://github.com/btmills/geopattern/)
* [Animate.css](https://daneden.github.io/animate.css/)
* [Morphtext](http://morphext.fyianlai.com/)

## References
* https://github.com/DONGChuan/Yummy-Jekyll/
* https://github.com/codinfox/codinfox-lanyon/
* https://github.com/ShawnTeoh/matjek