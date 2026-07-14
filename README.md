# Thyroidectomy Surgery Simulator

Simulation available online at: https://thomasjin05.github.io/Thyroidectomy-simulation/

This project explores the anatomy and workflow of an open thyroidectomy. The simulator shows a simplified right thyroid lobectomy case with a suspicious thyroid nodule and ipsilateral central compartment lymph node clearance. The simulation is available in English and Mandarin Chinese. 

The app is interactive: users select instruments, inspect anatomy, follow staged objectives, and receive feedback when actions are attempted in the wrong order or near protected structures. The visual model includes the thyroid lobes and isthmus, thyroid nodule, trachea, strap muscles, parathyroid glands, superior and inferior thyroid vessels, recurrent laryngeal nerve, external branch of the superior laryngeal nerve, carotid sheath, and central neck lymph node packets.

## Educational Scope

This simulator is a simplified teaching model. It is meant to help visualize major anatomy and the logic of a thyroidectomy workflow, including:

- Layered exposure through skin, subplatysmal flaps, and strap muscle separation.
- Identification and protection of the recurrent laryngeal nerve.
- Nanocarbon contrast step before parathyroid dissection, modeled as a simplified teaching view of carbon nanoparticle contrast.
- Identification and preservation of parathyroid glands and their blood supply.
- Careful control of superior and inferior thyroid vessels.
- Use of modern energy instruments, such as ultrasonic scalpels and electrocautery, in selected steps.
- Central compartment lymph node packet mobilization and clearance in a teaching case.
- Final hemostasis and closure.

The anatomy, positions, proportions, and operative sequence are schematic. Real patients vary substantially in thyroid shape, vessel branching, parathyroid position, lymph node disease, nerve branching, and surgical approach.

## Files

The simulation uses one shared bilingual app with an in-page language switch:

```text
index.html
app.js
styles.css
```

Keep these three files in the same folder. `index.html` loads the shared bilingual JavaScript file and stylesheet. There is no separate Chinese HTML or JavaScript file in this optimized version.

## How To Run

### Option 1: Open Directly

After downloading the project, extract the ZIP first. Then open this file in a modern browser:

```text
index.html
```

Do not open `app.js` directly. That file is loaded by the HTML page.

### Option 2: Run With A Local Server

If the page opens as plain text, the canvas does not animate, or your computer blocks local scripts, run a local server from the project folder.

Python:

```bash
python -m http.server 4173
```

Then open:

```text
http://localhost:4173/index.html
```

For Chinese directly:

```text
http://localhost:4173/index.html?lang=zh
```

On some Windows systems, the command may be:

```bash
py -m http.server 4173
```

## Language Switching

Open `index.html` for the default English interface. Use the language button in the top bar to switch between English and Chinese. Switching language happens in place: it does not restart the case, reset scores, move you back to step 1, or undo completed actions. The current objective, tool panel, checklist, anatomy labels, feedback log, and completion screen all relabel immediately.

The switch stores the selected language in the browser when possible. It may update the address bar to include `?lang=zh`, but the simulation state stays active. Chinese can also be opened directly with:

```text
index.html?lang=zh
```

## Common Download Issues

If the simulation shows only labels or unstyled text, the browser probably cannot load `styles.css` or the JavaScript file.

Check that:

- The ZIP has been extracted.
- `index.html`, `app.js`, and `styles.css` are in the same folder.
- You are opening `index.html`, not looking for `index.zh.html` or opening `app.js` directly.
- The files were not renamed to `app.js.txt` or `styles.css.txt`.
- The page is opened in Chrome, Edge, Firefox, or Safari.

If a Windows error such as `800A03EA` appears, Windows is trying to execute the JavaScript file directly with Windows Script Host. Open the HTML file instead.

## Disclaimers

This is a personal project and educational-only software.

It is not medical advice, clinical guidance, surgical training, credentialing material, or a patient-care protocol. It should not be used to plan, perform, supervise, or evaluate real surgery. Thyroidectomy and neck dissection require formal medical training, supervised operative experience, institutional protocols, and patient-specific clinical judgment.

The simulator intentionally simplifies anatomy and technique. Some details are approximated to make the relationships visible on screen. It does not represent all anatomical variants, all surgical approaches, all complications, or all guideline-based indications.

## Project Attribution

This project was built with assistance from OpenAI Codex. Final review, project intent, and use remain the responsibility of the project owner. GitHub Pages serves the same full editable source kept in this repository.

## Evidence Sources

The educational content was informed by open medical references and guideline literature, including:

- NCBI Bookshelf, StatPearls: [Thyroidectomy](https://www.ncbi.nlm.nih.gov/sites/books/NBK563279/)
- NCBI Bookshelf, StatPearls: [Anatomy, Head and Neck, Thyroid](https://www.ncbi.nlm.nih.gov/books/NBK470452/)
- NCBI Bookshelf, Endotext: [Surgery of the Thyroid](https://www.ncbi.nlm.nih.gov/books/NBK285564/)
- American Thyroid Association guideline article on differentiated thyroid cancer: [2015 ATA Management Guidelines](https://pmc.ncbi.nlm.nih.gov/articles/PMC4739132/)
- Review article on complication avoidance in thyroid surgery: [Surgical tips and techniques to avoid complications of thyroid surgery](https://pmc.ncbi.nlm.nih.gov/articles/PMC9742273/)
- Review article on laryngeal nerve preservation: [A Review of Methods for the Preservation of Laryngeal Nerves During Thyroidectomy](https://pmc.ncbi.nlm.nih.gov/articles/PMC7315061/)
- Meta-analysis on carbon nanoparticles in thyroid cancer surgery: [A Meta-analysis of Carbon Nanoparticles for Identifying Lymph Nodes and Protecting Parathyroid Glands during Surgery](https://pubmed.ncbi.nlm.nih.gov/25897006/)

These sources support the general educational themes: recurrent laryngeal nerve risk, superior laryngeal nerve risk near the superior pole, carbon nanoparticle contrast as an adjunct for lymph node identification/parathyroid protection, parathyroid preservation, vessel control, thyroid bed hemostasis, and central compartment considerations. They do not certify this simulator as anatomically complete or clinically accurate.
