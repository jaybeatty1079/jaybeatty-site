# The Peptide Ride, the Peptide Supply Map and the glossary

Three pages built from one data set: where 65 peptides stand under US rules as of the date on the page, how each one is made, and who supplies them. The full account of what went into them is in the root [README](../README.md).

- `ride-template.html` is the ride; `map-template.html` the map; `glossary-template.html` the glossary. `build.py` reads the register, the 503B facility list and the research CSVs from Jay's vault (outside this repo), merges the compound grades from `data/`, and writes `index.html`, `map.html`, `glossary.html` and the artifact copies with the data inlined. Never edit the built pages by hand.
- `tools/evidence.py` grades the fifty compounds in `tools/compounds.txt` from PubMed, ClinicalTrials.gov, openFDA, Europe PMC and OpenAlex and writes `data/compounds.json`; `tools/named_evidence.py` does the same for the fifteen compounds the regulators have named, into `data/named-evidence.json`; `tools/refill_openalex.py` fills OpenAlex counts that a day's free budget could not cover. The grade rule is in the docstring: A an approved US product, B three or more human trials, C three or more human studies, D laboratory and animal work only. A count, not a verdict.
- `tests/` holds two browser checks for the ride (Chrome, network for three.js): `node tests/pause.test.mjs` proves Pause freezes the ride's clock, cart and door hold and Resume restores them; `node tests/stages.mjs` drives the ride at 1200 px and 375 px, pauses at every stage and checks the stage's text is whole (on screen, opaque, not overlapping, 12 px or more), writing a screenshot per stage to `tests/out/`. The ride pauses with the Pause button or Space; the step's words sit in one pinned panel along the bottom.
- Every standing card links the exact searches behind its counts, so a reader can check the decision.
- `data/` holds the two base maps and the compound grades. `assets/LICENSES.md` credits the models.

Maps public guidance as of its date. Not legal advice, and no claim that any peptide is safe or works.
