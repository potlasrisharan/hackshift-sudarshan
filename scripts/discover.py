"""Regenerate static source inventories without executing original application code."""
from pathlib import Path
import re,json
root=Path('hackshift/projects')
lines=['# Source inventory','', 'Generated from source by `python3 scripts/discover.py`. This is a static inventory, not proof of runtime behaviour.','']
for folder in sorted(root.iterdir()):
    if not folder.is_dir(): continue
    lines += ['## '+folder.name,'','### API declarations','', '| File | Method | Local route (prefix in router source) |','|---|---|---|']
    for p in sorted(folder.rglob('*.py')):
        for method,route in re.findall(r'@(?:router|app)\.(get|post|put|patch|delete)\(["\']([^"\']+)',p.read_text()):
            lines.append(f'| `{p.relative_to(root)}` | {method.upper()} | `{route}` |')
    lines += ['','### Tables, RPC functions and triggers','']
    names={'tables':set(),'functions':set(),'triggers':set()}
    for p in folder.rglob('*.sql'):
        text=p.read_text()
        for key,pattern in [('tables',r'CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?([\w]+)'),('functions',r'CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION\s+(?:public\.)?([\w]+)'),('triggers',r'CREATE\s+(?:OR\s+REPLACE\s+)?TRIGGER\s+(\w+)')]:
            names[key].update(re.findall(pattern,text,re.I))
    for k,values in names.items(): lines += [f'**{k}:** '+', '.join(f'`{n}`' for n in sorted(values)), '']
    lines+=['### UI source routes and entrypoints','']
    ui=[p for p in folder.rglob('*') if p.is_file() and (p.suffix in {'.html'} or '/src/pages/' in str(p) or p.name in {'main.dart','App.tsx'}) and 'archive/' not in str(p)]
    lines += ['- `'+str(p.relative_to(root))+'`' for p in sorted(ui)]
    lines += ['','### Source file manifest (runtime files only)','']
    for p in sorted(folder.rglob('*')):
        if p.is_file() and p.suffix in {'.ts','.tsx','.js','.py','.dart','.sql','.yaml','.json'} and p.name!='package-lock.json' and 'archive/' not in str(p) and '/pentest/' not in str(p): lines.append('- `'+str(p.relative_to(root))+'`')
    lines+=['']
Path('docs/SOURCE_INVENTORY.md').write_text('\n'.join(lines)+'\n')
