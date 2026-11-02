# ELECTROFINE — website handover

A complete static website for ELECTROFINE Electrical Engineers and Contractors.
No npm install, build step, paid plugin, API key, or framework is required.

## Start here

1. Extract the ZIP.
2. Open `electrofine/index.html` in a browser. No build or server is needed. For a hosted-style preview, run `python3 -m http.server 8000` inside the folder and visit `http://localhost:8000`.
3. Update the business details in `assets/js/config.js`.
4. Upload the CONTENTS of the `electrofine` folder to your hosting root.

JavaScript is used for the animated gallery, project rendering, mobile menu, and enquiry draft. The site uses plain HTML and CSS for its layout. All fonts and images are bundled locally. An internet connection is not needed to preview the core website.

## Publish on GitHub Pages

1. Create or open your website repository.
2. Upload everything INSIDE the `electrofine` folder. `index.html` must be at the repository root, beside `about.html`, `assets/`, and the other pages.
3. Commit to your publishing branch, typically `main`.
4. In repository Settings → Pages, choose **Deploy from a branch** under Build and deployment.
5. Choose `main` and `/(root)`, then Save.
6. Open the published address shown by GitHub once deployment completes.

Keep `.nojekyll`. Relative asset links support both a repository subpath and a custom domain. You do not need a custom GitHub Actions workflow.

Official publishing instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## File map

| File / folder | Purpose |
| --- | --- |
| `index.html` | Home |
| `about.html` | Company story, experience, values and editable Core Team placeholders |
| `services.html` | Four expertise areas, process, FAQs |
| `portfolio.html` | Filterable scroll gallery and grid mode |
| `project.html?id=grid-connection` | Shared project detail template; query selects the project |
| `products.html` | Curved product gallery, category filters and grid view |
| `product.html?id=switchgear` | Product detail template |
| `assets/js/products.js` | Six editable placeholder product categories |
| `assets/js/product-detail.js` | Product detail rendering |
| `assets/css/brand.css` | Royal blue / white / tomato palette and latest component styles |
| `contact.html` | Validated project enquiry form |
| `privacy.html` | Privacy notice for the current static functionality |
| `404.html` | Missing-page template |
| `assets/css/style.css` | Layout, colours, responsive rules, motion |
| `assets/css/liquid.css` | Liquid-glass redesign, fixed navigation, curved portfolio, responsive overrides |
| `assets/css/fonts.css` | Local font definitions |
| `assets/js/config.js` | Business contact information and enquiry mode |
| `assets/js/projects.js` | Editable project content and image filenames |
| `assets/js/main.js` | Behaviour and project rendering |
| `assets/js/motion.js` | Cinematic scroll effects and storytelling |
| `assets/js/liquid.js` | Floating glass panels, ambient light, pointer highlights |
| `assets/js/orbit.js` | Curved scroll gallery, filters, grid view, project detail panels |
| `assets/images/` | Six reference photographs, six original SVG product concepts and favicon |
| `assets/fonts/` | Local Manrope and DM Sans fonts plus OFL licences |
| `ASSET-CREDITS.md` | Image provenance and font licence sources |

## Add verified contact details

Edit `assets/js/config.js`:

```js
window.ELECTROFINE_CONFIG = {
  email: "YOUR_VERIFIED_BUSINESS_EMAIL",
  phoneDisplay: "YOUR_DISPLAY_NUMBER",
  phoneLink: "YOUR_NUMBER_WITH_COUNTRY_CODE",
  address: "YOUR_VERIFIED_OFFICE_ADDRESS",
  mapUrl: "YOUR_HTTPS_MAP_LINK",
  enquiryMode: "email"
};
```

Replace the uppercase examples with real details; do not publish the examples. Leave unknown fields empty. With no email configured, the form downloads a text brief and explicitly states that nothing was sent. With a real email configured, it opens an email draft for the visitor to review and send. It does **not** send email automatically or collect server-side submissions. Long briefs are downloaded for attachment because email-link length limits vary. The visitor must attach the downloaded file themselves.

For automatic submissions later, connect a form service or backend and update the form behaviour and privacy notice. Do not insert private API keys into public JavaScript.

## Update the portfolio

Edit the objects in `assets/js/projects.js`:

- `id`: unique URL identifier. Keep it stable after sharing a link.
- `title`, `label`, `intro`: gallery title, discipline, and hover preview.
- `category`: `high-voltage`, `commercial`, or `infrastructure`.
- `image`: filename inside `assets/images/`.
- `alt`: an accurate description of the replacement photograph.
- `overview`, `challenge`, `scope`, `context`: detail-page content.

Duplicate an object to add a project, or remove an object to remove it. The gallery and next-project navigation update automatically. The all-work count updates automatically.

