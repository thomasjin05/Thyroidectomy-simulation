# Thyroidectomy Surgery Simulator

Personal educational project for exploring the anatomy and workflow of an open thyroidectomy. The simulator shows a simplified right thyroid lobectomy case with a suspicious thyroid nodule and ipsilateral central compartment lymph node clearance.

The app is interactive: users select instruments, inspect anatomy, follow staged objectives, and receive feedback when actions are attempted in the wrong order or near protected structures. The visual model includes the thyroid lobes and isthmus, thyroid nodule, trachea, strap muscles, parathyroid glands, superior and inferior thyroid vessels, recurrent laryngeal nerve, external branch of the superior laryngeal nerve, carotid sheath, and central neck lymph node packets.

## Versions

English version:

```text
index.html
app.js
styles.css
```

Chinese version:

```text
index.zh.html
app.zh.js
styles.css
```

Keep the HTML, JavaScript, and CSS files in the same folder. The HTML files depend on the matching JavaScript file and the shared stylesheet.

## How To Run

### Option 1: Open Directly

After downloading the project, extract the ZIP first. Then open one of these files in a modern browser:

```text
index.html
```

or:

```text
index.zh.html
```

Do not open `app.js` or `app.zh.js` directly. Those files are loaded by the HTML page.

### Option 2: Run With A Local Server

If the page opens as plain text, the canvas does not animate, or a company laptop blocks local scripts, run a local server from the project folder.

Python:

```bash
python -m http.server 4173
```

Then open:

```text
http://localhost:4173/index.html
```

or:

```text
http://localhost:4173/index.zh.html
```

On some Windows systems, the command may be:

```bash
py -m http.server 4173
```

## Common Download Issues

If the simulation shows only labels or unstyled text, the browser probably cannot load `styles.css` or the JavaScript file.

Check that:

- The ZIP has been extracted.
- `index.html`, `app.js`, and `styles.css` are in the same folder.
- For Chinese, `index.zh.html`, `app.zh.js`, and `styles.css` are in the same folder.
- The files were not renamed to `app.js.txt` or `styles.css.txt`.
- The page is opened in Chrome, Edge, Firefox, or Safari.

If a Windows error such as `800A03EA` appears, Windows is trying to execute the JavaScript file directly with Windows Script Host. Open the HTML file instead.

## Educational Scope

This simulator is a simplified teaching model. It is meant to help visualize major anatomy and the logic of a thyroidectomy workflow, including:

- Layered exposure through skin, subplatysmal flaps, and strap muscle separation.
- Identification and protection of the recurrent laryngeal nerve.
- Identification and preservation of parathyroid glands and their blood supply.
- Careful control of superior and inferior thyroid vessels.
- Use of modern energy instruments in selected steps.
- Central compartment lymph node packet mobilization and clearance in a teaching case.
- Final hemostasis and closure.

The anatomy, positions, proportions, and operative sequence are schematic. Real patients vary substantially in thyroid shape, vessel branching, parathyroid position, lymph node disease, nerve branching, and surgical approach.

## Disclaimers

This is a personal project and educational-only software.

It is not medical advice, clinical guidance, surgical training, credentialing material, or a patient-care protocol. It should not be used to plan, perform, supervise, or evaluate real surgery. Thyroidectomy and neck dissection require formal medical training, supervised operative experience, institutional protocols, and patient-specific clinical judgment.

The simulator intentionally simplifies anatomy and technique. Some details are approximated to make the relationships visible on screen. It does not represent all anatomical variants, all surgical approaches, all complications, or all guideline-based indications.

## Project Attribution

This personal project was built with assistance from OpenAI Codex. Codex helped generate and revise the simulator code, interface text, Chinese localization, troubleshooting notes, and README content. Final review, project intent, and use remain the responsibility of the project owner.

## Evidence Sources

The educational content was informed by open medical references and guideline literature, including:

- NCBI Bookshelf, StatPearls: [Thyroidectomy](https://www.ncbi.nlm.nih.gov/sites/books/NBK563279/)
- NCBI Bookshelf, StatPearls: [Anatomy, Head and Neck, Thyroid](https://www.ncbi.nlm.nih.gov/books/NBK470452/)
- NCBI Bookshelf, Endotext: [Surgery of the Thyroid](https://www.ncbi.nlm.nih.gov/books/NBK285564/)
- American Thyroid Association guideline article on differentiated thyroid cancer: [2015 ATA Management Guidelines](https://pmc.ncbi.nlm.nih.gov/articles/PMC4739132/)
- Review article on complication avoidance in thyroid surgery: [Surgical tips and techniques to avoid complications of thyroid surgery](https://pmc.ncbi.nlm.nih.gov/articles/PMC9742273/)
- Review article on laryngeal nerve preservation: [A Review of Methods for the Preservation of Laryngeal Nerves During Thyroidectomy](https://pmc.ncbi.nlm.nih.gov/articles/PMC7315061/)

These sources support the general educational themes: recurrent laryngeal nerve risk, superior laryngeal nerve risk near the superior pole, parathyroid preservation, vessel control, thyroid bed hemostasis, and central compartment considerations. They do not certify this simulator as anatomically complete or clinically accurate.
