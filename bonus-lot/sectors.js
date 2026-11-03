/* One block per sector. The page is the engine; everything a sector changes lives here.
   Add a sector: copy the dealership block, change every field, source the three benchmarks, run `node bonus-lot/test.mjs`, open /bonus-lot/?s=<key>.
   Words in {braces} inside program copy are filled from `words`. Plan levels, the FICA rate, the disclaimer and the owner page are the program, not the sector. */
window.SECTORS = {
  dealership: {
    title: ['Dealer', 'City'],
    meta: 'A Section 125 Wellness Plan, explained to a dealership general manager. Build your store as a city, see what the plan does to store net and your bonus, and jump to any question. Illustrative only.',
    words: { site: 'store', sites: 'stores', Site: 'Store', group: 'group', owner: 'owner', owners: 'owners', role: 'GM', roleLong: 'general manager', label: 'Brand', unit: 'car', units: 'cars', sale: 'Average sale', zero: 'zero units' },
    // [default, min, max, step]. Sources listed under `sources` and shown in the benchmarks note.
    bench: {
      rpe: [1150000, 500000, 2000000, 25000],
      margin: [2.8, 1, 5, 0.1],
      unit: [48000, 10000, 80000, 500],
      note: 'NADA 2024 averages: about $73M in sales and 64 employees per franchised store, net pre-tax profit in the low single digits, $48,000 per new vehicle.',
      sources: ['NADA Data 2024 (nada.org/nadadata)', 'CBT News on 2024 dealership employment', 'DealersEdge on GM pay plans, April 2024']
    },
    // emp: the GM's own site by default; add: a site added with the button; lot: headcount steps that grow the centre lot
    sizes: { emp: 64, add: 40, state: 'PA', lot: [35, 90, 200] },
    // the per-site label and its colour (brand here; concept for restaurants, flag for hotels). Text only, no logos.
    labels: [['Toyota', '#eb0a1e'], ['Ford', '#2a5db0'], ['Chevrolet', '#c9a227'], ['Honda', '#d0202c'], ['Hyundai', '#2457a8'], ['Kia', '#36405a'], ['Nissan', '#c3002f'], ['Subaru', '#2f63d1'], ['Jeep', '#3f6b3f'], ['RAM', '#a6192e'], ['GMC', '#cf0a2c'], ['BMW', '#1c7ad1'], ['Mercedes', '#8c8f98'], ['Lexus', '#5c5f6b'], ['Audi', '#bb0a30'], ['Volkswagen', '#1d3f8a'], ['CDJR', '#4a4f5c'], ['Mitsubishi', '#d7141a']],
    copy: {
      sub: "A Section 125 Wellness Plan, explained to a general manager. Your store nets more, your people take home more, and you set what that does to your bonus.",
      // the opening panel over the city: three lines a GM reads in five seconds, one paragraph, and a live line filled from the default store
      open: {
        lines: [['Your store', 'nets more.'], ['Your people', 'take home more.'], ['Your bonus', 'goes up.']],
        para: "A Section 125 Wellness Plan does all three with payroll tax the store already sends out. Designed to be cost-neutral, it can start any month of the year, and nothing is signed on these numbers.",
        live: (emp, lift, units) => `On a ${emp}-person store: ${lift} of net a year, ${units} cars' worth, before you change a number.`
      },
      start: "Three short steps: your group, your plans, your pay plan. The counter at the top right is what the plan adds to store net each year. Drag the city to look around.",
      m1: ['Build your group', "Your store first, then every other store the owner runs. Each one becomes a building, sized by headcount and colored by brand. Up to 30."],
      obj: { 1: "Build your group: your store, then the owner's other stores", 2: 'Your plans: who enrolls, plan level, how your health plan is funded', 3: 'Set your pay plan', 4: 'Mission passed. Send this to ownership' },
      // the guided path, in the city before the truck story and on the cars after it. {cue} is a camera position; the engine fills {per} and the sector words.
      orient: [
        { h: 'This city is your dealer group.', s: 'The lot in the middle is your {site}, 64 people on payroll until you change it. Every {site} the {owner} runs becomes a building around it.', cue: 0 },
        { h: 'Every pay period, payroll tax leaves every building.', s: '7.65% of each W-2 dollar goes out from the {site} before anyone is paid. The wellness plan is a way to send less of it out. Watch the truck.', cue: 1 }
      ],
      landing: [
        { h: 'Everyone comes out ahead, and the car shows how.', s: 'Wheels: $0 care for the family. Body: more take-home. Hood: the {site}\'s saving, {per} a month per enrolled employee. Glass: the Section 125 Wellness Plan it all rides in.', lit: { wheels: 1, body: 1, engine: 1, windows: 1 } },
        { h: 'Now build your own {site}.', s: 'Three short steps: your group, your plans, your pay plan. The counter at the top right shows what the plan adds to {site} net as you go, and the Service department answers any question on the way.', lit: { engine: 1 } }
      ],
      who: 'Rocky · Back office',
      lines: [
        "Rocky. Back office. Nobody sees me, everybody gets paid. Build your store, then add the owner's other stores. Every one becomes a building.",
        "{n} stores, {emp} on W-2. That's a payroll worth reading. Now tell me about your plans.",
        '{enrolled} enrolled across the group. {lift} a year lands on the P&L and not one tire gets kicked. Last job: how do you get paid?',
        "{bonus} to you. {units} cars' worth of net nobody had to move. Take it to ownership."
      ],
      unitLine: n => `${n} cars you didn't have to sell`,
      ownerUnitLine: n => `${n} cars' worth of net, with no extra units sold`,
      modeNote: { all: 'Most GM plans pay base plus a share of all net. The plan money is net, so you get your share of it.', above: 'Plans that pay a higher share above a baseline treat every plan dollar as incremental: it lands entirely in your upper band.' },
      cta: 'Run my real payroll →',
      // "What the store gets": [bold lead, rest]. The claims bullet is added by the engine when the health plan is self- or level-funded.
      gets: [
        ['Net profit up without selling a car.', 'Payroll tax drops on every enrolled employee, and the difference lands on the P&L. It can start any month of the year.'],
        ['Your people take home more.', "Only employees who come out ahead are enrolled. More pay for the same work is a retention tool you didn't have to fund."],
        ['$0 care for employees and their families.', 'Virtual primary care, urgent care, therapy, dermatology and 70-plus generics, with no copay and no claim.'],
        ['Nothing changes on major medical.', 'This sits alongside the health plan you have. It never replaces it.'],
        ['Nothing is signed on these numbers.', 'A payroll analysis confirms who qualifies and what each store saves before anyone commits.']
      ]
    },
    // a real group, anonymised: aggregates from its own invoices and payroll files, never employee data. Headcounts are the group's real ones; the brand labels are placeholders so the brand mix does not identify it. `stores`, `plan` and `qual` are what the Load button sets; `beats` play on the car stage.
    cases: [{
      q: 'Has a dealer group actually done this?',
      stores: [['Toyota', 78], ['Ford', 71], ['Chevrolet', 67], ['Honda', 67], ['Hyundai', 61], ['Kia', 16]].map(([brand, emp]) => ({ brand, emp, state: 'CA' })),
      plan: 1200, qual: 65,
      beats: [
        { h: 'Yes. A six-store independent group in Southern California.', s: 'Six stores, domestic and import brands, about 370 people on payroll, enrolled in the fall of 2024. The payroll analysis found 81% of them came out ahead.', lit: { body: 1 } },
        { h: '77% of the eligible employees enrolled.', s: '241 of 311, and fewer than 30 people ever opted out. Across the program\'s other groups, the people who sell it report enrollment of eligible employees closer to 90%. The reason is in the first question: $0 care and more take-home on the same check.', lit: { wheels: 1, body: 1 } },
        { h: '$14,355 in the first full month.', s: 'December 2024, from the invoice: 255 enrollee-months at the $1,200 level, after the fee. About $172,000 a year. The group spent about half of it on accident, hospital and critical illness cover for every employee.', lit: { engine: 1 }, exhaust: 1 },
        { h: "On today's plan levels, plausibly $200,000 to $230,000.", s: 'The group enrolled before the $1,500 and $1,600 levels existed. Each person\'s level is set by wages, so roughly half would wage-qualify for the top level. The payroll analysis is what settles each number.', lit: { engine: 1, windows: 1 } },
        { h: 'A year later: 148 enrolled, about $100,000 a year.', s: 'The stores turned over about 35 people a month and new hires wait 60 days. Enrollment is a payroll routine, not a one-time event. Load this group into the city to see it at today\'s levels.', lit: { body: 1, engine: 1 } }
      ]
    }],
    // sign: the centre-lot sign by lot size; carsPer: one parked vehicle per this many employees; showroom and pennants can be turned off for a sector without them
    scene: { sign: ['LOT', 'STORE', 'DEALER', 'GROUP'], showroom: true, carsPer: 8, pennants: true }
  }
};
