/* Iomist tool: every published fact the tool may show, with source and date read.
   Source of truth: vault notes "Iomist fact base 2026-11-05" and "Iomist tool concept brief 2026-11-05".
   Rules: no competitor names, no Iomist customer names, "Not published" instead of a guess,
   anything not in `sources` is an illustration or a viewer input. */
const IOMIST_DATA = {
  read: '2026-11-04',

  sources: {
    fdaRule:   { label: 'FDA: Food Traceability Rule page', url: 'https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-final-rule-requirements-additional-traceability-records-certain-foods' },
    cfr:       { label: '21 CFR Part 1 Subpart S (eCFR)', url: 'https://www.ecfr.gov/current/title-21/chapter-I/subchapter-A/part-1/subpart-S' },
    ftl:       { label: 'FDA: Food Traceability List', url: 'https://www.fda.gov/food/food-safety-modernization-act-fsma/food-traceability-list' },
    tlc:       { label: 'FDA: Traceability lot code', url: 'https://www.fda.gov/food/food-safety-modernization-act-fsma/traceability-lot-code' },
    ria:       { label: 'FDA: final regulatory impact analysis (2022)', url: 'https://www.fda.gov/media/163155/download?attachment' },
    walmart:   { label: 'Walmart: food traceability requirements', url: 'http://enablement.walmart.com/content/food-safety/en_us/food-safety-requirements/food-traceability.html' },
    walmartProduce: { label: 'Walmart: U.S.-grown fresh produce requirements', url: 'https://enablement.walmart.com/content/food-safety/en_us/food-safety-requirements/fresh-produce/u-s--grown---supplier-imported.html' },
    kroger:    { label: 'Kroger: food traceability requirements letter (Dec 1, 2023)', url: 'https://edi.kroger.com/EDIPortal/documents/Maps/kroger-modernized-systems/Food%20Traceability%20Requirements.pdf' },
    albertsons:{ label: 'Albertsons: traceability supplier letter (Sept 17, 2025)', url: 'https://suppliers.safeway.com/pdf/ACI%20Traceability%20Supplier%20Letter%20-%20Sept%202025.pdf' },
    costco:    { label: 'Costco: global food safety audit expectations v3.0', url: 'https://azzule.com/wp-content/uploads/2025/08/Food-Safety-Quality-Audit-Expectations-V3.pdf' },
    target:    { label: 'Target: food safety', url: 'https://corporate.target.com/sustainability-governance/operating-ethically/product-safety-quality-assurance/food-safety' },
    wholeFoods:{ label: 'Whole Foods: supplier portal', url: 'https://supplier.wholefoodsmarket.com/?p=1002' },
    gs1:       { label: 'GS1 US: applying GS1 standards to FSMA 204 (Dec 2025)', url: 'https://documents.gs1us.org/adobe/assets/deliver/urn:aaid:aem:8037d451-b557-4b0f-9fa8-fc94f94e4547/GS1-US-Application-of-GS1-System-of-Standards-to-Support-FSMA-204-Guideline.pdf' },
    ifpa:      { label: 'IFPA: FSMA 204 overview (July 21, 2026)', url: 'https://www.freshproduce.com/siteassets/files/supply-chain-standards/fsma-204-overview-rule-and-industry-response.pdf' },
    cdc2018:   { label: 'CDC: romaine outbreak, Nov 2018 (timeline)', url: 'https://archive.cdc.gov/www_cdc_gov/ecoli/2018/o157h7-11-18/updates.html' },
    walmartGRR:{ label: 'Walmart 2018 Global Responsibility Report summary', url: 'https://stock.walmart.com/_assets/_5626a6ac33b6bc771a4a9e521fea7c96/walmart/db/951/9698/file/WMT-2018-GRR-Summary-for-digital.pdf' },
    romaineCost:{ label: 'Spalding et al., Am. J. Agricultural Economics (2023)', url: 'https://ideas.repec.org/a/wly/ajagec/v105y2023i2p597-623.html' },
    iomistSite:{ label: 'Iomist: public site', url: 'https://www.iomist.ag/' },
    gs1Sunrise:{ label: 'GS1 US: Sunrise 2027 (read 2026-11-08)', url: 'https://www.gs1us.org/industries-and-insights/by-topic/sunrise-2027' },
    gs1Goal:   { label: 'GS1: 2D barcodes at point of sale, goal for the end of 2027 (read 2026-11-08)', url: 'https://www.gs1.org/industries/retail/solution-provider-2d-readiness' }
  },

  // FDA position. Wording rule: enforcement cannot begin before the date; no final FDA rule moving the formal date was found.
  fda: {
    enforcementNotBefore: '2028-07-20',
    note: 'Congress directed FDA not to enforce before July 20, 2028. FDA proposed moving the formal date to match; no final rule was found.',
    source: 'fdaRule',
    sortableSpreadsheetFarmThreshold: 250000,
    exemptFarmThreshold: 25000,
    lotCodeOnLabelRequired: false   // FDA: rule does not require the lot code on the label or package
  },

  // Crops: listed = on the Food Traceability List (fresh)
  crops: [
    { id: 'romaine',  label: 'Romaine', listed: true },
    { id: 'leafy',    label: 'Spinach and other leafy greens', listed: true },
    { id: 'tomato',   label: 'Tomatoes', listed: true },
    { id: 'cucumber', label: 'Cucumbers', listed: true },
    { id: 'pepper',   label: 'Peppers', listed: true },
    { id: 'melon',    label: 'Melons', listed: true },
    { id: 'herb',     label: 'Fresh herbs', listed: true },
    { id: 'tropical', label: 'Mango and other tropical tree fruit', listed: true },
    { id: 'freshcut', label: 'Fresh-cut produce', listed: true },
    { id: 'berry',    label: 'Strawberries and other berries', listed: false },
    { id: 'onion',    label: 'Onions', listed: false },
    { id: 'other',    label: 'Another crop not on the list', listed: false }
  ],

  tracking: [
    { id: 'paper',       label: 'Paper and memory' },
    { id: 'spreadsheet', label: 'Spreadsheets' },
    { id: 'erp',         label: 'An ERP or accounting system' },
    { id: 'scanning',    label: 'Already scanning each clamshell' }
  ],

  // Buyers. status 'published' = the retailer's own document; 'not_published' = nothing public found.
  buyers: [
    { id: 'walmart', label: 'Walmart', status: 'published', source: 'walmart',
      text: 'Shipping notice (EDI 856) with the FSMA 204 key data elements on every food shipment; GS1-128 case barcodes and SSCC pallet barcodes. Says it holds to its original timeline.',
      date: '2025-08-01', dateNote: 'for Food Traceability List items; harvest audit scope by 2027-08-01',
      items: ['q3', 'q7', 'q10', 'q11', 'q13'] },
    { id: 'kroger', label: 'Kroger', status: 'published', source: 'kroger',
      text: 'Shipping notice for every shipment; GS1 pallet and case labels in GS1-128 or 2D Data Matrix; applies to all food. Produce already on PTI case labels.',
      date: '2025-06-30', dateNote: 'transition complete; no revision found',
      items: ['q3', 'q10', 'q11'] },
    { id: 'albertsons', label: 'Albertsons', status: 'published', source: 'albertsons',
      text: 'All food, even if the supplier is exempt under FDA\'s rule. Shipping notice with lot code, source and product date; GS1 pallet and case barcodes. "Does not plan to offer additional deadline extensions."',
      date: '2027-01-01', dateNote: 'moved from 2025-06-30 by its Sept 17, 2025 letter',
      items: ['q3', 'q7', 'q10', 'q11'], appliesToAllFood: true },
    { id: 'costco', label: 'Costco', status: 'published', source: 'costco',
      text: 'Trace a specific lot one step back and one step forward within 2 hours; mock recalls; produce should carry a packed-on date or scannable code; Julian-code dating not acceptable. No FSMA 204 date.',
      date: '2025-09-01', dateNote: 'audit expectations v3.0 effective date',
      items: ['q12', 'q15'], appliesToAllFood: true },
    { id: 'wholefoods', label: 'Whole Foods', status: 'not_published', source: 'wholeFoods',
      text: 'No public FSMA 204 supplier specification or date found. Older text asks for PTI case labels and third-party audits.',
      date: null, dateNote: 'Not published', items: [] },
    { id: 'target', label: 'Target', status: 'published', source: 'target',
      text: 'Facilities hold GFSI certification and keep lot traceability. Page does not mention FSMA 204. No supplier deadline, label or shipping-notice spec found.',
      date: null, dateNote: 'No FSMA 204 date published',
      items: ['q3', 'q13'], appliesToAllFood: true, general: true }
  ],

  // Published reference marks for timelines. Nothing else may be shown as a fact.
  reference: [
    { id: 'fda24h', source: 'ria', text: 'FDA, 2019 romaine outbreak: farms identified within 24 hours where a lot code was on the sample, 29 days where there was none.' },
    { id: 'fda35d', source: 'ria', text: 'FDA: across 23 outbreaks (2008 to 2019), about 35 days on average to identify a source without lot codes.' },
    { id: 'wmMango', source: 'walmartGRR', text: 'One Walmart pilot, one package of sliced mangoes: six days, 18 hours, 26 minutes with paper records; 2.2 seconds on its trace system.' },
    { id: 'romaine2018', source: 'cdc2018', text: 'Nov 2018: CDC advised against all romaine on Nov 20; narrowed Nov 26; one farm named Dec 13.' },
    { id: 'romaineLoss', source: 'romaineCost', text: 'Published loss from that incident: $276 to $343 million.' }
  ],

  // What Iomist's own public site says about each question's topic. 'site' = stated on iomist.ag; 'ask' = not stated there.
  iomist: {
    q3: { s: 'site', t: 'The site says each package gets a serialized code tied to its lot.' },
    q4: { s: 'site', t: 'The site says the app captures lot codes, harvest times and GPS locations. Iomist’s proposal adds that each scan is time- and GPS-stamped at the moment it happens.' },
    q5: { s: 'ask',  t: 'Cooling is not mentioned on the site.' },
    q6: { s: 'site', t: 'The site says it documents packing as well as harvesting.' },
    q7: { s: 'deck', t: 'Iomist’s proposal says each case is built from scanned packs, each pallet is tied to its cases and each shipment to its pallets. The shipping fields themselves (recipient, lot code source, reference document) are not listed.' },
    q8: { s: 'ask',  t: 'A traceability plan or farm map is not mentioned on the site.' },
    q9: { s: 'deck', t: 'Iomist’s proposal says a trace-back report is available on demand; the FDA’s 24-hour sortable spreadsheet is not mentioned.' },
    q10: { s: 'ask', t: 'Shipping notices (EDI 856) are not mentioned on the site.' },
    q11: { s: 'ask', t: 'The site says its codes use GS1 and PTI standards, and Iomist’s proposal says its QR codes are built for 2D retail with a GS1 US partner; case and pallet label formats are not stated.' },
    q12: { s: 'ask', t: 'Mock recalls are not mentioned on the site.' },
    q13: { s: 'ask', t: 'Audits are outside what the site describes.' },
    q15: { s: 'ask', t: 'Buyer audits are outside what the site describes.' },
    q14: { s: 'site', t: 'The site says it prints a serialized QR code on the package, and Iomist’s proposal calls it ready for 2D retail under GS1 Sunrise 2027.' }
  },

  // Questions. kind: context (not scored) | fda | buyer | watch (shown, never scored)
  // appliesAnswer: 'na' allowed where the event may not occur (cooling).
  questions: [
    { id: 'q1',  kind: 'context', text: 'Which crop do you sell?' },
    { id: 'q2',  kind: 'context', text: 'About how much do you sell a year?',
      options: [ { id: 'under25', label: 'Under $25,000' }, { id: 'to250', label: '$25,000 to $250,000' }, { id: 'over250', label: 'Over $250,000' } ] },
    { id: 'q3',  kind: 'fda', buyers: ['walmart', 'kroger', 'albertsons', 'target'], text: 'Do you assign a lot code when product is packed?', source: 'cfr' },
    { id: 'q4',  kind: 'fda', text: 'For each harvest, do you record the field, the date, the quantity and who it went to?', source: 'cfr' },
    { id: 'q5',  kind: 'fda', allowNa: true, text: 'If you cool before packing, do you record where and when?', source: 'cfr' },
    { id: 'q6',  kind: 'fda', text: 'At packing, do you record who harvested, and where and when it was packed?', source: 'cfr' },
    { id: 'q7',  kind: 'fda', buyers: ['walmart', 'albertsons'], text: 'At shipping, do you record the lot code, ship date, recipient, where the lot code came from, and a reference document?', source: 'cfr' },
    { id: 'q8',  kind: 'fda', text: 'Do you have a written traceability plan with a map of your fields?', source: 'cfr' },
    { id: 'q9',  kind: 'fda', text: 'Could you give FDA these records as a sortable spreadsheet within 24 hours?', source: 'cfr' },
    { id: 'q10', kind: 'buyer', buyers: ['walmart', 'kroger', 'albertsons'], text: 'Do you send buyers an electronic shipping notice (EDI 856) with lot data?', source: 'walmart' },
    { id: 'q11', kind: 'buyer', buyers: ['walmart', 'kroger', 'albertsons'], text: 'Do your cases carry the GTIN and lot in a GS1 barcode, and your pallets a pallet barcode (SSCC)?', source: 'gs1' },
    { id: 'q12', kind: 'buyer', buyers: ['costco'], text: 'Have you run a mock trace that accounted for all product within 2 hours?', source: 'costco' },
    { id: 'q15', kind: 'buyer', buyers: ['costco'], text: 'Is your facility audited to a Costco-approved standard, and has it had Costco’s own audit?', source: 'costco' },
    { id: 'q13', kind: 'buyer', buyers: ['walmart', 'target'], text: 'Does your third-party food safety audit cover harvest?', source: 'walmartProduce' },
    { id: 'q14', kind: 'watch', text: 'Do your labels carry a 2D code (QR or Data Matrix)?', source: 'ifpa',
      note: 'Kroger accepts it; IFPA recommends adding it; GS1 sets the end of 2027 as the industry goal for 2D at checkout (a goal, not a rule). Shown, never scored.' }
  ]
};

