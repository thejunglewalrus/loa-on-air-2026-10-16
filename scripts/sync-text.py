# Sync the page's text from content/outline.md: stage titles, card bullets, talking points and glossary glosses,
# in order. The outline is the source of truth for wording; this keeps index.html verbatim with it.
# Usage: python scripts/sync-text.py [--check]   (--check reports mismatches without writing)
import io, re, sys, html as H
R = 'C:/Users/PandaPanda/Projects/loa-on-air-2026-10-16/'
check = '--check' in sys.argv
md = io.open(R + 'content/outline.md', encoding='utf-8').read()
page = io.open(R + 'index.html', encoding='utf-8').read()

def inline(s):
    s = re.sub(r'\s*\[\d\d:\d\d:\d\d[^\]]*\]\s*$', '', s.strip())           # drop trailing timestamp markers
    s = H.escape(s, quote=False)
    s = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)
    s = s.replace('→', '&rarr;')
    s = re.sub(r'([\uac00-\ud7a3][\uac00-\ud7a3 ,·]*[\uac00-\ud7a3]|[\uac00-\ud7a3])', r'<span class="kr">\1</span>', s)
    return s

# parse outline stages
stages = {}
for m in re.finditer(r'^## S(\d+) — (.+?) \((?:timecode |no timecode|[0-9:]).*?\)\s*$\n(.*?)(?=^## S|\Z)', md, re.S | re.M):
    n, title, body = int(m.group(1)), m.group(2).strip(), m.group(3)
    bullets, tps, glosses = [], [], []
    mode = 'b'
    for line in body.splitlines():
        if line.strip() == 'Talking points': mode = 't'; continue
        if line.startswith('- '):
            (bullets if mode == 'b' else tps).append(line[2:])
        elif line.startswith('| ') and not line.startswith('| KR') and not line.startswith('|---'):
            glosses.append(line.strip().strip('|').split('|')[2].strip())
    stages[n] = {'title': title, 'bullets': bullets, 'tps': tps, 'glosses': glosses}

problems = []
def sub_section(n, fn):
    global page
    m = re.search(r'<section class="stage[^"]*" id="s%d"[^>]*>' % n, page); a = m.start(); b = page.index('</section>', a)
    seg = page[a:b]; page = page[:a] + fn(seg) + page[b:]

def replace_list(seg, ul_class, items, n):
    m = re.search(r'<ul class="%s">(.*?)</ul>' % ul_class, seg, re.S)
    if not m:
        if items: problems.append(f's{n}: no <ul class="{ul_class}"> but outline has {len(items)} items')
        return seg
    lis = re.findall(r'<li>.*?</li>', m.group(1), re.S)
    if len(lis) != len(items):
        problems.append(f's{n} {ul_class}: page has {len(lis)} items, outline {len(items)}'); return seg
    new = m.group(1)
    for old, txt in zip(lis, items):
        new = new.replace(old, '<li>' + inline(txt) + '</li>', 1)
    return seg[:m.start(1)] + new + seg[m.end(1):]

for n, st in sorted(stages.items()):
    if n == 0: continue
    def fn(seg, n=n, st=st):
        seg = re.sub(r'<h2 class="card__title">.*?</h2>', '<h2 class="card__title">' + inline(st['title']) + '</h2>', seg, count=1, flags=re.S)
        seg = replace_list(seg, 'card__list', st['bullets'], n)
        seg = replace_list(seg, 'tp__list', st['tps'], n)
        if st['glosses']:
            cells = re.findall(r'<span class="g-gloss" role="cell">.*?</span>', seg, re.S)
            if len(cells) != len(st['glosses']): problems.append(f's{n} glossary: page {len(cells)} rows, outline {len(st["glosses"])}')
            else:
                for old, txt in zip(cells, st['glosses']):
                    seg = seg.replace(old, '<span class="g-gloss" role="cell">' + inline(txt) + '</span>', 1)
        return seg
    sub_section(n, fn)

if problems:
    print('PROBLEMS:'); [print(' -', p) for p in problems]; sys.exit(1)
if check:
    print('check ok: structure matches for', len(stages) - 1, 'stages')
else:
    io.open(R + 'index.html', 'w', encoding='utf-8').write(page)
    print('synced', len(stages) - 1, 'stages')
