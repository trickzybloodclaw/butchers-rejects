# The Butchers Rejects — guild website

A free, static Horde-inspired guild website. No build step, hosting subscription, or paid software required.

## Preview locally

Open `index.html` in a browser. For the optional Firebase login, use a local HTTP server instead: from this folder run `python -m http.server 8000`, then open `http://localhost:8000`.

## Publish for free with GitHub Pages

1. Create a free GitHub account and a new **public** repository (for example `butchers-rejects`).
2. Upload `index.html`, `styles.css`, `app.js`, `config.js`, `data.js` and the `images` folder to the repository root (GitHub's **Add file → Upload files** works).
3. Open the repository's **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. After GitHub finishes publishing, visit `https://YOUR-USERNAME.github.io/butchers-rejects/`. GitHub Pages availability and URLs depend on your repository settings.
5. Edit files on GitHub and commit changes to update the site. You can also use free Netlify static hosting if preferred.

## Customize your guild

- `data.js`: edit roster, announcements, and gallery entries. The initial entries are clearly marked placeholders, not actual members or events.
- `images/`: put your own screenshots here. For example, set a gallery item's `image` to `images/raid-night.jpg`.
- `config.js`: set `recruitmentEmail` to an inbox you control. Without it, the recruitment form directs applicants to Discord; it **does not store or send submissions**. With an email configured, the form opens the visitor's email app and the visitor must send the message.
- Discord buttons already point to `https://discord.gg/cuGad4an`. Check that the invitation remains valid.
- Site copy, headings, and sections are in `index.html`; colors and layout are in `styles.css`.

## Enable actual member login (optional, free-tier eligible)

This is **not** a working account system until you configure Firebase. Never put passwords, admin secrets, or service-account keys into website files.

1. Create a Firebase project at https://console.firebase.google.com/ and add a **Web app**.
2. In **Authentication → Sign-in method**, enable **Email/Password**. Review Firebase's current free-tier quotas and billing terms before enabling services.
3. Copy the Web app's *public* `firebaseConfig` object into `config.js`, replacing `null`. Its usual fields are `apiKey`, `authDomain`, `projectId`, `appId`, etc. Firebase web config is not a private admin credential.
4. In Firebase Authentication settings, add your published domain to **Authorized domains** if needed.
5. Publish your updated `config.js` and test account creation and sign-in.

**Security warning:** The example member portal authenticates users but does **not** verify guild membership, grant officer roles, or protect secret data. Any visitor can create an account if Email/Password sign-up is enabled. To create a *guild-only* portal, implement server-side membership approval and Firebase Security Rules (or use an invitation-only authentication flow) before adding private content. Static `data.js` is public to everyone, whether signed in or not.

## Intellectual property and privacy

This is an independent fan-made guild website, not an official Blizzard site. Use your own screenshots and artwork with appropriate permissions. Obtain members' permission before publishing names or images. The artwork in this starter is CSS and text-based; no Blizzard artwork is bundled. Google Fonts are fetched online and fall back to system fonts when offline.
