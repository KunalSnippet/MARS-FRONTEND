# MARS Web — Phase 2 Implementation Plan
## Headline Features: Task History, Agent Detail, Failure Debugger

**Depends on:** Phase 1's contract (schemas + endpoint list) — doesn't
require Phase 1's full implementation to be finished, just the contract
**Build order:** Task History → Agent Detail → Failure Debugger (simplest
first, to prove the data model works before building the more polished
pages)

---

## Why this phase exists

These three pages turn "we built a dashboard" into "we built an
observability platform for multi-agent systems" — a real, defensible
engineering contribution, not just more screens. All three are reads on
top of Phase 1's schema; none of them should invent their own data
storage or shape.

**If Phase 1's real backend isn't finished yet:** build against mock data
matching the agreed contract first (same pattern as the very first API
wrapper's `MARS_MOCK` approach) — don't wait idle.

---

## 2.3 — Task History (build this first)

**New files:** `MARS-FE/src/pages/TaskHistoryPage.tsx`,
`MARS-FE/src/api/history.ts`, `MARS-FE/src/hooks/useTaskHistory.ts`

### Steps
1. `api/history.ts`: fetch wrapper for `GET /tasks?limit=&status=`.
2. `useTaskHistory.ts`: React Query hook wrapping it, with pagination/
   status-filter params.
3. Page layout: a table/list — input text (truncated to ~80 chars),
   status badge (reuse the existing shared status-color component, don't
   build a new one), relative created time, duration
   (`completed_at - created_at`, formatted as "4.2s" etc.).
4. Add a status filter (all / completed / failed) and maybe a simple
   search-by-text box — both are just query params against the existing
   endpoint, no new backend work needed.
5. Row click → detail view (see below).
6. Add "Task History" to the sidebar nav, under the existing "Operate" or
   "Insights" grouping (use your judgment on which fits better).

### Detail view
- Reuse the Task Console's existing "Task Result" display component —
  it already knows how to render `result_markdown`, status, and
  classification. Feed it a past task's stored data instead of a live
  polling result.
- Below it, show the task's events (`GET /tasks/{id}/events`) using the
  same Log Feed component from the Logs page — don't build a second log
  renderer.

**Verify:** submit several tasks, restart the backend, reload Task
History — full history should still be there. This is the direct proof
Phase 1's persistence actually works, so treat this as an integration
test for Phase 1 as much as a feature in its own right.

---

## 2.2 — Agent Detail Page

**New files:** `MARS-FE/src/pages/AgentDetailPage.tsx`,
`MARS-FE/src/api/agentDetail.ts`

### Steps
1. Make each row in the existing Agent Monitor table clickable, routing
   to `/app/agents/:agentId`.
2. Fetch `GET /agents/{id}` for metadata + aggregated stats, and
   `GET /agents/{id}/runs` for the per-task history list.
3. Layout, three sections:
   - **Metadata card:** role, model (if available), temperature (if
     available), current goal/prompt (if the agent is currently running
     a task).
   - **Performance card:** calls made (total), avg tokens per call, avg
     response time, failure count. These are aggregates — compute them
     either backend-side (preferred, keeps frontend simple) or
     client-side from the `runs` list if backend aggregation isn't ready
     yet.
   - **Recent runs table:** task_id (linking to that task's Task History
     detail view — nice cross-link between the two new pages), state,
     started/ended, calls made in that run.
4. I/O tracking (memory reads/writes) — only add this section if
   `memory_ops` ended up populated in Phase 1. If that table is empty,
   skip this section rather than showing a fake/empty placeholder.

**Verify:** cross-check the numbers here against what Agent Monitor's
summary row shows for the same agent — they must agree. If they don't,
one of the two is reading from a stale or different source.

---

## 2.1 — Failure Debugger (build last, polish most — this is the showcase)

**New files:** `MARS-FE/src/pages/FailureDebuggerPage.tsx`,
backend: likely a new endpoint or a filtered version of `/tasks/{id}/events`

### Backend steps
1. Add an endpoint (or extend an existing one) to fetch all
   `task_events` where `level = 'error'`, joined with basic parent task
   info (input_text, created_at).
   ```
   GET /events/errors?limit=20
     -> list[ErrorEvent]  (task_id, input_text, ts, message, meta)
   ```
2. Build a small lookup (plain Python dict in code, not a DB table)
   mapping known error message patterns to a human-readable "suggested
   fix." Seed it with real errors already found this project, e.g.:
   ```python
   KNOWN_ERROR_FIXES = {
       "embed_query": "ChromaDB's embedding function is missing "
                       "embed_query — check LocalHashEmbeddingFunction "
                       "setup in mars/memory/vector_store.py.",
       "Rate limit exceeded": "Agent hit its call limit for this task. "
                               "Check policy.py's rate-limit configuration "
                               "if this happens often.",
   }
   ```
   Match by substring against the error message; fall back to a generic
   "No known fix yet — check the full event log for this task" message
   for anything unmatched.

### Frontend steps
1. List view: each failure shows the originating prompt (truncated),
   when it happened, the error message, and the suggested fix.
2. Link through to that task's full detail (reuses 2.3's Task History
   detail view) for full context.
3. Reuse the existing "failed" status color for visual consistency with
   the rest of the app.

**Verify:** deliberately trigger at least one known real failure (e.g.
disconnect LM Studio mid-task, or send a prompt you know hits the
ChromaDB embedding bug) and confirm it appears here correctly, with an
accurate suggested fix — not a placeholder.

---

## Explicitly not in this phase

Communication Graph (react-flow node/edge diagram) and granular GPU/VRAM
monitoring are deliberately excluded — lower payoff for the effort, and
GPU monitoring is hard to test without one on your own machine. Only
revisit these if 2.1–2.3 are fully solid and there's genuine time left
over.

---

## Definition of Done

- [ ] Task History shows real, persisted tasks that survive a backend restart
- [ ] Task History detail view reuses existing components (Task Result display, Log Feed) rather than duplicating them
- [ ] Agent Detail Page's numbers match Agent Monitor's summary for the same agent
- [ ] Failure Debugger correctly surfaces at least one deliberately-triggered real failure with an accurate suggested fix
- [ ] All three pages are added to sidebar navigation and follow the existing design system (status colors, card styles, spacing)
