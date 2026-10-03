 Camp Horizon — Summer Adventure Camp Website

Project Overview
Topic: Summer Outdoor Experience & Camp Horizon
Objective:Design and develop a multi-page, responsive, accessible website for a summer camp using semantic HTML5, CSS Flexbox, and CSS Grid without external frameworks.
Target Audience: Parents seeking structured summer enrichment and outdoor programs, and campers aged 7–17.
Deployed Live Website: [https://azidamt.github.io/camp-horizon/](https://azidamt.github.io/camp-horizon/)
Repository: [https://github.com/AzidaMT/camp-horizon](https://github.com/AzidaMT/camp-horizon)

Team Members & Page Ownership

| Member | Primary Page | Purpose & Main Features |
|Student 1 (Alisher Akmyrza)| `index.html` (Home) | Hero section, camp introduction, core highlights, news & updates. |
|Student 2 (Tabuldinova Zhansaya) | `services.html` (Sessions & Fees) | Catalog of camp programs, age divisions, schedule tracks, fee tables. |
|Student 3 (Alexandr Dudkin) | `about.html` (About Team) | Camp mission, counselor profiles, safety standards, daily routine timeline. |
|Student 4 (Azida Kunanbayeva) | `contact.html` (Gallery & Booking) | CSS Grid photo gallery (6+ cards), Flexbox booking form with validation, Contact HQ info, native HTML5 interactive FAQ. |

Technical Highlights

   Pure Semantic HTML5:Built using standard elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<figure>`, `<figcaption>`, `<form>`, `<fieldset>`, `<legend>`, `<details>`, `<summary>`, `<footer>`) without CSS frameworks like Bootstrap. CSS Grid Layout:** Responsive media gallery reflowing automatically using `repeat(auto-fit, minmax(280px, 1fr))` without hardcoded breakpoints.
   CSS Flexbox: Applied to site-wide navigation bar, multi-column booking form rows, checkbox/radio groups, and the contact info/FAQ section.
   Responsive Web Design: Fully adaptable across mobile, tablet, and desktop screens with no horizontal overflow.
   Accessibility & Validation: Form inputs linked to semantic `<label>` elements via `for` and `id` attributes, including required field validation and boundary checks.

Project Structure

camp-horizon/
   index.html
   services.html
   about.html
   contact.html
   css/
      style.css
      responsive.css
   images/
   README.md

   ## Static Form Demonstration
The booking form on `contact.html` is a static demonstration interface. It uses native HTML5 browser validation (types, required attributes) and navigates to `demo-result.html`. In accordance with project specifications, no JavaScript or server-side data processing is utilized, and no user data is collected or stored.
