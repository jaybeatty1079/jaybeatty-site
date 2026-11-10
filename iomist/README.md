# How Iomist works

A sales tool for [Iomist](https://www.iomist.ag/), a fresh produce traceability company. It shows a grower what Iomist does, lets them try it on their own farm, and answers the questions growers ask first. One page, plain files, no server, no cookies, no accounts.

[Open it](https://jaybeatty1079.github.io/tools/iomist/)

## What is in it

1. **Start.** What Iomist is in three lines, and four steps in Iomist's own words.
2. **Try it: the recall call.** A store reports one bad clamshell. The same complaint runs twice on the same farm: once with what the farm has today, once with a code on every pack. You choose what "today" means: paper and memory, spreadsheets, an ERP, or a traceability system that stops at the case or pallet. You press Pull it and watch the cases come off the shelf. A second press puts them back.
3. **See it: one clamshell.** A drawn scene follows one lot from the field to the cooler, the packing line, the dock, the distributor, the store and the shelf, with the data recorded at each stop. Then the complaint is traced back to the field.
4. **Ask: common questions.** Twelve answers, each marked with where it comes from: iomist.ag, Iomist's own materials, or a published source with a link.
5. **Go deeper.** A readiness check against FDA's Food Traceability Rule, and a door for each buyer showing what that buyer has published and when it takes effect.

A guide bar at the top always shows the one thing to click next, and Back works from every screen.

## How it was built

Designed and coded by Jay Beatty working with Claude (Anthropic's AI assistant) in Claude Code, November 5 to 9, 2026, in nine reviewed versions.

- **Research first.** Before any drawing, a fact base was assembled from FDA's rule (21 CFR Part 1 Subpart S), FDA's regulatory impact analysis, and the published supplier requirements of eleven buyers plus the PTI and GS1 baseline. The result is `data.js`: 56 requirement rows and 33 sources, each row with the stop where it applies, its date, a confidence level and a link. Where no public document could be found, the row says "not found" and is never counted.
- **A small model, tested.** `model.js` builds one seeded farm-to-store network from the viewer's inputs and runs the same complaint through it under each record-keeping method. `test.cjs` checks the trace logic, the date math, the door scores, the FAQ and that every row has a real source. Run it with `node test.cjs`.
- **Numbers are labeled.** Every figure on the page is one of three kinds: published (with a source you can open), yours (typed into the panel), or illustration (drawn to show how it works, not measured). No recall time or cost is claimed for Iomist. The only timings shown are FDA's and one retailer's published figures.
- **The scene is code.** `scene.js` draws the field, the scanners, the packing line, the roads and the shelf on a canvas. The scanners are drawn from Iomist's own field footage.
- **Shaped by use.** The first build opened on the recall drill and led with compliance research. Review moved it to an introduction first, the research behind one link, a visible next step on every screen, a slower scene and a way back from everywhere.

## Files

| File | What it is |
|---|---|
| `index.html` | The page: layout, styles, the drill, the journey, the readiness check, the doors, the guide |
| `data.js` | Every fact the page may show, with its source and the date it was read |
| `model.js` | The farm network, the trace, the readiness and door scoring |
| `scene.js` | The drawn journey from field to shelf |
| `test.cjs` | `node test.cjs` |
| `assets/` | The Iomist logo |

## Notes

An illustration built from public sources and Iomist's own materials. Retailer names refer to their published supplier requirements; none of them endorses this page. It is not a compliance determination. Use the primary sources, linked throughout, for decisions.

Code and text © 2026 Jay Beatty. The Iomist name and logo belong to Iomist.
