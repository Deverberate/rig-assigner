# Rig Assigner — Preview Run Doc

## Prerequisites
Dependencies are installed via `npm install`. Node.js and npm required.

## Reproduce uncommitted artifacts
No env files or special artifacts needed — just run the dev server from the project root.

## Start the dev server
```bash
cd "<project-root>"
npx vite --port 5173 --host
```

## Detached launch (macOS)
```bash
python3 -c "
import subprocess
log = '<project-root>/.freebuff/preview.log'
with open(log, 'w') as f:
    p = subprocess.Popen(
        ['/usr/local/bin/npx', 'vite', '--port', '5173', '--host'],
        cwd='<project-root>',
        stdout=f, stderr=f,
        start_new_session=True
    )
print(f'pid={p.pid}')
"
```
Verify: `sleep 8 && curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/`

## Port
5173 (Vite default)