// One-line asks for the big signs (each paraphrases the row in `buyers`).
IOMIST_DATA.short = {
  walmart: 'Shipping notice with lot data. GS1 case and pallet barcodes.',
  kroger: 'Shipping notice. GS1-128 or 2D case labels. All food.',
  albertsons: 'All food. Lot data in the notice. Jan 1, 2027.',
  costco: 'Approved audit first. Trace a lot in 2 hours.',
  wholefoods: 'No public spec found.',
  target: 'GFSI audit. Lot traceability.'
};

/* ---------- More buyers, more sources, and every published requirement as a layer ----------
   Each req: { id, buyer, stop, kind, text, date, conf, source, iomist, q? }
   stop: harvest | cooling | packing | gate | shipping | receiving  (where in the journey it bites)
   kind: data | label | ship | trace | audit | own | none   (none = "Not found" or a note, never scored)
   iomist: 'covers' (assumed: capture, label, shipping-notice data, trace) | 'records' (assumed: Iomist supplies the records an audit asks for)
           | 'own' (the grower's own: certification, membership, self-declaration) | 'none'
   ALL 'covers' and 'records' marks are an ASSUMPTION to confirm with Iomist (Jay, 2026-11-05).
   conf: High = the buyer's own document; Medium = older or reported by a body quoting it; Low = vendor or snippet. Read 2026-11-04 to 2026-11-05. */
