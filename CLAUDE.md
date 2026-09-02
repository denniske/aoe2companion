# aoe2companion

## Running the frontend and backend locally

The backend lives in a separate repo, `~/Projects/poc_collector`. Both servers are
watcher-backed, so **always start them in their own process group and kill the group**
— see "Killing them" below for why anything else leaves a server running.

### Start

Frontend (expo web, port 8081):

```bash
cd ~/Projects/aoe2companion && python3 -c "
import os
os.setsid()
os.execvp('zsh', ['zsh','-ic','GAME=aoe2 exec yarn start web > /tmp/frontend.log 2>&1'])
" &
```

Backend (nest, port 3332):

```bash
cd ~/Projects/poc_collector && python3 -c "
import os
os.setsid()
os.execvp('zsh', ['zsh','-ic','exec yarn local aoe2 > /tmp/backend.log 2>&1'])
" &
```

`$!` is the PGID — keep it, it is what the kill needs. Both take 40-60s to serve;
wait with `until curl -s -o /dev/null -m 3 <url>; do sleep 3; done` rather than a
fixed sleep.

Both commands run under `zsh -ic` on purpose: `yarn` reads
`FONTAWESOME_NPM_AUTH_TOKEN` from `~/.zshrc`, and a plain `sh -c` (or `zsh -lc`)
does not source it, so yarn dies with "Environment variable not found". The
"TERM environment variable not set" warning that `-ic` prints is harmless.

`GAME=aoe2` is required for the frontend — without it the aoe2 routes 404 as the
aoe4 app. `yarn local aoe2` passes the game as its own argument.

### Pointing the app at the local backend

`data/src/lib/host.ts` has `const dev = false && …`, which pins every host to
production. Flipping it to `true &&` sends all of them to `localhost:3332`. That is
a local edit, not something to commit.

### Why the backend has to be `yarn local`

`yarn local` is `bun run.ts api,data,socket,tournament,analysis`, all on 3332.
`READ_ONLY_SERVICES` in `src/shared/src/service/db.service.ts` does not include
`api`, so the process refuses to boot against a read-only connection and needs the
write-capable `DATABASE_URL` in `.env.aoe2`. That means a local backend can write to
production — worth saying out loud before starting it.

Running only the read-only subset avoids that:

```bash
PORT=3332 bun run.ts data,socket,tournament,analysis aoe2
```

It boots fine as `claude_ro` and serves `/api/profiles/...`, but the **app** cannot
use it: the client bootstraps against `/v2/account`, which only `api` serves, and
without it the page never issues the profile request at all. Use it for curling the
data endpoints, not for driving the UI.

### Killing them

```bash
kill -TERM -<PGID>          # note the minus before the PGID: that is the group
```

Then confirm, because a missed watcher is silent:

```bash
lsof -ti:3332 -sTCP:LISTEN || echo "3332 free"
lsof -ti:8081 -sTCP:LISTEN || echo "8081 free"
ps -eo pid,command | grep -E "[n]est start --watch|[e]xpo start|[r]un\.ts"
```

Three traps, all of which have already cost time here:

- **`yarn local` runs `nest start --watch`, which respawns its child.** Killing the
  node process that holds the port just makes the watcher start a new one seconds
  later, so the port looks free, then is not.
- **The child renames itself to the service name** (`data`,
  `api,data,socket,tournament,analysis`), so `pkill -f "run.ts"` does not match it.
  Killing the watcher alone leaves that child orphaned onto PID 1, still holding the
  port. Killing the group gets launcher, watcher and child together.
- **`lsof -ti:PORT` alone lists clients too** — the Claude app's own connection shows
  up and looks like a stray server. `-sTCP:LISTEN` is what answers "is something
  still serving this port".

If a group kill was missed and something is already orphaned, kill the listener and
every `nest start --watch` by PID, then re-run the checks above.
