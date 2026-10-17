"""Scan tracked UTF-8 sources without printing a matched credential value."""
import pathlib, re, subprocess, sys, base64, json
patterns=[r'AKIA[A-Z0-9]{16}',r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----',r'\bsk-[A-Za-z0-9]{24,}']
failures=[]
for filename in subprocess.check_output(['git','ls-files','-z']).decode().split('\0'):
    if not filename or filename == 'scripts/secret-scan.py': continue
    try: text=pathlib.Path(filename).read_text()
    except (UnicodeError,OSError): continue
    if any(re.search(p,text) for p in patterns): failures.append(filename)
    for token in re.findall(r'eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+',text):
        try: payload=json.loads(base64.urlsafe_b64decode(token.split('.')[1]+'==='))
        except (ValueError,UnicodeError): continue
        if payload.get('role') in {'service_role','supabase_admin'}: failures.append(filename)
if failures:
    print('Review credential patterns in: '+', '.join(sorted(set(failures))),file=sys.stderr)
    sys.exit(1)
print('PASS: no configured credential patterns in tracked text; not a comprehensive secret audit')
