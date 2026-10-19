# Copier Wizard — Permanent Project Handoff

**Updated:** 2026-10-19 (new-chat consolidation)  
**Repository:** https://github.com/BobbyT416/Copier-Wizard  
**Working branch:** `development`  
**Production branch:** `main`  
**Current build marker observed on development:** **260** (`version.json` reports build/version 260)  
**Purpose:** A durable checkpoint for continuing Copier Wizard work across chats. Keep this file current after meaningful milestones and before a chat ends when possible.

> Accuracy rule: distinguish proposed, committed, automated-tested, deployed, and manually tested work. Do not claim tests or deployment passed without checking evidence. User prefers concrete progress over repeated plans. Continue independently until a genuine user decision or hands-on test is required.

## 1. Product purpose and target workflow

Copier Wizard is an intelligent diagnostic assistant for copier/printer technicians, initially focused on HP machines and uploaded HP documentation.

Target workflow: **Identify/verify machine → enter error/message → guided troubleshooting → diagnostic test → recommended part → exact verified removal/replacement procedure → service report.**

## 2. Permanent requirements and user decisions

- **Branch safety:** all development and test changes go to `development`. `main` is production. Never merge to `main`, publish production, or otherwise change production without the user's explicit approval.
- **Product-number-first machine identification (latest user requirement, 2026-10-19):** if a technician enters a recognized HP product number, that alone should identify type, family, and model and take the user directly to **Machine Verified**. Type, family, and model selections must be optional. The app may fill these fields behind the scenes. No manual selections or extra Verify Machine click should be required for a known mapped product number.
- If the product number is unknown or cataloged without a valid machine/family mapping, do not guess or falsely verify; explain that the catalog cannot identify it and allow the manual identification path.
- Product number must map to the exact variant before variant-sensitive troubleshooting, part recommendations, or procedures appear.
- Use uploaded HP documentation as the source of truth. Do not invent HP part numbers, diagnostic steps, or repair procedures.
- CPMD is the primary source for troubleshooting and diagnostic branches. Repair/Service Manuals are the source for removal/replacement procedures.
- Match parts and procedures to the exact machine/model/variant and validate the procedure actually exists in the loaded manual.
- If sources conflict, disclose the conflict and withhold uncertain/unsafe recommendations until reconciled. If an exact procedure is missing, say so and request the appropriate manual; never substitute another model's procedure or generic knowledge.
- Treat “ADF,” “Document Feeder,” and “Automatic Document Feeder” as interchangeable technician search terms, while preserving the source manual's wording in displayed content and part descriptions.
- Preserve complete part descriptions. Distinguish technician-facing diagnostic content from customer-facing instructions.
- Service reports must be available at the end of troubleshooting even if the repair has not been marked resolved. Do not label an unfinished repair as resolved automatically. Include the recommended part numbers and accurately reflect the repair outcome/disposition.
- Automated tests must verify actual behavior, not merely page load. Test neighboring variants to catch cross-model leakage.
- Keep handoff current with branch/build, exact commit SHA, tests/results, deployment state, known risks, and the single best next action.

## 3. Repository and deployment status

- Repository: https://github.com/BobbyT416/Copier-Wizard
- Branches: `main` (production) and `development` (work/testing).
- `HANDOFF.md` is maintained on `development`.
- A separate development preview URL and its deployment wiring must be verified; do not assume GitHub Pages deploys the `development` branch.
- A local/automated browser test passing does not prove the live test website is serving that build.
- Prefer direct commits on `development` and automated tests over ZIP handoffs unless a ZIP is needed for a specific deployment or offline test.
- Verified development head after the latest test change: `57f2d294af6b03bd5b4b7e38263f68705e37f14a`. `version.json` on `development` contains `{"build":"260","version":"260"}`.
- Latest automated run at this checkpoint: **PASS**, run #35, [GitHub Actions run 39289198350](https://github.com/BobbyT416/Copier-Wizard/actions/runs/39289198350), commit `57f2d294af6b03bd5b4b7e38263f68705e37f14a`.
- Separate preview status: repository `main/test/version.json` still reports Build 259; `main/version.json` reports Build 257. Development is Build 260. The GitHub Pages configuration/live URL could not be independently verified in this session. Do not update `main` or its `test/` folder without explicit approval; production must remain untouched.