Object.assign(IOMIST_DATA.sources, {
  krogerPTI:   { label: 'Kroger: PTI case-label letter (Dec 20, 2022)', url: 'https://thekrogerco.com///wp-content/uploads/2024/07/PTI-industry-expectation__Jason-Fowee.pdf' },
  albertsonsAudit: { label: 'Albertsons: Own Brands produce audit requirements', url: 'https://suppliers.safeway.com/usa/pdf/supplier_handbook/audit_requirements_vendor.pdf' },
  albertsonsSOP: { label: 'Albertsons: product dating and coding SOP', url: 'https://suppliers.safeway.com/usa/pdf/supplier_handbook/product_dating_and_coding_us.pdf' },
  targetAudit: { label: 'Target: produce food safety audit requirement (2019)', url: 'https://azzule.com/wp-content/uploads/2019/01/Produce-Food-Safety-Audit-Requirement.pdf' },
  wfPTI:       { label: 'PTI news: Whole Foods supports PTI labeling', url: 'https://producetraceability.org/news-events/' },
  wf2015:      { label: 'Food Safety Magazine: Whole Foods joins GLOBALG.A.P. (2015)', url: 'https://www.food-safety.com/articles/2836-whole-foods-market-joins-globalgap-as-retail-member' },
  publix:      { label: 'Publix: supplier policies and guidelines (07/24/2026)', url: 'https://corporate.publix.com/business/publix-business-connection/retail-product-supplier/-/media/7277D76BEE3E4DC4B83A6F7BB298EB95.ashx' },
  aldi:        { label: 'ALDI US: become a supplier', url: 'https://corporate.aldi.us/suppliers/become-a-supplier' },
  sprouts:     { label: 'Sprouts: food safety and quality', url: 'https://www.sprouts.com/about/food-safety-and-quality/' },
  sysco:       { label: 'Sysco: FSMA 204 traceability plan (Aug 19, 2024)', url: 'https://investors.sysco.com/annual-reports-and-sec-filings/news-releases/2024/08-19-2024-220019210' },
  usfoods:     { label: 'US Foods: Exclusive Brands farm to fork', url: 'https://usfoods.com/great-food/cross-valley-farms/farm-to-fork.html' },
  pti:         { label: 'PTI: milestones', url: 'https://producetraceability.org/produce-traceability-initiative-steering-committee-creates-milestones-for-traceability/' },
  gs1quick:    { label: 'GS1 US / PTI: FSMA 204 quick start guide', url: 'https://producetraceability.org/wp-content/uploads/2025/01/FSMA-204-Quick-Start-Guide.pdf' }
});

