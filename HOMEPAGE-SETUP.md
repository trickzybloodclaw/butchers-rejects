# Install the cinematic homepage

This update uses the supplied full-page design as a visual image on desktop, with transparent **real HTML links** over the pictured navigation and buttons. On phones it uses the separate guild logo and accessible, real text and buttons. The pictured words cannot be edited individually without rebuilding the artwork.

## Update your existing GitHub Pages repository

1. Extract this ZIP. Keep the folder structure.
2. In your repository, replace `index.html`, `styles.css`, and `app.js` with the files from this ZIP. GitHub's web uploader can replace files with the same names after confirmation.
3. Open the `images` folder in GitHub, choose **Add file → Upload files**, and upload `homepage-art.png` and `guild-logo.png` into that folder. The image URLs must be `images/homepage-art.png` and `images/guild-logo.png`.
4. Commit the changes. Allow GitHub Pages a few minutes to deploy, then hard-refresh your website with Ctrl+Shift+R.

**Alternative:** Upload the extracted files and the `images` folder through GitHub Desktop or git, keeping all existing paths. Do not upload the ZIP itself as your site.

## Functionality and limitations

- Navigation, recruitment link, Discord link, scroll link, and desktop Member Login hotspot work as HTML controls. Mobile uses a real navigation menu and buttons.
- The recruitment form requires a valid `recruitmentEmail` in `config.js` to open an email draft; otherwise it sends visitors to Discord. It does not automatically collect submissions.
- Member sign-in requires Firebase Authentication configuration in `config.js`. Signing in does not confer guild membership or protect private pages. See README.md.
- Roster, announcements and gallery are editable in `data.js`; the initial entries are placeholders.
- Desktop screenshot hotspots follow the supplied artwork proportions. At extreme browser zoom, test click positions. For a completely reflowable desktop hero, the background art needs to be recreated without embedded text or buttons.
