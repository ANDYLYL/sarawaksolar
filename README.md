# sarawaksolar.com

Static one-page site for Sarawak Solar Solutions. No build step: plain HTML, CSS and JavaScript, hosted free on GitHub Pages.

## Files
| File | Purpose |
|---|---|
| `index.html` | The whole site (calculator, inverter matcher, FAQ, pre-registration form) |
| `CNAME` | Tells GitHub Pages to serve the site at `www.sarawaksolar.com` |
| `og-image.png` | Preview image shown when the link is shared on WhatsApp/Facebook |
| `neuto-logo.png`, `neuto-wordmark.png` | NEUTO logo (footer, About section) and wordmark (header) |
| `favicon.svg`, `404.html`, `robots.txt`, `sitemap.xml` | Icon, not-found page, SEO |

## Updating the subsidy after Budget Sarawak 2027 (12 Oct 2026)
Search `index.html` for these and edit:
- `What's confirmed, and what isn't yet` section: move items from "Still to be confirmed" to "Announced".
- `var s27 = Math.min(cost * 0.5, 15000);` in the script: change to the official formula/tiers.
- Timeline: change the `12 Oct 2026` and `2027 (expected)` entries.
- `<meta property="og:description">` and `og-image.png` if the headline changes.
- `sitemap.xml` `lastmod` date.

Commit and push; GitHub Pages republishes in about a minute.

## Contact details
WhatsApp number and email are set at the top of the `<script>` block (`WA`, `MAIL`) and in the footer.

## Notes
- The previous version exposed a Gemini API key in the browser and loaded React/Babel at runtime. Both were removed: the chatbot is replaced by an FAQ and WhatsApp.
- Leads go straight to WhatsApp or email. To also collect them in a spreadsheet, connect the form to a service such as Formspree or Google Forms.
