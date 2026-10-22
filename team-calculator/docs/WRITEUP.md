# Why I built a TEAM calculator, and what it taught me

I spent the last two years selling into hospitals. At Surge Care the product was a blood test that flags surgical complications early, the buyer was the hospital, and I ended up reading the same CMS documents the finance team was reading. One of them was TEAM, the Transforming Episode Accountability Model. On January 1, 2026 it made 711 hospitals financially responsible for everything that happens in the 30 days after five kinds of surgery: hip and knee replacement, hip fracture repair, spinal fusion, bypass surgery and major bowel surgery.

Every hospital on that list got a target price per episode and a simple deal. Come in under it and Medicare pays you the difference. Go over and you pay Medicare back. That is a big number for a CFO, and almost nobody outside the finance office could tell you what it was for their own hospital. I couldn't either. So I built the thing that answers it.

## What it does

You pick any of the 721 participating hospitals. The page prefills its 2024 Medicare volumes for the 29 MS-DRGs in the model, its Care Compare quality measures, its 30-day post-discharge spending pattern, its county's nursing home market and Medicare Advantage share, and a few facts from its cost report. Then it runs the published reconciliation rules: regional target prices by census division, risk and quality adjustment, stop-gain and stop-loss by track, sequestration. You get the estimated net payment, a view by service line, a set of levers for post-acute care and complications, and a five-year look. Every input shows where it came from. Every proxy says it's a proxy.

The rule I set on day one was public data only. No files from a former employer, no licensed datasets, nothing I couldn't link to. That rule cost me some precision and bought something better: anyone can check it. Thirteen CMS datasets, joined by each hospital's CCN, with the release dates listed.

## What I got wrong at first

The first version showed what Medicare saves. I asked Claude to play a hospital CFO and poke holes, and the first hole was the obvious one. Gross Medicare savings is not the hospital's margin. Fewer readmissions means lost inpatient revenue. Fewer SNF days matters differently if the system owns the SNF. A navigation program has salaries. So the tool grew a net-to-hospital panel, and that one change turned it from a demo into something a finance person would argue with. There were fifteen more objections. I fixed all sixteen in the order a CFO would raise them. The list is in the decision record with what each fix did.

Then I asked a different question. What would a software developer with twenty years in healthcare say makes this a decent free tool they would never pay for? That answer was just as useful. It runs on data the hospital already has in better form. It models category averages, and the money hides in the episodes. Nothing persists. There's no export a finance team can use. It stops at one hospital when systems run TEAM across a dozen. All true, and all deliberate for a portfolio piece. The point of asking was to know exactly where the line sits between a calculator and a product, because that's the question a hiring manager will ask.

## What I learned

The buyer cares about net, always. A model that stops at the program's savings is selling to the wrong person.

Public data gets you most of the way and then stops hard. I can estimate a hospital's post-discharge spend from its all-condition pattern. I cannot see its surgical episodes. The honest move is to label the estimate and make the real number the headline input.

Proxies beat fake precision when you say they're proxies. The quality score on the page is built from two real measures and one assumption, and the page says which is which. A CFO trusts that more than a confident number with no source.

A critique you act on is worth more than praise. The two reviews reshaped the tool more than the first week of building did.

Building in the open changes how you build. Knowing every rule had to trace to a document I could link made me read the FY2027 final rule instead of a summary of it. That's where I found the DRG changes that take effect this October.

The calculator, the decision record, the engine tests and the data scripts are on GitHub. The numbers are estimates from public sources, the tool isn't affiliated with CMS, and no patient data touches it. If you run a hospital in the model and want to check a line, the sources are one click away.

Jay Beatty, October 2026
