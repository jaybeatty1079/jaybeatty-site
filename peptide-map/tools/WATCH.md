# The watch: an agent's standing brief for new peptides and new rulings

Run this as a fresh session (Sonnet is enough) about once a month, or when Jay sees a new name trending on LinkedIn. It keeps the two menus and the register current. Everything it adds must trace to a public source; counts, not verdicts.

## 1. New or trending compounds
- Check, in this order: FDA's 503A and 503B bulks lists and the category pages (new placements, withdrawals); the Pharmacy Compounding Advisory Committee meeting pages (nominations on the agenda); the Federal Register (search "bulk drug substances" and "peptide"); the FDA warning-letter list filtered to the last 90 days (every compound named in a letter); CBP local media releases (seized shipments name compounds); ClinicalTrials.gov for new phase 2 and 3 peptide trials with sponsors; and the trade press that keeps lists (Frier Levitt, Hyman Phelps's FDA Law Blog, Mintz "FDA in Flux").
- A compound earns a line in `tools/compounds.txt` when it is named by a regulator, a court, a customs release, or a registered trial, or is sold by two or more web stores named in a letter. Give it `id|name|what it is|what it is sold for|synonyms`, then run `python3 peptide-map/tools/evidence.py` and `python3 peptide-map/build.py`. Add its origin to `ORIGIN` in build.py (kind, one-line note, residue count, sequence if public).
- Never grade by claim. The pipeline grades from PubMed, ClinicalTrials.gov, openFDA, Europe PMC and OpenAlex; if an index fails, the row says so in `partial`.

## 2. Rules, letters and rulings
- Run `python3 peptide-map/tools/sources.py check` (Federal Register, Regulations.gov, openFDA, CourtListener with a token, GovInfo). Anything new goes into the vault register CSV (`Pharma - peptide map/data/register.csv`) as a dated row with a primary URL and a verified flag, then into `TIMELINE` or `COURTS` in build.py.
- A court ruling, plea or settlement joins `COURTS` only with what was decided and what it tells a reader, kept apart. Allegations stay marked as allegations.
- The HHS draft policy: when the final policy issues, the weather rule and the "tolerated" track text change; the comment deadline row goes to "closed".

## 3. What never changes without Jay
- The weather rule (sunny with oversight and evidence; storms only with no oversight).
- The words: "map", "sheet", "the standing"; never "atlas" or "plate" in this tool.
- No push to main; the batch waits for Jay's word.
