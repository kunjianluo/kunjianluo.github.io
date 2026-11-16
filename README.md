# Kunjian Luo — Academic Website

A minimal, responsive personal academic website, written in HTML5 and CSS. No JavaScript, framework, package installation, or build step is required.

- Website: https://kunjianluo.github.io/
- Repository: https://github.com/kunjianluo/kunjianluo.github.io

## Files

```text
index.html   Page content, navigation, and metadata
style.css    Typography, colors, layout, and responsive styles
.nojekyll    Serve the static files without Jekyll processing
.gitignore   Ignore local operating-system files
README.md    Editing, preview, and publishing instructions
```

## Preview locally

Open `index.html` directly in a browser, or run this command from the repository directory:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Then visit http://127.0.0.1:8000/. Press `Ctrl+C` to stop the server.

## Update the content

Edit the relevant section in `index.html`. Section IDs (`about`, `research`, `publications`, `projects`, `cv`, and `contact`) match the navigation links. Keep them in sync if renamed.

Edit the variables at the top of `style.css` to change the colors and maximum page width. The mobile layout is defined in its media query.

Publications and projects currently contain explicit placeholders. No publications, awards, project outcomes, or CV files have been invented.

### Add a real CV later

1. Create an `assets/` folder and add the actual PDF as `assets/Kunjian_Luo_CV.pdf`.
2. Replace the CV placeholder paragraph with:

```html
<p><a href="assets/Kunjian_Luo_CV.pdf">Download CV (PDF)</a></p>
```

3. Commit both the PDF and the HTML change together so that the download link works.

## Publish with GitHub Pages

The repository must be public and named `kunjianluo.github.io` under the `kunjianluo` account.

In **Settings → Pages → Build and deployment**, use:

- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/(root)**

Save the setting. Subsequent pushes to `main` automatically publish updates:

```sh
git add index.html style.css README.md .nojekyll .gitignore
git commit -m "Update academic website"
git push origin main
```

Check the repository's **Actions** tab if publishing is delayed or fails. Initial publication can take several minutes.

GitHub documentation: [Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Accessibility and dependencies

The site uses semantic headings and sections, a keyboard skip link, visible keyboard focus, and wrapping navigation. It loads only the local stylesheet and system fonts; there are no external UI libraries, analytics scripts, images, or tracking dependencies.
