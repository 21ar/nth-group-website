"""Verify the actual generated public document graph, including cross-page anchors."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, unquote
import json

root = Path('.vercel/output/static')
class Document(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.ids=[]; self.hrefs=[]; self.assets=[]; self.h1=0; self.title=''; self.in_title=False; self.meta={}; self.canonical=None
        self.feed(text)
    def handle_starttag(self, tag, attributes):
        a=dict(attributes)
        if a.get('id'): self.ids.append(a['id'])
        if tag=='h1': self.h1+=1
        if tag=='title': self.in_title=True
        if tag=='meta': self.meta[a.get('name',a.get('property',''))]=a.get('content','')
        if tag=='link' and a.get('rel')=='canonical': self.canonical=a.get('href')
        if tag in ['a','use'] and a.get('href'): self.hrefs.append(a['href'])
        if a.get('src'): self.assets.append(a['src'])
        if tag=='link' and a.get('rel') in ['stylesheet','preload','icon'] and a.get('href'): self.assets.append(a['href'])
        if a.get('srcset'): self.assets.extend(part.strip().split(' ')[0] for part in a['srcset'].split(','))
    def handle_endtag(self, tag):
        if tag=='title': self.in_title=False
    def handle_data(self, data):
        if self.in_title: self.title+=data

documents={}
for file in root.rglob('*.html'):
    relative=file.relative_to(root).as_posix()
    if relative=='404.html': continue
    route='/' if relative=='index.html' else '/'+relative.removesuffix('/index.html').removesuffix('.html')
    documents[route]=Document(file.read_text())
issues=[]; checks=0
def verify(value, label):
    global checks
    checks+=1
    if not value: issues.append(label)
def resolve(value, route):
    url=urlparse(value)
    if url.scheme and url.scheme!='https' or url.netloc and url.netloc!='nrth.group': return None
    path=unquote(url.path or route).rstrip('/') or '/'
    return path, unquote(url.fragment)

for route, document in documents.items():
    verify(document.h1==1, route+': exactly one h1')
    verify(len(document.ids)==len(set(document.ids)),route+': unique IDs')
    verify(document.canonical=='https://nrth.group'+route,route+': correct canonical')
    verify(document.meta.get('robots')=='index,follow',route+': indexable public document')
    verify(len(document.meta.get('description',''))>40,route+': useful description')
    for value in document.hrefs:
        target=resolve(value,route)
        if not target: continue
        path,fragment=target
        if path.startswith(('/api/','/preview')): continue
        if path in documents:
            verify(not fragment or fragment in documents[path].ids,route+': '+value+' fragment exists')
        else: verify((root/path.lstrip('/')).is_file(),route+': '+value+' artifact exists')
    for value in document.assets+[document.meta.get('og:image','')]:
        target=resolve(value,route)
        if target: verify((root/target[0].lstrip('/')).is_file(),route+': '+value+' asset exists')
verify(len({d.title for d in documents.values()})==len(documents),'Public titles are unique')
verify(len({d.meta.get('description') for d in documents.values()})==len(documents),'Public descriptions are unique')
sitemap=(root/'sitemap-0.xml').read_text()
verify('/search-index.json' not in sitemap and '/preview' not in sitemap and '/api/' not in sitemap,'Sitemap exposes documents without internal endpoints')
for route in documents: verify('https://nrth.group'+route+'<' in sitemap,route+': listed in sitemap')
report={'pages':len(documents),'checks':checks,'passed':not issues,'issues':issues}
out=Path('artifacts/next-stage');out.mkdir(parents=True,exist_ok=True);(out/'public-output-results.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
raise SystemExit(bool(issues))
