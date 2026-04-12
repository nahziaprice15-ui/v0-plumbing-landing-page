# GitHub Issue Workflow — Instructions for Dev AI Agents

Use this document at the **start of every coding session** and **whenever work begins or finishes**, so project progress stays visible on GitHub and aligned with milestones.

---

## 1. Purpose

- **Issues are the system of record** for what is planned, in progress, blocked, or done.
- **Milestones** group issues into releases or phases; keep issues linked to the correct milestone so roadmap views stay accurate.
- **Consistency** across sessions depends on the agent **creating or updating issues in the same chat where the code changes happen**, not deferring it.

---

## 2. Session startup (every new chat)

Before writing or changing application code:

1. **Identify the active milestone** (name or GitHub milestone URL) from the user or from the repo’s open milestones.
2. **Search existing issues** in this repository for the task or feature (by title keywords, labels, or milestone). Prefer **updating an existing issue** over opening a duplicate.
3. If the user described new work with **no matching issue**, **create an issue first** (or immediately after a minimal scope clarification), then proceed with implementation.

---

## 3. When to create a new issue

Create a **new** issue when:

- The work is a **distinct deliverable** (feature, bugfix, chore, or spike) that is not already tracked.
- The work **spans multiple PRs** or sessions — one parent issue may hold subtasks in the body or separate linked issues.
- The user explicitly asked for a **new** ticket.

**Before creating:** run a quick duplicate check (same feature, same bug symptom, same refactor target).

**After creating:** apply labels using the **project label map** in §7 (map deliverable type → repo label).

---

## 4. When to update an existing issue

Update (comment and/or edit body/checklists) when:

- **Status changes:** started, blocked, ready for review, deployed.
- **Scope changes:** add a comment summarizing what changed and why.
- **Completion:** post a **closing summary** (what merged, where, any follow-ups).
- **Blockers:** document blocker, who/what is needed, and any workaround.

Use **checklists** in the issue body for multi-step work; tick items as they complete.

---

## 5. Issue title conventions

- **Imperative, concise:** `Add contact form validation`, `Fix hero image CLS on mobile`.
- **Prefix optional but consistent** if the team uses them: `[Feature]`, `[Bug]`, `[Chore]`, `[Docs]`.
- **Avoid vague titles:** not `Update stuff` or `Fix bug`.

---

## 6. Issue body — include by default

Use this structure unless the user specifies otherwise:

| Section | Content |
|--------|---------|
| **Goal** | One or two sentences: outcome for the user or system. |
| **Scope** | In scope / out of scope (bullets). |
| **Acceptance criteria** | Testable bullets (what “done” means). |
| **Technical notes** | Files, APIs, constraints, links to designs or prior PRs. |
| **Checklist** | Optional; for multi-step work. |

Link related items: `Depends on #123`, `Related to #456`, `Closes #789` (in PR description when applicable).

---

## 7. Labels and milestones

- Apply **labels** that exist on the repository. If unsure, match recent issues or PRs in the same area.
- Set **milestone** to the phase or release this work belongs to. If none fits, ask the user or use the team’s backlog milestone if one exists.
- **Do not** remove a milestone without user confirmation unless the issue was filed by mistake.

### 7.1 Project: `nahziaprice15-ui/v0-plumbing-landing-page`

**Labels currently in the repo** (GitHub defaults): `bug`, `documentation`, `duplicate`, `enhancement`, `good first issue`, `help wanted`, `invalid`, `question`, `wontfix`.

**Map deliverable types (§3) to labels:**

| Deliverable | Label to use | Notes |
|-------------|----------------|--------|
| Feature, UI change, spike, or general improvement | `enhancement` | Default for most product work. |
| Bugfix | `bug` | Regressions, broken behavior, incorrect output. |
| Docs only | `documentation` | README, guides, comments-only doc tasks. |
| Chore (tooling, deps, refactor with no user-visible “feature”) | `enhancement` | Until a dedicated `chore` label is created in the repo, use `enhancement` and state “chore” in the title or body. |
| Duplicate of another item | `duplicate` | Only when closing or linking as duplicate; reference the canonical issue/PR number. |
| Not actionable / invalid | `invalid` or `wontfix` | Only with user agreement. |

