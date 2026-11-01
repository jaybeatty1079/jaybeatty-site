# Adding a sector to Dealer City

The page (`index.html`) is the engine. A sector is one block in `sectors.js`. The dealership is the first; a restaurant group or a hotel group is a second block, not a second page.

## Steps

1. Copy the `dealership` block in `sectors.js` and give it a new key (`restaurant`, `hotel`). Lowercase, no spaces: the key is the URL, `/bonus-lot/?s=restaurant`.
2. Change every field. Nothing in the block is optional:
   - `title`: two words, the second one in the accent color. `meta`: the search description.
   - `words`: the vocabulary the engine drops into program copy. `site`/`sites` (store, restaurant, property), `group`, `owner`, `role` and `roleLong` (GM, general manager), `label` (what the per-site tag is: brand, concept, flag), `unit`/`units` (what the lift is compared to: cars, covers, room nights), `sale` (the label on the average-sale slider), `zero` (the banner's "zero units").
   - `bench`: three benchmarks as `[default, min, max, step]` plus a one-line note and the sources. Revenue per employee and pre-tax net margin set the site's net; the unit price sets the "you didn't have to sell" line (lift ÷ margin ÷ unit price). Source all three from a trade body or a public report and name them in `sources`; the page prints them under the disclaimer.
   - `sizes`: the GM's default headcount, the headcount of an added site, the default state, the three headcount steps that grow the center lot, and the net lift per star on the HUD rating (set it so a typical group lands on three stars).
   - `labels`: the per-site tags with a color each. Text only, approximate colors, no logos.
   - `copy`: the subtitle, start text, mission one title and why, the four objective lines, the character's name line and four phone lines, the two unit-line functions, the two pay-plan notes, the CTA, and the five "What the site gets" bullets. Keep the compliance posture: no "IRS-approved", no guarantees, "estimate" and "illustrative", never that some employees come out behind.
   - `scene`: the four sign words by lot size, whether the glass showroom shows vehicles, how many employees per parked vehicle, and whether pennants fly.
3. Run `node bonus-lot/test.mjs`. It checks every sector's shape and ranges and the shared math.
4. Open `/bonus-lot/?s=<key>` and play all three missions, the truck, one question, and the owner link at desktop and phone width.
5. For a clean URL, add one line to `netlify/_redirects`: `/restaurant-city/  /bonus-lot/?s=restaurant  200`.

## What a sector cannot change (on purpose)

Plan levels and the admin fee, the 7.65% rate, the claims layer, the owner page, the truck story's beats, the common questions, and the disclaimer. Those are the program. If the rate sheet changes, edit `PLANS` in `model.js` once.

## Not yet

A sector-specific centerpiece (a restaurant with a patio instead of a glass showroom) is a later hook on `scene`. Today every sector gets the same city with its own sign, label colors, vehicle density and words.
