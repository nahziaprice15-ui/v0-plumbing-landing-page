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

- Apply **labels** the repository already uses (e.g. `bug`, `enhancement`, `documentation`, `priority`). If unsure, match recent issues in the same area.
- Set **milestone** to the phase or release this work belongs to. If none fits, ask the user or use the team’s backlog milestone if one exists.
- **Do not** remove a milestone without user confirmation unless the issue was filed by mistake.

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
2. **Update checklists** and labels (e.g. `ready for review`).
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

## Quick copy — agent checklist

- [ ] Confirmed milestone context  
- [ ] Searched for existing issues  
- [ ] Created or updated issue with goal, scope, acceptance criteria  
- [ ] Linked PR with `Fixes` / `Refs` as appropriate  
- [ ] Left a final comment when stopping or when work completes  

---

*Keep this file updated as your team agrees on new labels, milestone names, or PR conventions.*
