/* The Owner's Desk: every word on the page, by door. index.html is the engine.
   Doors: owner (default) and cpa, picked by ?for=cpa. Facts come from the ACA documents already used by Dealer City;
   the health-cost line is cited on the letter. No "IRS-approved", no guaranteed savings, every figure an estimate. */
window.DESK = {
  // the model's sector shape, so bonus-lot/model.js runs unchanged: no industry benchmarks (zeros), locations instead of brands
  sector: {
    bench: { rpe: [0, 0, 0, 0], margin: [0, 0, 0, 0], unit: [0, 0, 0, 0] },
    labels: [['Headquarters', '#8366ea'], ['Office', '#2a5db0'], ['Shop', '#c9a227'], ['Warehouse', '#36405a'], ['Clinic', '#2f63d1'], ['Branch', '#3f6b3f'], ['Kitchen', '#c3002f'], ['Yard', '#a6192e'], ['Studio', '#d65db1'], ['Plant', '#5c5f6b']],
    sizes: { emp: 50, add: 25, state: 'PA' }
  },
  // the renewal letter's one statistic, with its source printed beside it
  stat: {
    line: 'Employers expect health benefit costs to rise 8.2% in 2027 after the changes they plan to make, the biggest increase since 2003. Without changes, 11%.',
    src: 'Mercer, 2026 National Survey of Employer-Sponsored Health Plans, preliminary findings',
    url: 'https://www.mercer.com/en-us/insights/us-health-news/survey-health-benefit-costs-expected-to-jump-in-2027/'
  },
  // the case, front loaded: shown on the opening of both doors. KCP is never named bare.
  proof: 'Three independent firms have put written opinions in support: outside ERISA counsel, CBIZ, and KCP (CPAs and former IRS special agents and auditors).',
  doors: {
    owner: {
      sub: 'A Section 125 Wellness Plan, explained on the desk where the renewal letter landed. Pick up anything. Nothing is signed on these numbers.',
      first: 'letter', start: 'Open the letter →',
      open: [['Health costs went up again.', 'Payroll tax can come down.'], ['Start any month.', 'Nothing changes on your health plan.']],
      live: (emp, lift) => `On a ${emp}-person company: ${lift} a year to the bottom line, before you change a number.`,
      letterTurn: 'This letter is about the plan you have. Keep it. The desk is about a different line on payroll: the 7.65% that leaves every pay period, on every W-2 dollar, before anyone is paid.',
      cta: ['Run my real payroll →', 'Section 125 Wellness Plan: payroll analysis'],
      ctaFine: 'Next step: a payroll analysis. It confirms who qualifies and what the company saves before anything is signed.',
      print: ['One page for your CPA and partners', 'Prepared on The Owner\'s Desk · illustrative until a payroll analysis confirms it'],
      extra: null
    },
    cpa: {
      sub: 'A Section 125 Wellness Plan, laid out on your client\'s desk. Something to bring to the owner that costs them nothing to look at.',
      first: 'binder', start: 'See the case →',
      open: [['Your clients just opened their renewals.', 'They will ask you what to do.'], ['Here is one answer', 'that costs them nothing to look at.']],
      live: (emp, lift) => `A ${emp}-person client: ${lift} a year to their bottom line, before you change a number.`,
      letterTurn: 'The letter is about the plan the client has, and it stays. The desk is about a different line on their payroll: the 7.65% employer FICA that leaves every pay period, before anyone is paid.',
      cta: ['Bring it to one client →', 'Section 125 Wellness Plan: a client payroll analysis'],
      ctaFine: 'Next step: a payroll analysis on one client. It confirms who qualifies and what they save before anything is signed.',
      print: ['One page for your client', 'Prepared on The Owner\'s Desk · illustrative until a payroll analysis confirms it'],
      extra: {
        h: 'What this is for a CPA',
        p: [
          'Every renewal season the same question lands on your desk: what do we do about this? Most answers cost the client something. This one is paid for by payroll tax the client already sends out, and it sits beside the health plan they have.',
          'You see the case first. The three written opinions, the CBIZ actuarial work and SOC 1, the KCP engagement and the ERISA-written plan documents are in the binder on this desk, and the plan is run to those documents.',
          'CPAs who bring it to a client sign a written referral agreement. Ask and I\'ll send it.'
        ]
      }
    }
  },
  // the pay stub, one employee at the default plan level: the engine fills the numbers
  stub: {
    h: 'One pay stub, before and after',
    note: 'The employee elects a pre-tax contribution to the wellness plan. Taxable wages drop by that amount, so the employer\'s 7.65% FICA on it goes away. The plan\'s fee comes out of that saving. The employee\'s own FICA and income tax drop too, which is where the higher take-home comes from. The payroll analysis sets each person\'s real level.'
  },
  pnl: {
    h: 'The P&L, with the plan slid onto it',
    lines: {
      lift: 'Payroll tax the company no longer sends out',
      fee: 'Plan administration',
      feeNote: 'paid out of the saving, not out of the company',
      claims: 'Visits and prescriptions that never reach the company health plan (estimate)',
      net: 'Net profit, before → after'
    },
    netAsk: 'Your net profit last year, if you want the lift as a share of it. Optional, stays on this page.'
  },
  calendar: {
    h: 'Start any month',
    p: 'Nothing waits for open enrollment and nothing changes on major medical. Thirty days to set up and enroll, live on the first of the month you pick. Tap the month.'
  },
  // the binder: the case, front loaded. Three independent firms in writing, then the documents and the care. Facts as Jay stated them 2026-11-07. No dollar figure on the E&O. Nothing on this page says the IRS approves anything, and nothing claims it does.
  binder: {
    h: 'Three independent firms. Three written opinions in support.',
    p: 'Section 125 wellness plans have been pitched for years, and a CPA is right to be skeptical. This is the case, in the order a CPA will ask for it.',
    tabs: [
      ['Outside ERISA counsel: a written opinion.', 'An ERISA law firm has reviewed the program against the legal requirements that apply to it and put its opinion in writing.'],
      ['CBIZ: the actuarial work, the plan review and a SOC 1.', 'CBIZ did the actuarial underwriting on the plan\'s tiers, reviewed the plan document against the Section 125 requirements in writing, and completed a SOC 1 report on how the plan is run. A SOC 1 Type 2 is under way.'],
      ['KCP engages with the company directly, as part of the program.', 'KCP (CPAs and former IRS special agents and auditors) holds that the tax treatment is supported by substantial authority under current law. Its engagement is signed directly with the company, with a tax indemnity policy or an errors-and-omissions policy written on this plan. If the IRS asks, KCP answers.'],
      ['Plan and compliance documents written by ERISA counsel.', 'The plan document and the compliance documents are written and approved by outside ERISA counsel, and the plan is run to them. Your CPA and counsel can read all of it before anything is signed.'],
      ['Benefits include in-person medical care, not just virtual care.', 'Most plans of this kind are virtual only. This one adds in-person benefits and discounts beside the $0 virtual care, so employees have a reason to use it.']
    ]
  },
  // the phone: every question Dealer City answers, reworded for a company. Each is a short stepped read.
  questions: [
    { q: 'What is this?', g: 'start', beats: [
      ['One plan. Three winners.', 'Payroll tax already leaves the company every pay period. The Section 125 Wellness Plan redirects it. The company keeps a share, the employees keep a share, the administrator takes the fee.'],
      ['Employees: care at no cost.', '$0 virtual primary care, urgent care, therapy, dermatology, 70-plus generics and coaching, for the employee and their family, plus in-person discounts and benefits. No copay, no claim.'],
      ['Employees: more take-home.', 'The contribution is pre-tax, so the same paycheck takes home more, and the wellness reward comes back on it. The payroll analysis shows each person\'s number before anything is signed.'],
      ['The company: the tax it no longer owes.', 'Lower taxable wages mean less employer FICA: {fica} a month per enrolled employee, {per} after the plan\'s fee. That is net.'],
      ['The administrator: the fee that runs it.', 'A fee comes out of the tax saving, not out of the company. It pays for enrollment, claims, compliance and audit defense.'],
      ['Major medical stays exactly where it is.', 'This is a wellness plan with a fixed indemnity benefit, not health insurance. It sits beside the plan you have and never replaces it.']]},
    { q: 'How is it paid for?', g: 'start', beats: [
      ['By payroll tax that was already leaving.', 'Every pay period, 7.65% of each W-2 dollar goes out as employer FICA. The pre-tax election lowers the wages that tax is figured on.'],
      ['Three shares of the same money.', 'The company keeps {per} a month per enrolled employee after the fee. The employee keeps more take-home. The administrator takes the fee. Nothing new comes out of anyone\'s pocket.']]},
    { q: 'I\'ve heard this pitched before. What\'s different?', g: 'hard', binder: true, beats: [
      ['So has your CPA.', 'The binder on this desk has the case: three independent firms with written opinions in support, CBIZ\'s actuarial work and SOC 1, KCP engaging with the company directly, plan and compliance documents written by ERISA counsel, and in-person care. Open it.']]},
    { q: 'What does it cost the company?', g: 'hard', beats: [
      ['Nothing out of pocket.', 'A portion is withheld from the employee\'s tax saving and a fee comes out of the company\'s tax saving. The program is covered by taxes already being paid.'],
      ['The catch is an invoice.', 'An invoice for the plan contribution plus the $40 fee, per enrolled employee a month. All of it is money that was already leaving as payroll tax. Designed to be cost-neutral.']]},
    { q: 'Is it compliant? Who keeps it that way?', g: 'hard', binder: true, beats: [
      ['Three independent firms, three written opinions.', 'Outside ERISA counsel, CBIZ and KCP each put their opinion in writing. The plan and compliance documents are written and approved by ERISA counsel, and the payroll analysis checks every number before anything is signed.'],
      ['Read it before you decide.', 'Your CPA and counsel can read the opinions, the plan documents and the compliance documents before anything is signed. If it is not a fit, saying no is easy.']]},
    { q: 'We\'re self-funded. Where does it fit?', g: 'hard', beats: [
      ['In front of your plan.', 'Make it the first stop for everyday care. Those visits and prescriptions never reach the self-funded or level-funded plan, so its cost drops.'],
      ['Two ways it pays.', 'The payroll-tax saving on every enrolled employee, plus the claims that never hit the company plan. The second number comes from your TPA\'s 12-month claims summary, not from this page.']]},
    { q: 'Will it cut my workers\' comp?', g: 'hard', beats: [
      ['It could, in certain states.', 'Workers\' comp premium is rated on reportable payroll, and in certain states carriers have accepted the lower reportable payroll after the plan. Your state, your carrier and your class codes decide it.'],
      ['Any saving there is on top of this page.', 'The numbers here are federal payroll tax only. Ask your broker to run it before counting on it.']]},
    { q: 'Why would employees sign up?', g: 'company', beats: [
      ['They are automatically in.', 'Enrollment is opt-out. Everyone who qualifies is enrolled, and the payroll analysis confirms each person comes out ahead before go-live.'],
      ['More take-home, and care at no cost.', 'More on the same paycheck, plus virtual and in-person care for them and their dependents. Anyone who does not want that can opt out.'],
      ['Over 90% stay in.', 'We average over 90% enrollment of qualified participants.']]},
    { q: 'Who qualifies? Hourly, part-time, the owner?', g: 'company', beats: [
      ['Every job role.', 'W-2 employees who pay enough in taxes qualify, in any role, full-time or part-time, on any pay plan. The payroll analysis sets each person\'s plan level by wages.'],
      ['One condition.', 'The employee has to be covered by an ACA-compliant group health plan, yours or a spouse\'s. Someone who declined coverage is not in.'],
      ['Not the owner.', 'Owners above 2% of an S corporation, partners and members paid on a K-1 cannot join a Section 125 plan. They get the company\'s saving instead.']]},
    { q: 'How much work is it, and how fast?', g: 'company', beats: [
      ['We do the work.', 'Set-up, payroll integration and ongoing monitoring. Thirty days to educate everyone, short enrollment meetings by department on paid time, and go-live on the first of a month.'],
      ['Starting with one location is fine.', 'Groups can start with one location and roll it to the rest. Every number is confirmed by the payroll analysis before anything is signed.']]}
  ],
  groups: { start: 'Start here', hard: 'The hard questions', company: 'My company' },
  disclaimer: 'Illustrative only. No specific tax outcome is guaranteed; results depend on a payroll analysis and on current federal and state law. Employer figures use the plan\'s published per-employee math (the monthly pre-tax contribution × 7.65% FICA, less the plan\'s administration fee) and leave out any workers\' compensation, FUTA or SUTA effect. Net profit is your own entry, not a forecast for your company. Participation is voluntary; employees typically see higher take-home pay, though some do not. This is a fixed indemnity benefit, not health insurance; it sits alongside, not in place of, major medical. Wellness payments above an employee\'s unreimbursed medical expenses may be taxable to the employee. This is a marketing communication, not legal, tax, accounting or financial advice.'
};
