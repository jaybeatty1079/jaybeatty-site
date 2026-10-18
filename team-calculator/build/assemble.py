import json
s=open('build/app.js').read()
out=json.load(open('data_target_prices_py1.json')); parts=json.load(open('data_participants.json'))
slim=[{'type':p['type'],'ccn':p['ccn'],'name':p['name'],'cbsa_name':p['cbsa_name'],'state':p['state'],'new':str(p['new']).strip().upper()=='Y'} for p in parts]
t=open('build/template.html').read().replace('__TP__',json.dumps(out,separators=(',',':'))).replace('__PARTS__',json.dumps(slim,separators=(',',':'))).replace('__CASES__',open('data_cases.json').read()).replace('__HM__',open('data_hospital_slim.json').read()).replace('__APP__',s)
open('team-calculator.html','w').write(t)
import shutil; shutil.copy('team-calculator.html','/Users/jaybeatty/Claude/site-redesign/team-calculator.html'); print('built',len(t)//1024,'KB')

# artifact variant: no document wrappers, no print button
import re
art=t
art=re.sub(r'^<!doctype html>\s*<html lang="en">\s*<head>\s*','',art)
art=art.replace('<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n','')
art=art.replace('</head>\n<body>\n','').replace('</body>\n</html>\n','').replace('</body>\n</html>','')
art=art.replace('<button class="btn small" type="button" onclick="window.print()">Print this scenario</button>','')
open('build/artifact.html','w').write(art); print('artifact variant',len(art)//1024,'KB', art[:60].replace('\n',' '))