**Historical:** Closed PRs [#1](https://github.com/nahziaprice15-ui/v0-plumbing-landing-page/pull/1)–[#5](https://github.com/nahziaprice15-ui/v0-plumbing-landing-page/pull/5) were labeled `enhancement` (March 2026) for consistent tracking; they previously had no labels. There were **no separate (non-PR) issues** in the repo at that time—only these pull requests appear in the Issues tab.

---

## 8. Pull requests and issues

- **Reference the issue in the PR:** title or description should include `Fixes #N`, `Closes #N`, or `Refs #N` as appropriate for your GitHub automation.
- If work **only partially** completes an issue, use **`Refs #N`** and update the issue with what remains.
- When the PR merges and the issue should close, ensure **`Closes`/`Fixes`** is used so the issue state stays in sync.

---

## 9. Milestone hygiene

- If the team **renames, splits, or completes** a milestone, **move open issues** to the correct successor milestone and leave a short comment on affected issues when helpful.
- For **release notes**, issues closed in a milestone are easier to summarize if titles and bodies stayed clear throughout.

---

## 10. End of session / end of task

Before ending substantive work:

1. **Comment on the issue** with: what was done, PR link if any, what is left, and next step.
2. **Update checklists** and labels (use repo-defined labels; this project does not define a `ready for review` label unless you add one).
3. If the issue is **fully done** and merged, confirm it is **closed** (via merge keyword or manual close with a one-line reason).

---

## 11. What not to do

- Do not rely on **chat history** as the only record of decisions — put durable notes in the issue.
- Do not create **multiple issues** for the same work without linking and explaining the split.
- Do not **close** an issue without meeting acceptance criteria or explicit user approval for “won’t do / duplicate.”

---

## 12. Tools

- Use the **GitHub web UI**, **GitHub CLI (`gh`)**, or **repository-configured automation** (e.g. MCP GitHub integration) as available in the environment.
- If using automation, **still follow** the same content standards (title, body, milestone, links).

---

## 13. Supabase schema drift playbook (bookings)

If admin pages fail with errors like:

- `column bookings.service_type_id does not exist` (`42703`)
- PostgREST relationship/cache errors involving `bookings` and `service_types`

Use Supabase MCP and apply this DDL patch to the active project:

```sql
alter table if exists public.bookings
  add column if not exists service_type_id uuid;

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'service_types'
  ) and not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.bookings'::regclass
      and conname = 'bookings_service_type_id_fkey'
  ) then
    alter table public.bookings
      add constraint bookings_service_type_id_fkey
      foreign key (service_type_id)
      references public.service_types(id)
      on delete set null;
  end if;
end
$$;

create index if not exists bookings_service_type_id_idx
  on public.bookings(service_type_id);
```

Then verify:

```sql
select column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name = 'bookings'
  and column_name = 'service_type_id';
```

Expected result: one row with `service_type_id` / `uuid`.

---

## 14. Images, `public/`, and deployed sites (e.g. Vercel)

Broken images on production are often **404s**: the code references a path that **does not exist** under `public/`, not a misconfigured `next/image` prop.

### 14.1 Rules of thumb

- **Static assets** live under `public/`. A file at `public/images/hero.svg` is served at **`/images/hero.svg`** (no `public` in the URL).
- **`next/image`** `src` for those files should be that URL string (e.g. `src="/images/hero.svg"`) or a static import. Use **`fill`** only inside a positioned parent (`relative` + explicit size); set **`sizes`** when using `fill` for responsive layouts.
- **SVG** with `next/image`: paths ending in `.svg` are typically served **unoptimized** by Next.js; no extra config is required for normal local SVGs.
- **Do not reference assets that are not committed**: if the gallery or metadata points at `/images/foo.png`, `public/images/foo.png` must exist or production will show broken images.

### 14.2 Checklist before closing an issue that touches images

- [ ] Every **`src`** used by `next/image` or `<img>` matches a real file under **`public/`** (case-sensitive on Linux/Vercel).
- [ ] **`metadata.icons`** / Open Graph / Twitter image URLs in `app/layout.tsx` (and `app/page.tsx` if duplicated) point at **existing** files (e.g. `/icon.svg`, not missing `favicon.ico` / `apple-icon.png` unless those files are added).
- [ ] **`components/BrandLogo.tsx`** uses a real logo file (e.g. **`/images/ms-p-logo.svg`**); avoid probing optional PNGs unless **`public/images/ms-p-logo.png`** exists.
- [ ] **`components/QualityWorkGallery.tsx`** (or any carousel) lists only paths that exist; replace missing “future” PNGs with committed assets or add the files in the same PR.

### 14.3 Related files (this repo)

| Area | Typical files |
|------|-----------------|
| Gallery / hero visuals | `components/QualityWorkGallery.tsx`, `public/images/*` |
| Logo | `components/BrandLogo.tsx`, `public/images/ms-p-logo.svg` |
| Site icons & social preview | `app/layout.tsx`, `app/page.tsx`, `public/icon.svg`, `public/images/plumber-hero.svg` |
| Schema / absolute URLs | `lib/schema.ts` (uses `metadataBase` + image paths) |

---

## Quick copy — agent checklist

- [ ] Confirmed milestone context  
- [ ] Searched for existing issues  
- [ ] Created or updated issue with goal, scope, acceptance criteria  
- [ ] Linked PR with `Fixes` / `Refs` as appropriate  
- [ ] Left a final comment when stopping or when work completes  
- [ ] If the work added or changed images or icon metadata: verified paths under §14  

---

*Keep this file updated as your team agrees on new labels, milestone names, or PR conventions.*