IOMIST_DATA.buyers.push(
  { id: 'publix', label: 'Publix', status: 'published', source: 'publix', text: 'Annual third-party farm audits for each growing area, crew, cooler and packing house; GTIN with a GS1 prefix on packaged products. No FSMA 204 deadline found.', date: null, dateNote: 'No FSMA 204 date published', items: ['q13'], general: true },
  { id: 'aldi', label: 'Aldi', status: 'published', source: 'aldi', text: 'GFSI or GMP certification; electronic shipping notice and pallet license-plate numbers (undated page). No FSMA 204 date found.', date: null, dateNote: 'No FSMA 204 date published', items: ['q10'], general: true },
  { id: 'sprouts', label: 'Sprouts', status: 'published', source: 'sprouts', text: 'Supplier compliance with GFSI standards; no FSMA 204 specifics found.', date: null, dateNote: 'No FSMA 204 date published', items: ['q13'], general: true },
  { id: 'sysco', label: 'Sysco', status: 'published', source: 'sysco', text: 'Produce audits from a listed set of schemes; announced FSMA 204 data-sharing options in 2024 with no deadline or label spec found.', date: null, dateNote: 'No FSMA 204 date published', items: ['q13'], general: true },
  { id: 'usfoods', label: 'US Foods', status: 'published', source: 'usfoods', text: 'Exclusive Brands produce suppliers GFSI certified; building a traceability data platform. No deadline found.', date: null, dateNote: 'No FSMA 204 date published', items: ['q13'], general: true }
);
Object.assign(IOMIST_DATA.short, {
  publix: 'Yearly farm audit. GTIN with a GS1 prefix.', aldi: 'GFSI or GMP certified. Shipping notice, pallet plates.',
  sprouts: 'GFSI-based supplier compliance.', sysco: 'Audit from a listed scheme. Data-sharing options.', usfoods: 'Exclusive Brands: GFSI certified.'
});
// One line per buyer for the audit gate sign in the scene
IOMIST_DATA.gateLine = {
  walmart: 'GFSI-certified; harvest in audit scope by Aug 1, 2027', albertsons: 'Own Brands: GAP growers, GFSI packers, yearly',
  costco: 'Approved audit + Addendum + unannounced audit', wholefoods: 'Third-party audit, preferably GFSI (2015)',
  target: 'GFSI certification; GAP or GFSI-benchmarked audit', publix: 'Yearly farm audit: area, crew, cooler, shed',
  aldi: 'GFSI or GMP certification', sprouts: 'GFSI-based supplier compliance', sysco: 'Audit from a listed scheme (GFSI-recognized)', usfoods: 'Exclusive Brands: GFSI certified'
};
IOMIST_DATA.industry = { id: 'industry', label: 'PTI / GS1 baseline', source: 'gs1quick' };
IOMIST_DATA.topics = { data: 'Lot code and dates', label: 'Barcodes and labels', ship: 'Shipping notice data', trace: 'Fast trace and mock recall', audit: 'Audit records', own: 'Yours to hold' };
IOMIST_DATA.reqs = [
  // Walmart (its own supplier pages)
  { id: 'w1', buyer: 'walmart', stop: 'shipping', kind: 'ship', q: 'q10', text: 'Shipping notice (EDI 856) with the FSMA 204 key data elements on every food shipment', date: '2025-08-01', conf: 'High', source: 'walmart', iomist: 'covers' },
  { id: 'w2', buyer: 'walmart', stop: 'shipping', kind: 'label', q: 'q11', text: 'Pallet barcode: SSCC-18, linked to the shipping notice', date: '2025-08-01', conf: 'High', source: 'walmart', iomist: 'covers' },
  { id: 'w3', buyer: 'walmart', stop: 'packing', kind: 'label', q: 'q11', text: 'Case barcode: GS1-128, able to carry traceability data', date: '2025-08-01', conf: 'High', source: 'walmart', iomist: 'covers' },
  { id: 'w4', buyer: 'walmart', stop: 'packing', kind: 'data', q: 'q3', text: 'Lot or batch code, a date code, and where the lot code was generated', date: '2025-08-01', conf: 'High', source: 'walmart', iomist: 'covers' },
  { id: 'w9', buyer: 'walmart', stop: 'harvest', kind: 'trace', q: 'q12', text: 'Leafy greens and green bell peppers: trace every purchase order to the farm by harvest lot', date: null, conf: 'High', source: 'walmartProduce', iomist: 'covers' },
  { id: 'w5', buyer: 'walmart', stop: 'receiving', kind: 'own', text: 'Declare which items are on the FDA list (Supplier One)', date: null, conf: 'High', source: 'walmart', iomist: 'own' },
  { id: 'w6', buyer: 'walmart', stop: 'gate', kind: 'audit', q: 'q13', text: 'Farm to packing operations certified to a GFSI-recognized audit', date: null, conf: 'High', source: 'walmartProduce', iomist: 'records' },
  { id: 'w7', buyer: 'walmart', stop: 'gate', kind: 'audit', q: 'q13', text: 'Harvest activities inside the audit scope', date: '2027-08-01', conf: 'High', source: 'walmartProduce', iomist: 'records' },
  { id: 'w8', buyer: 'walmart', stop: 'gate', kind: 'own', text: 'California and Arizona leafy greens: LGMA certified', date: null, conf: 'High', source: 'walmartProduce', iomist: 'own' },
  // Kroger
  { id: 'k1', buyer: 'kroger', stop: 'shipping', kind: 'ship', q: 'q10', text: 'Shipping notice (EDI 856) for every shipment, all food', date: '2025-06-30', conf: 'High', source: 'kroger', iomist: 'covers' },
  { id: 'k2', buyer: 'kroger', stop: 'shipping', kind: 'label', q: 'q11', text: 'Pallet label: SSCC in GS1-128 or Data Matrix, inside the shrink-wrap', date: '2025-06-30', conf: 'High', source: 'kroger', iomist: 'covers' },
  { id: 'k3', buyer: 'kroger', stop: 'packing', kind: 'label', q: 'q11', text: 'Case label: GTIN-14, lot, a product date, quantity; GS1-128 or 2D Data Matrix; two labels per case', date: '2025-06-30', conf: 'High', source: 'kroger', iomist: 'covers' },
  { id: 'k4', buyer: 'kroger', stop: 'packing', kind: 'label', q: 'q11', text: 'Produce: PTI case label with a GS1-128 barcode (letter of Dec 20, 2022)', date: null, conf: 'High', source: 'krogerPTI', iomist: 'covers' },
  { id: 'k5', buyer: 'kroger', stop: 'gate', kind: 'none', text: 'Produce audit requirement: not found in a document we could read', date: null, conf: null, source: 'kroger', iomist: 'none' },
  // Albertsons
  { id: 'a1', buyer: 'albertsons', stop: 'receiving', kind: 'data', q: 'q3', text: 'All food, even if exempt under FDA’s rule; no further extensions', date: '2027-01-01', conf: 'High', source: 'albertsons', iomist: 'covers' },
  { id: 'a2', buyer: 'albertsons', stop: 'shipping', kind: 'ship', q: 'q10', text: 'Shipping notice with lot code, its source (GLN or DUNS), GTIN, quantity, ship date, locations, PO, BOL, product date, pallet SSCC', date: '2027-01-01', conf: 'High', source: 'albertsons', iomist: 'covers' },
  { id: 'a3', buyer: 'albertsons', stop: 'shipping', kind: 'data', q: 'q7', text: 'A reference document (BOL, packing list or invoice) carrying matching data', date: '2027-01-01', conf: 'High', source: 'albertsons', iomist: 'covers' },
  { id: 'a5', buyer: 'albertsons', stop: 'shipping', kind: 'label', q: 'q11', text: 'Pallet: GS1 SSCC barcode matching the shipping notice', date: '2027-01-01', conf: 'High', source: 'albertsons', iomist: 'covers' },
  { id: 'a4', buyer: 'albertsons', stop: 'packing', kind: 'label', q: 'q11', text: 'Case: GS1-128 with GTIN, lot (AI 10), and pack date (AI 13) or expiry (AI 17)', date: '2027-01-01', conf: 'High', source: 'albertsons', iomist: 'covers' },
  { id: 'a6', buyer: 'albertsons', stop: 'gate', kind: 'audit', q: 'q13', text: 'Own Brands produce: growers annual third-party GAP; packers, coolers, processors annual GFSI certification', date: null, conf: 'High', source: 'albertsonsAudit', iomist: 'records' },
  { id: 'a7', buyer: 'albertsons', stop: 'gate', kind: 'own', text: 'Own Brands: LGMA membership for California and Arizona leafy greens handlers', date: null, conf: 'High', source: 'albertsonsAudit', iomist: 'own' },
  // Costco (v3.0 audit expectations, read in full)
  { id: 'c1', buyer: 'costco', stop: 'gate', kind: 'audit', q: 'q15', text: 'Audited annually to a Costco-approved standard by a Costco-approved certification body; report goes to Costco', date: '2025-09-01', conf: 'High', source: 'costco', iomist: 'records' },
  { id: 'c2', buyer: 'costco', stop: 'gate', kind: 'audit', q: 'q15', text: 'Costco Addendum done with that audit, where required', date: '2025-09-01', conf: 'High', source: 'costco', iomist: 'records' },
  { id: 'c3', buyer: 'costco', stop: 'gate', kind: 'audit', q: 'q15', text: 'Costco’s own audit: unannounced, in a 60-day window; a first-time supplier gets an announced Introductory audit', date: '2025-09-01', conf: 'High', source: 'costco', iomist: 'records' },
  { id: 'c5', buyer: 'costco', stop: 'gate', kind: 'trace', q: 'q12', text: 'Trace a specific lot one step back and one step forward within 2 hours', date: '2025-09-01', conf: 'High', source: 'costco', iomist: 'covers' },
  { id: 'c6', buyer: 'costco', stop: 'gate', kind: 'trace', q: 'q12', text: 'Annual mock recall; account for 100% of product within 2 hours', date: '2025-09-01', conf: 'High', source: 'costco', iomist: 'covers' },
  { id: 'c7', buyer: 'costco', stop: 'packing', kind: 'label', q: 'q11', text: 'Produce should carry a packed-on date or a scannable barcode or QR code with traceability data', date: '2025-09-01', conf: 'High', source: 'costco', iomist: 'covers' },
  { id: 'c8', buyer: 'costco', stop: 'packing', kind: 'data', q: 'q3', text: 'Julian-code dating is not acceptable', date: '2025-09-01', conf: 'High', source: 'costco', iomist: 'covers' },
  { id: 'c9', buyer: 'costco', stop: 'packing', kind: 'data', q: 'q6', text: 'Bagged salads and romaine products show harvest region and pack date', date: '2025-09-01', conf: 'High', source: 'costco', iomist: 'covers' },
  // Whole Foods (thin and old: flagged Medium)
  { id: 'wf1', buyer: 'wholefoods', stop: 'packing', kind: 'label', q: 'q11', text: 'PTI-compliant case labels asked for, as a prerequisite to its produce ratings program (undated; program began 2014)', date: null, conf: 'Medium', source: 'wfPTI', iomist: 'covers' },
  { id: 'wf2', buyer: 'wholefoods', stop: 'gate', kind: 'audit', q: 'q13', text: 'Third-party audit for high-risk produce vendors, preferably GFSI-recognized (2015)', date: null, conf: 'Medium', source: 'wf2015', iomist: 'records' },
  { id: 'wf3', buyer: 'wholefoods', stop: 'receiving', kind: 'none', text: 'FSMA 204 supplier specification and date: not found', date: null, conf: null, source: 'wholeFoods', iomist: 'none' },
  // Target
  { id: 't1', buyer: 'target', stop: 'gate', kind: 'audit', q: 'q13', text: 'Facilities hold GFSI certification (required since 2009)', date: null, conf: 'High', source: 'target', iomist: 'records' },
  { id: 't2', buyer: 'target', stop: 'packing', kind: 'data', q: 'q3', text: 'Product traceability through open date code or lot traceability programs', date: null, conf: 'High', source: 'target', iomist: 'covers' },
  { id: 't3', buyer: 'target', stop: 'gate', kind: 'audit', q: 'q13', text: 'High-risk produce growers: GFSI-benchmarked audit; other produce: an approved GAP audit (2019 document)', date: null, conf: 'Medium', source: 'targetAudit', iomist: 'records' },
  { id: 't4', buyer: 'target', stop: 'receiving', kind: 'none', text: 'FSMA 204 deadline, label or shipping-notice specification: not found', date: null, conf: null, source: 'target', iomist: 'none' },
  // Publix
  { id: 'p1', buyer: 'publix', stop: 'gate', kind: 'audit', q: 'q13', text: 'Annual or per-season third-party audit for each growing area, harvest crew, cooler and packing house', date: null, conf: 'High', source: 'publix', iomist: 'records' },
  { id: 'p2', buyer: 'publix', stop: 'packing', kind: 'label', q: 'q11', text: 'Every packaged retail product has a GTIN with a GS1 company prefix', date: null, conf: 'High', source: 'publix', iomist: 'covers' },
  { id: 'p4', buyer: 'publix', stop: 'gate', kind: 'trace', q: 'q12', text: 'Publix Brand suppliers: documented forward and reverse traceability, quarterly mock recalls', date: null, conf: 'High', source: 'publix', iomist: 'covers' },
  { id: 'p3', buyer: 'publix', stop: 'receiving', kind: 'none', text: 'FSMA 204 deadline and case-label lot specification: not found', date: null, conf: null, source: 'publix', iomist: 'none' },
  // Aldi, Sprouts, Sysco, US Foods
  { id: 'ald1', buyer: 'aldi', stop: 'gate', kind: 'audit', q: 'q13', text: 'Facilities hold GFSI or GMP certification (undated page)', date: null, conf: 'High', source: 'aldi', iomist: 'records' },
  { id: 'ald2', buyer: 'aldi', stop: 'shipping', kind: 'ship', q: 'q10', text: 'Electronic shipping notice and pallet license-plate numbers for loads (undated page)', date: null, conf: 'High', source: 'aldi', iomist: 'covers' },
  { id: 'sp1', buyer: 'sprouts', stop: 'gate', kind: 'audit', q: 'q13', text: 'Supplier compliance with GFSI standards; yearly facility audits where they apply', date: null, conf: 'Medium', source: 'sprouts', iomist: 'records' },
  { id: 'sy1', buyer: 'sysco', stop: 'gate', kind: 'audit', q: 'q13', text: 'Produce audits only from a listed set of schemes; packing facility or cooler also audited (2024 letter)', date: null, conf: 'High', source: 'sysco', iomist: 'records' },
  { id: 'us1', buyer: 'usfoods', stop: 'gate', kind: 'audit', q: 'q13', text: 'Exclusive Brands produce suppliers are required to have GFSI certification', date: null, conf: 'High', source: 'usfoods', iomist: 'records' },
  // Industry baseline (PTI, GS1 US, IFPA)
  { id: 'i1', buyer: 'industry', stop: 'packing', kind: 'label', q: 'q11', text: 'Case: GTIN and lot in a GS1-128 barcode, with date and pack date readable (PTI, GS1 US minimum)', date: null, conf: 'High', source: 'gs1quick', iomist: 'covers' },
  { id: 'i2', buyer: 'industry', stop: 'shipping', kind: 'label', q: 'q11', text: 'Pallet: SSCC in a GS1-128 barcode', date: null, conf: 'High', source: 'gs1quick', iomist: 'covers' },
  { id: 'i3', buyer: 'industry', stop: 'shipping', kind: 'data', q: 'q7', text: 'Shipment records one step up and one step down', date: null, conf: 'High', source: 'pti', iomist: 'covers' },
  { id: 'i4', buyer: 'industry', stop: 'packing', kind: 'label', q: 'q11', text: 'Add a 2D code (GS1 DataMatrix) to the case label: IFPA 2026 recommendation; the Sunrise 2027 date is not verified', date: null, conf: 'Medium', source: 'ifpa', iomist: 'covers' }
];