## 4. Latest work and evidence (2026-10-19)

### Build 259 — service report fix (reported in prior conversation; live deployment still needs verification)

Prior session reported these changes committed to `development` and a full automated suite passing:
- Generate a service report before marking the repair resolved.
- Capture recommended part numbers shown in repair procedure content, not only dedicated part cards.
- Avoid automatically labeling an unfinished repair as resolved.
- Improve M776zs browser test navigation through documented troubleshooting decision points.
- Build 259 was reported copied/published to test-site files, but the prior conversation explicitly said GitHub Pages deployment was pending. Confirm the live test site and build before asking the user to test it.
- The prior conversation's statement that a service-report test passed included report generation before resolution and recommended part number in the report. Treat this as prior-session evidence, not a substitute for checking current Actions/deployment.

### Build 260 — product-number-only verification (latest work)

Prior conversation reported that the change was committed on `development`; automated checks were still queued at the time, so do not assume they passed.

Current `tests/smoke-test.cjs` includes:
1. Product-number-only verification using `T3U55A` with type/family/model blank.
2. A negative test using unknown product number `ZZZZZ`, confirming it does not unlock diagnosis and displays the catalog limitation.
3. M776dn error `59.00.03` path, correct parts, matching repair procedure, and Back to Diagnosis.
4. Distinct M776dn/M776zs repair procedure checks to prevent variant cross-use.
5. Service report generation before resolution with the recommended part number included.
6. M13 diagnostic navigation and a full M776zs `T3U56A` path confirming the correct parts, M13 branch, correct repair procedure, and return navigation.
7. No uncaught browser JavaScript errors.

**Latest result: PASS** — run #35, [39289198350](https://github.com/BobbyT416/Copier-Wizard/actions/runs/39289198350), commit `57f2d294af6b03bd5b4b7e38263f68705e37f14a`. The immediately prior run #34 also passed product-number-only M776zs verification and the full M776/service-report suite. An earlier failed run was caused by an obsolete test trying to use `selectOption()` on the product-number text input; that test was corrected.

Useful file references:
- `index.html` on development: https://github.com/BobbyT416/Copier-Wizard/blob/development/index.html
- `version.json` on development: https://github.com/BobbyT416/Copier-Wizard/blob/development/version.json
- `tests/smoke-test.cjs` on development: https://github.com/BobbyT416/Copier-Wizard/blob/development/tests/smoke-test.cjs
- Permanent handoff: https://github.com/BobbyT416/Copier-Wizard/blob/development/HANDOFF.md

## 5. Immediate next actions — in order

1. The current `development` Build 260 browser suite passed on commit `57f2d294af6b03bd5b4b7e38263f68705e37f14a`; keep this as the validated development baseline unless later code changes.
2. The next deployment task is unresolved: `main/test/version.json` is Build 259 and `main/version.json` is Build 257. Verify the intended live preview URL and deployment setup. Do not change `main` or `main/test/` without explicit approval, and do not modify the production root.
3. Once a safe Build 260 preview is available, ask the user to test product-number-only verification and service report generation. Prioritize:
   - Product number `T3U55A` entered with type/family/model blank; should jump straight to Machine Verified.
   - Known product number with no manual selections; ensure correct type/family/model are inferred.
   - Unknown/unmapped product number; must not falsely verify and must permit manual selection.
   - M776dn and M776zs neighboring-variant checks for error `59.00.03`.
   - Generate service report from final part-recommendation screen before clicking Resolved; confirm recommended part number is included and unfinished repair isn't mislabeled resolved.
5. Continue broadening automated coverage across machine families, exact product mappings, source conflicts, missing procedures, and R&R applicability.
6. Update this handoff after each meaningful milestone and before a session ends when possible.

## 6. Important M776 facts

Product numbers:
- M776dn = `T3U55A`
- M776z = `3WT91A`
- M776zs = `T3U56A`

