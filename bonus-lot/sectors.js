/* One block per sector. The page is the engine; everything a sector changes lives here.
   Add a sector: copy the dealership block, change every field, source the three benchmarks, run `node bonus-lot/test.mjs`, open /bonus-lot/?s=<key>.
   Words in {braces} inside program copy are filled from `words`. Plan levels, the FICA rate, the disclaimer and the owner page are the program, not the sector. */
window.SECTORS = {
  dealership: {
    title: ['Dealer', 'City'],
    meta: 'Three missions. Build your lot, run the payroll, set your pay plan. See what a Section 125 plan does to store net and your bonus. Illustrative only.',
    words: { site: 'store', sites: 'stores', Site: 'Store', group: 'group', owner: 'owner', owners: 'owners', role: 'GM', roleLong: 'general manager', label: 'Brand', unit: 'car', units: 'cars', sale: 'Average sale', zero: 'zero units' },
    // [default, min, max, step]. Sources listed under `sources` and shown in the benchmarks note.
    bench: {
      rpe: [1150000, 500000, 2000000, 25000],
      margin: [2.8, 1, 5, 0.1],
      unit: [48000, 10000, 80000, 500],
      note: 'NADA 2024 averages: about $73M in sales and 64 employees per franchised store, net pre-tax profit in the low single digits, $48,000 per new vehicle.',
      sources: ['NADA Data 2024 (nada.org/nadadata)', 'CBT News on 2024 dealership employment', 'DealersEdge on GM pay plans, April 2024']
    },
    // emp: the GM's own site by default; add: a site added with the button; lot: headcount steps that grow the centre lot; star: net lift per star on the HUD rating
    sizes: { emp: 64, add: 40, state: 'PA', lot: [35, 90, 200], star: 100000 },
    // the per-site label and its colour (brand here; concept for restaurants, flag for hotels). Text only, no logos.
    labels: [['Toyota', '#eb0a1e'], ['Ford', '#2a5db0'], ['Chevrolet', '#c9a227'], ['Honda', '#d0202c'], ['Hyundai', '#2457a8'], ['Kia', '#36405a'], ['Nissan', '#c3002f'], ['Subaru', '#2f63d1'], ['Jeep', '#3f6b3f'], ['RAM', '#a6192e'], ['GMC', '#cf0a2c'], ['BMW', '#1c7ad1'], ['Mercedes', '#8c8f98'], ['Lexus', '#5c5f6b'], ['Audi', '#bb0a30'], ['Volkswagen', '#1d3f8a']],
    copy: {
      sub: "Three short missions. The green counter is your store's net profit. Nobody in this city sells one extra car.",
      start: "You're the GM. Three missions: build your lot, run the payroll, set your pay plan. Watch the net counter. Drag the city to look around.",
      m1: ['Build your group', "Your store first, then every other store the owner runs. Each one becomes a building, sized by headcount and colored by brand. Up to 30."],
      obj: { 1: "Build your group: your store, then the owner's other stores", 2: 'Your plans: who qualifies, plan level, how your health plan is funded', 3: 'Set your pay plan', 4: 'Mission passed. Send this to ownership' },
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
        ['Net profit up without selling a car.', 'Payroll tax drops on every enrolled employee, and the difference lands on the P&L.'],
        ['Your people take home more.', "Only employees who come out ahead are enrolled. More pay for the same work is a retention tool you didn't have to fund."],
        ['$0 care for employees and their families.', 'Virtual primary care, urgent care, therapy, dermatology and 70-plus generics, with no copay and no claim.'],
        ['Nothing changes on major medical.', 'This sits alongside the health plan you have. It never replaces it.'],
        ['Nothing is signed on these numbers.', 'A payroll analysis confirms who qualifies and what each store saves before anyone commits.']
      ]
    },
    // sign: the centre-lot sign by lot size; carsPer: one parked vehicle per this many employees; showroom and pennants can be turned off for a sector without them
    scene: { sign: ['LOT', 'STORE', 'DEALER', 'GROUP'], showroom: true, carsPer: 8, pennants: true }
  }
};
