# Copier Wizard — Permanent Project Handoff

**Last updated:** 2026-10-19  
**Repository:** https://github.com/BobbyT416/Copier-Wizard  
**Working branch:** `development`  
**Production branch:** `main`  
**Purpose:** Preserve the current project state and next steps so work can resume in a new chat without relying on chat history.

> **Update this document at the end of each substantial work session and after important milestones.** Keep the status, test evidence, known issues, and next action current. Do not claim a change or test passed unless it was actually performed.

## 1. Product and working rules

Copier Wizard is an intelligent diagnostics assistant for copier/printer technicians, initially focused on HP machines and uploaded HP documentation.

Target workflow:

**Select machine → enter error/message → guided troubleshooting → diagnostic test → recommended part → verified removal/replacement procedure → service report.**

Important requirements:
- The technician must identify/verify the exact machine and product number before variant-sensitive guidance is shown.
- Use uploaded HP documentation as the source of truth. Do not invent HP part numbers, diagnostic steps, or repair procedures.
- CPMD is the primary source for troubleshooting and diagnostic branches.
- Repair/Service Manuals are the source for removal/replacement procedures.
- Link sources using exact part number and exact machine/model/variant applicability. Validate that the procedure actually exists in the loaded manual.
- If sources conflict, show the conflict and withhold an unsafe or uncertain recommendation rather than silently choosing one.
- If the exact procedure is missing, say so and request the appropriate manual. Never substitute another model's procedure or generic knowledge.
- Treat “ADF,” “Document Feeder,” and “Automatic Document Feeder” as interchangeable technician search terms, but preserve the source manual's wording in displayed content and part descriptions.
- Preserve complete part descriptions and distinguish technician-facing diagnostics from customer-facing instructions.
- Main branch is production; all development and testing changes go to `development` first. Do not merge to `main` without explicit agreement.

## 2. Repository and deployment

- Repository: https://github.com/BobbyT416/Copier-Wizard
- Branches: `main` (production) and `development` (test/development).
- The `development` branch was created from `main`; at the time of repository setup, both pointed to the same `index.html` blob.
- A separate development website / preview still needs to be confirmed and configured. Do not assume GitHub Pages is already deploying the development branch.
- Prefer direct commits to `development` and automated tests over ZIP handoffs. Use ZIPs only when needed for a specific deployment or offline test.
- Never state that the production website is updated unless deployment and the live version have been checked.

## 3. Latest reported state (2026-10-19)

The prior session reported **Build 258** on `development`, with an automated GitHub Actions test run passing. Reported work included:
- Automated checks for build number, JavaScript syntax, safety rules, and browser behavior in Chromium.
- Browser testing of the M776dn path for error `59.00.03`, including product number `T3U55A`, variant-specific parts, opening a repair procedure, and returning to diagnosis.
- Variant-specific delivery assembly checks:
  - M776dn/M776z: `RM2-3910-000CN`
  - M776zs: `RM2-1786-000CN`
- Diagnostic test guidance for M11, M12, M13, and M15.
- Back-to-diagnosis navigation coverage.

Reported workflow run: https://github.com/BobbyT416/Copier-Wizard/actions/runs/39249921326

**Verification caveat:** At the beginning of the next session, confirm the current `development` branch head, current build/version markers, and that the linked workflow run still corresponds to the latest commit. The summary above records the previous session's report; it is not a substitute for rechecking current GitHub state.

## 4. Immediate next actions

1. Inspect the current `development` branch head and verify Build 258/version markers and the latest workflow run.
2. Expand browser tests for the full **M776zs** path:
   - Select family/model M776.
   - Require product number `T3U56A`.
   - Enter error `59.00.03`.
   - Confirm the delivery assembly is `RM2-1786-000CN`.
   - Confirm the duplex controller is `RM3-7380-000CN` where that branch calls for it.
   - Confirm the correct diagnostic test is M13 for M776zs.
   - Open the M776zs-specific repair procedure and verify Back to Diagnosis works.
   - Confirm the M776dn/M776z procedure `RM2-3910-000CN` is not used for M776zs.