For error `59.00.03`:
- M776zs delivery assembly: `RM2-1786-000CN`; duplex controller: `RM3-7380-000CN`; applicable test path includes M13.
- M776dn/M776z delivery assembly: `RM2-3910-000CN`; duplex controller: `RM2-9921-000CN`; applicable test path includes M12.
- Do not cross-use variant-specific parts or procedures.
- The prior automated test for M776zs initially failed because it expected M13 too early. The test was corrected to click “Step Completed — Continue” three times before checking step 4, where the M13 instruction is expected. The run was still in progress at the last recorded check; confirm the final result.
- Error `59.00.00` has a known source conflict: CPMD recommends pickup assembly `RM2-1393-000CN`, while the Repair Manual identifies `RM2-3908-000CN` for M856/E85055/M776. Intended behavior: flag the conflict and withhold the R&R recommendation until reconciled.

## 7. Important E52645 facts and unresolved items

- E52645dn product number: `1PS54A`; Flow E52645c: `1PS55A`.
- `RM3-7476-000CN`: E52645 simplex DC controller.
- `RM3-7475-010CN`: duplex DC controller applicable to M527/M528/E52545/E52645.
- `RM3-7424-000CN`: E52645 HVPS.
- `RM2-2891-000CN`: E52645 laser/scanner.
- `F2A76-67909`: image scanner assembly/sub-scanner.
- `B5L47-67901`: SCB kit M528/E52645; `B5L47-67903` applies to M527/E52545, not E52645. For error `30.01.46`, a CPMD/catalog conflict was identified; keep the part withheld until authoritative source reconciliation.
- Fuser parts `RM2-2585-000CN` / `RM2-2586-000CN` for `10.23.15` / `10.23.35` have not yet had exact R&R procedures verified; do not show an unverified procedure.
- For `52.XX.00` and `51.00.10`, E52645 laser/scanner part is `RM2-2891-000CN`, not older `RM2-5528-000CN`; exact procedure verification remains a follow-up.

## 8. Testing checklist

- Version/build markers agree across app and `version.json`.
- JavaScript parses; ZIPs (if generated) pass integrity checks.
- Browser tests cover machine selection, product number verification, error entry, troubleshooting, part matching, procedure opening, service report, and navigation back.
- Test at least one correct variant and an adjacent variant to catch cross-model leakage.
- Include negative tests for unknown/unmapped products, missing procedures, and source conflicts.
- Ensure no generic placeholder is displayed as if it were a real diagnostic procedure.
- Record exact branch, commit SHA, build number, workflow URL/status, test result, deployment status, and remaining manual checks.
- Verify the live preview separately from CI.

## 9. Working style

- Make steady, concrete progress; avoid repeatedly restating plans without acting.
- Independently inspect code, run tests, review failures, and fix what can be fixed without user input.
- Ask the user to test only when a specific live/device interaction is necessary, with concise step-by-step instructions.
- Do not tell the user work is continuing in the background after the response ends. GitHub Actions may continue on its own, but the assistant must check its result when work resumes.
- Never claim uncommitted, untested, or undeployed changes are complete.

## 10. Session log

### 2026-10-19 — repository and test hardening
- Repository: `BobbyT416/Copier-Wizard`; development/production separation established as a requirement.
- Prior session reported Build 258 and passing M776dn browser path; exact current head/workflow should be rechecked.
- Expanded M776zs test corrected to advance through the documented troubleshooting steps before checking for M13. Prior recorded commit for this correction: `2d211b014709c6eb990d8f2525cfd8966118a751`; final run was still in progress at the last recorded check.
- A later prior-session note reported commit `74aec3ce2db9750c6658807b5045feed0425567b` with code/safety checks passed and M776zs checks; verify which commit is current before relying on it.
- Build 259 service report fix was reported as passing automated tests and copied to test-site files; live deployment still needed confirmation.
- Build 260 product-number-first workflow was committed according to the previous conversation. Current `version.json` confirms build/version 260. Latest workflow status not yet checked in this chat.
- User clarified product-number-first requirement: known product number alone should identify the machine and jump directly to Machine Verified; all other identification fields optional.
- **Next action:** check current branch head and Build 260 Actions result, then verify safe test-site deployment. Production remains untouched.