// Costco's audit gate. Read 2026-11-05 in Costco's "Global Food Safety Audit Expectations for Costco Suppliers" v3.0
// (effective 2025-09-01; the General Audit Requirements, Costco Audit Standards on pp. 13-14, Product Traceability p. 17).
IOMIST_DATA.gate = {
  buyer: 'costco', source: 'costco',
  title: 'COSTCO AUDIT GATE',
  checks: [
    'Audited annually to a Costco-approved standard',
    'Costco Addendum done with that audit, where required',
    'Costco’s own food safety audit: unannounced'
  ],
  intro: 'A supplier with no earlier third-party audit gets an announced Introductory audit first. Costco may grant a grace period before starting business, for operations that cannot change their certification.',
  trace: 'Then the trace test: one lot, one step back and one step forward, within 2 hours, plus an annual mock recall.'
};

/* ---------- The FDA rule as a layer (21 CFR 1.1305 to 1.1455, eCFR 2026-11-01; FDA rule page current as of 2026-11-04) ----------
   Congress barred enforcement before 2028-07-20; FDA's formal date change is proposed, not found as a final rule. */
IOMIST_DATA.fdaBuyer = { id: 'fda', label: 'FDA rule', source: 'fdaRule', date: '2028-07-20' };
IOMIST_DATA.short.fda = 'Records in 24 hours. Enforcement not before Jul 20, 2028.';
IOMIST_DATA.gateLine.fda = 'Records on request: 24 hours, sortable spreadsheet';
IOMIST_DATA.reqs.push(
  { id: 'f1', buyer: 'fda', stop: 'harvest', kind: 'data', q: 'q4', text: 'Harvest records: field, date, quantity, who it goes to, farm location', date: '2028-07-20', dateLabel: 'enforcement not before', conf: 'High', source: 'cfr', iomist: 'covers' },
  { id: 'f2', buyer: 'fda', stop: 'cooling', kind: 'data', q: 'q5', text: 'If cooled before packing: where and when', date: '2028-07-20', dateLabel: 'enforcement not before', conf: 'High', source: 'cfr', iomist: 'covers' },
  { id: 'f3', buyer: 'fda', stop: 'packing', kind: 'data', q: 'q3', text: 'At initial packing: assign the traceability lot code; record harvester, packing date and place', date: '2028-07-20', dateLabel: 'enforcement not before', conf: 'High', source: 'tlc', iomist: 'covers' },
  { id: 'f4', buyer: 'fda', stop: 'shipping', kind: 'data', q: 'q7', text: 'At shipping: lot code, ship date, recipient, where the lot code came from, a reference document', date: '2028-07-20', dateLabel: 'enforcement not before', conf: 'High', source: 'cfr', iomist: 'covers' },
  { id: 'f5', buyer: 'fda', stop: 'gate', kind: 'trace', q: 'q9', text: 'Give FDA the records within 24 hours, as an electronic sortable spreadsheet (farms at $250,000 or less are exempt from the spreadsheet)', date: '2028-07-20', dateLabel: 'enforcement not before', conf: 'High', source: 'cfr', iomist: 'covers' },
  { id: 'f6', buyer: 'fda', stop: 'gate', kind: 'own', q: 'q8', text: 'A written traceability plan with a map of your fields', date: '2028-07-20', dateLabel: 'enforcement not before', conf: 'High', source: 'cfr', iomist: 'own' },
  { id: 'f7', buyer: 'fda', stop: 'gate', kind: 'data', text: 'Keep the records for two years', date: '2028-07-20', dateLabel: 'enforcement not before', conf: 'High', source: 'cfr', iomist: 'covers' }
);
// The three scanners and what each is for, as Iomist's own proposal (Nov 2026, shared privately) describes them. Vendor claims until Taylor confirms.
IOMIST_DATA.scanners = {
  field:  'Field scanner: for packing in the field. Scans pallets of clamshells right where they are harvested.',
  line:   'Line scanner: for high-speed packing lines. Mounts on the existing line and scans at full speed.',
  mobile: 'Mobile phone scanner: for smaller or lower-volume runs. Scans a full case in one pass and ties it to its lot, pallet and shipment.',
  chain:  'One connected record: field, clamshell (its own QR code), case (built from scanned packs), pallet (tied to its cases), shipment (tied to its pallets), retailer.'
};

// Dated things to watch on the clock (each with its source)
IOMIST_DATA.watch = [
  { d: '2027-12-31', t: 'Sunrise 2027', s: 'goal: 2D codes at checkout', url: 'https://www.gs1us.org/industries-and-insights/by-topic/sunrise-2027' },
  { d: '2026-11-06', t: 'FDA public meeting', s: 'lot-level traceability, virtual; Congress asked FDA to talk about flexibilities', url: 'https://www.federalregister.gov/documents/2026/10/09/2026-20720/challenges-and-solutions-in-lot-level-food-traceability-public-meeting' }
];

if (typeof module !== 'undefined') module.exports = IOMIST_DATA;
