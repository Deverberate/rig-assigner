# Rig Assigner — Preview Run Doc

## Prerequisites
Dependencies are installed via `npm install`. Node.js and npm required.

## Reproduce uncommitted artifacts
No env files or special artifacts needed — just run the dev server from the project root.

## Start the dev server

Use the Python subprocess method for reliable detachment on macOS:

```bash
python3 -c "
import subprocess
log = '/Users/jonahgeorgenishant/Documents/fvf/Rig-assigner/.freebuff/preview.log'
with open(log, 'w') as f:
    p = subprocess.Popen(
        ['npx', 'vite', '--port', '5173', '--host'],
        cwd='/Users/jonahgeorgenishant/Documents/fvf/Rig-assigner',
        stdout=f, stderr=f,
        start_new_session=True
    )
print(f'pid={p.pid}')
"
```

Verify after ~8s: `sleep 5 && kill -0 <pid> && curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/`

If pid was reaped, fall back to launchd:
```bash
launchctl remove com.rigassigner.vite 2>/dev/null
launchctl submit -l com.rigassigner.vite -- /bin/sh -c "exec npx vite --port 5173 --host > /Users/jonahgeorgenishant/Documents/fvf/Rig-assigner/.freebuff/preview.log 2>&1"
```

## Port
5173 (Vite default)

## Detaching (macOS)
`nohup` + `disown` gets reaped by the orchestrator. Python `subprocess.Popen(start_new_session=True)` or `launchctl submit` survive.
