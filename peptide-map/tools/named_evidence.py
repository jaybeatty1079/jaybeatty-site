#!/usr/bin/env python3
"""The same counts as evidence.py, for the fifteen cards build.py names by hand (CARDS). They stay out of compounds.txt,
which would make them duplicate "more" cards. Run: python3 peptide-map/tools/named_evidence.py -> peptide-map/data/named-evidence.json"""
import json, os
from evidence import grade_one, grade, HERE
OUT = os.path.join(HERE, '..', 'data', 'named-evidence.json')
NAMED = [  # id, name as on the card, search synonyms
    ('bpc-157', 'BPC-157', ['BPC 157', 'BPC157']), ('tb-500', 'TB-500', ['TB500', 'thymosin beta-4 fragment']),
    ('mots-c', 'MOTS-c', ['MOTSc']), ('kpv', 'KPV', ['Lys-Pro-Val']), ('epitalon', 'Epitalon', ['epithalon', 'AEDG peptide']),
    ('semax', 'Semax', []), ('ipamorelin', 'Ipamorelin', []), ('cjc-1295', 'CJC-1295', ['CJC 1295']),
    ('kisspeptin-10', 'Kisspeptin-10', ['kisspeptin 10', 'metastin 45-54']), ('nad', 'NAD+', ['nicotinamide adenine dinucleotide']),
    ('ghk-cu', 'GHK-Cu', ['GHK-Cu peptide', 'copper tripeptide', 'copper peptide GHK']), ('sermorelin', 'Sermorelin', ['Geref']),
    ('semaglutide', 'Semaglutide', ['Ozempic', 'Wegovy', 'Rybelsus']), ('tirzepatide', 'Tirzepatide', ['Mounjaro', 'Zepbound']),
    ('retatrutide', 'Retatrutide', ['LY3437943'])]
rows = []
for cid, name, syn in NAMED:
    r = grade_one(cid, name, '', '', syn)
    hit = r.get('approved')  # openFDA's label search is fuzzy: a hit counts only when its generic name is the compound, as in build.py's more_card
    if hit and name.lower() not in (hit.get('generic') or '').lower(): r['approved'] = None; r['grade'] = grade(r)
    rows.append(r)
json.dump(rows, open(OUT, 'w'), indent=1); print('wrote', os.path.normpath(OUT), len(rows))