3. Configure or verify a separate development preview URL so the user can test `development` without affecting production.
4. Continue broadening tests across machine families, with particular attention to model/product verification, source conflicts, and removal/replacement procedure matching.
5. Update this document after each meaningful milestone.

## 5. Important M776 facts

Product numbers:
- M776dn = `T3U55A`
- M776z = `3WT91A`
- M776zs = `T3U56A`

For error `59.00.03`:
- M776zs delivery assembly: `RM2-1786-000CN`; duplex controller: `RM3-7380-000CN`; applicable test path includes M13.
- M776dn/M776z delivery assembly: `RM2-3910-000CN`; duplex controller: `RM2-9921-000CN); applicable test path includes M12.
- Do not cross-use variant-specific parts or procedures.
- Error `59.00.00` has a known source conflict: CPMD recommends pickup assembly `RM2-1393-000CN`, while the Repair Manual identifies `RM2-3908-000CN` for M856/E85055/M776. Current intended behavior is to flag the conflict and withhold the R&R recommendation until reconciled.

## 6. Important E52645 facts and unresolved items

- E52645dn product number: `1PS54A`; Flow E52645c: `1PS55A`.
- `RM3-7476-000CN`: E52645 simplex DC controller.
- `RM3-7475-010CN`: duplex DC controller applicable to M527/M528/E52545/E52645.
- `RM3-7424-000CN`: E52645 HVPS.
- `RM2-2891-000CN`: E52645 laser/scanner.
- `F2A76-67909`: image scanner assembly/sub-scanner.
- `B5L47-67901`: SCB kit M528/E52645; `B5L47-67903` applies to M527/E52545, not E52645. For error `30.01.46`, a CPMD/catalog conflict was identified; keep the part withheld until authoritative source reconciliation.
- Fuser parts `RM2-2585-000CN` / `RM2-2586-000CN` for `10.23.15` / `10.23.35` have not yet had exact R&R procedures verified; do not show an unverified procedure.
- For `52.XX.00` and `51.00.10`, E52645 laser/scanner part is `RM2-2891-000CN`, not older `RM2-5528-000CN`; exact procedure verification remains a follow-up.

## 7. Testing approach

Automated tests should verify behavior, not merely check that the page loads:
- Version/build markers agree.
- JavaScript parses; ZIPs (if generated) pass integrity checks.
- Browser test covers selection, product number verification, error entry, troubleshooting, part matching, procedure opening, and navigation back.
- Test at least one correct variant and one adjacent variant to catch cross-model leakage.
- Include negative tests for missing procedures and source conflicts.
- Ensure the UI never presents a generic placeholder as if it were a real diagnostic procedure.
- Record the exact branch, commit SHA, build number, test result, and any manual testing still needed.
- Tests performed in a local/browser automation environment do not prove that the live deployed site is current; verify the preview URL separately.

## 8. Working style and change control

- Make steady, concrete progress; avoid repeatedly restating plans without acting.
- The assistant should test independently wherever feasible, then give the user a short, exact checklist for anything requiring their real device or live site.
- Keep changes on `development` until validated. Do not touch `main` or production deployment without explicit approval.
- When a session ends, leave the handoff document with: latest commit/build, changed files, tests run/results, known risks, and the single best next action.
- Do not describe uncommitted or merely proposed changes as completed.

## 9. Session log

### 2026-10-19
- Repository renamed to `BobbyT416/Copier-Wizard`.
- Development/production separation is intended: `development` for work and testing; `main` for production.
- Previous session reported Build 258 and passing automated/browser tests; see Section 3 verification caveat.
- Next focus: verify current branch state, strengthen M776zs tests, and establish a separate development preview.