The shipped portfolio is deliberately labelled **illustrative**. When real case studies are approved, update the portfolio notice, card badge text, detail-page project status/location fields, and sample disclaimer in `assets/js/main.js`. Update the related notice on the home page and portfolio FAQ in `services.html`. Do not remove sample labels while the content is still illustrative.

To update a picture without changing code, replace the corresponding `.webp` file using the same filename. Aim for 1600–2000 pixels wide and use a high-quality WebP export. Photos are reused in related sections, so check all uses after replacing one.

## Change the design

The final design overrides are in `assets/css/brand.css`. The palette is:

- Royal blue: `#4169E1`
- White: `#FFFFFF`
- Tomato red: `#FF6347`
- Dark blue text and darker red text variants preserve contrast on white.

The main typeface is Manrope, the body is DM Sans, and the liquid theme uses Manrope for highlighted headings. The temporary wordmark is HTML/CSS; replace the brand markup in the header and footer of every page when a final logo is available.

The site has shared CSS and JavaScript but intentionally keeps header/footer HTML inside each page so it works without fetching partials. Navigation edits should therefore be applied across all ten HTML files.

## Motion and accessibility

- Native anchor scrolling. Wheel input is smoothed only around the pinned desktop collection; elsewhere it remains native. Zoom gestures, touch, keyboard and scrolling within preview panels remain native.
- Staggered headline entrances and scroll-driven word illumination.
- Electrical transmission hero photography with a gentle image drift.
- Floating glass cards, pointer-responsive highlights, and ambient lighting.
- Fixed floating navigation stays accessible as you scroll.
- Full-screen, three-stage pinned storytelling on the home page.
- Wheel scrolling, arrows and dots share one frame-rate-independent animation loop. A finite arc removes wraparound jumps; moving cards use lightweight translucent gradients instead of live background blur.
- Image mask reveals and staggered content entrances across the site.
- Desktop portfolio: vertical scrolling moves project cards through a curved, depth-layered arc. Arrow buttons and dots select projects.
- Grid view is available as an alternative.
- Screens at or below 900px wide, short viewports and reduced-motion settings use a normal grid / vertical gallery.
- Scroll reveals, image hovers, an animated ticker, and a slow rotating accent.
- Reduced-motion preferences disable animations and use a grid portfolio.
- Keyboard focus, skip link, labelled fields, menu focus handling, and Escape-to-close.
- Hover opens a frosted project preview; the arrow button opens it explicitly on touch or keyboard. Escape or the close button dismisses it. Each preview links to a full detail page.

## Before the client launch

- Add verified contact details and a final logo if supplied.
- Replace sample projects and reference photos with approved case studies.
- Confirm product categories, images, manufacturers and technical data.
- Add actual team names, approved portraits, titles and biographies in `about.html`.
- Confirm company wording and licensing claims supplied in the brief.
- Review the privacy text if enquiry processing changes.
- Once the final domain is known, set absolute Open Graph image URLs and add canonical URLs / a sitemap if required. The current page titles and descriptions are already included.
- Check every page on the actual hosted URL and test the configured email draft on the client’s device.

## Validation and limitations

Desktop and 390px mobile browser previews were inspected. The motion update adds a separate progressive-enhancement layer; small screens use a stacked narrative and reduced-motion preferences disable the enhanced motion. Portfolio filtering, gallery scrolling, mobile navigation, and the downloadable enquiry brief were exercised. JavaScript syntax and local page/asset links were checked. The website has not been deployed to your GitHub account. Email sending cannot be tested until verified contact information is configured.

The sculpture was replaced by infrastructure photography; the website no longer requires WebGL or Three.js.

The included 404 page works for root-level missing URLs. On nested missing URLs, GitHub may resolve relative assets differently; adapt the 404 asset paths to your final hosting base if you require styled nested-path errors.

## Edit Products and Core Team

Product content lives in `assets/js/products.js`. Its format mirrors `projects.js`. Supported filter categories are `distribution`, `control`, and `installation`. Each item has a stable `id`, `title`, `image`, `alt`, `intro`, `overview`, `scope`, and `challenge`. Gallery previews link to `product.html?id=...`; enquiry links prefill the contact form with the chosen category. The SVG visuals are original concept illustrations, not actual equipment images. Do not treat the placeholder categories as a verified product catalogue.

Core Team is in `about.html`, in `<section id="team">`. Replace the placeholder name and role text in each `team-card`, then replace its portrait SVG with an approved `<img>` using an accurate `alt` description. Set `.team-portrait img { width:100%; height:100%; object-fit:cover; border-radius:inherit; }` if adding photographs. Remove the team-preview note only after all details are verified.
