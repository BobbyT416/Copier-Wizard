# Copier Wizard — Permanent Project Handoff

**Updated:** 2026-10-19 (Build 263 product browser and navigation fix)  
**Repository:** https://github.com/BobbyT416/Copier-Wizard  
**Working branch:** `development`  
**Production branch:** `main`  
**Current build marker observed on development:** **263** (`version.json` reports build/version 262)  
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
- Development head before Build 263: `45f1d0d3fa279b02b02cdaf0e318b7b1aa1b56ba`. Build 263 commit: `648187eaf5b53ede58f82a1e4c9c96b5a8e787b4`. `version.json` on `development` reports Build 263.
- Latest complete automated browser suite: **PASS**, [GitHub Actions run 39291163344](https://github.com/BobbyT416/Copier-Wizard/actions/runs/39291163344), commit `e845b8888edb0df93df011ccfd93d557dbd0b3be`.
- User authorized test-only releases on 2026-10-19. The `main/test/index.html` and `main/test/version.json` files have now been updated to Build 262. `main/test/cw-manual-data.js` already matches the development data file and was not changed.
- The only files changed on `main` for the Build 262 release are `test/index.html` and `test/version.json`. Verified `main/version.json` remains Build 257; the production root app was not changed.
- Build 261's Pages deployment completed successfully ([run 39290714550](https://github.com/BobbyT416/Copier-Wizard/actions/runs/39290714550)). Build 262's GitHub Pages deployment completed successfully: [run 39291308543](https://github.com/BobbyT416/Copier-Wizard/actions/runs/39291308543). Test URL: https://bobbyt416.github.io/Copier-Wizard/test/ .

## 4. Latest work and evidence (2026-10-19)

### Build 259 — service report fix (reported in prior conversation; live deployment still needs verification)

Prior session reported these changes committed to `development` and a full automated suite passing:
- Generate a service report before marking the repair resolved.
- Capture recommended part numbers shown in repair procedure content, not only dedicated part cards.
- Avoid automatically labeling an unfinished repair as resolved.
- Improve M776zs browser test navigation through documented troubleshooting decision points.
- Build 259 was reported copied/published to test-site files, but the prior conversation explicitly said GitHub Pages deployment was pending. Confirm the live test site and build before asking the user to test it.
- The prior conversation's statement that a service-report test passed included report generation before resolution and recommended part number in the report. Treat this as prior-session evidence, not a substitute for checking current Actions/deployment.

### Build 260 — initial product-number-only implementation

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

### Build 261 — identity/readiness separation and family-wide contract testing

- App build marker and `version.json` are both Build 261.
- Product-number-only identity is now tested across **all 75 catalog entries**. Each entry must infer type, family, and model and show a product-number-specific verification state.
- The family-wide test distinguishes identity from diagnostic readiness: enabled families open the guided workflow; families not yet enabled confirm identity but keep diagnostics locked.
- When the product number changes, verification and diagnostic history are cleared. Unknown or unmapped product numbers explicitly show **Machine Not Verified**, hide the diagnostic card, and do not retain stale guidance.
- Automated suite passed on commit `5975d53f6b1852325300b25d00491b4c989817dc`, including the 75-product contract, stale-state transition from a known product to `ZZZZZ`, existing M776dn/M776zs variant tests, service report before resolution, and no uncaught browser errors.
- Added [`FAMILY-ONBOARDING.md`](https://github.com/BobbyT416/Copier-Wizard/blob/development/FAMILY-ONBOARDING.md), which defines the required identity/source/data/capability gates and acceptance tests for adding future families.
- The family-specific diagnostic engine has **not** yet been fully refactored into data-driven family packages. The current document is the onboarding standard; migration should be gradual, starting from a small known-good family and preserving existing tests.
- The Build 261 test-site files have been committed under `main/test/`; the Pages deployment run is pending, so the live site has not yet been confirmed.

### Build 262 — exact-model readiness and stale-state protection

- App build marker and `version.json` are both Build 262.
- Added explicit `supportedModels: ["E52645"]` to the shared M501/M506/M507/M527/M528/E50045/E50145/E52545/E52645 selection family. The normalized manual-data package identifies E52645, so other models in that selection family are identity-verified but do not inherit E52645 troubleshooting until their exact workflows are validated.
- Identity and diagnostic readiness are separate states. Product-number-only entry is exercised for all 75 catalog entries; enabled families open diagnostics, while not-yet-enabled families confirm identity but keep diagnostics locked.
- Changing or clearing a product number, or changing the manual machine type/family/model selectors, clears previous verification, diagnostic results/history, and service-report context. Unknown/unmapped products show an explicit Machine Not Verified state.
- Latest complete automated suite passed: [run 39291163344](https://github.com/BobbyT416/Copier-Wizard/actions/runs/39291163344), commit `e845b8888edb0df93df011ccfd93d557dbd0b3be`. Logs confirm the 75-product contract, E52645 enabled/M527 gated, stale-state clearing, M776dn/M776zs variant paths, M13, service report before resolution, and no uncaught browser errors.
- The Build 262 app and version files have been committed to `main/test/`, and GitHub Pages deployment run [39291308543](https://github.com/BobbyT416/Copier-Wizard/actions/runs/39291308543) completed successfully. Test URL: https://bobbyt416.github.io/Copier-Wizard/test/ .
- Added `FAMILY-ONBOARDING.md` as the repeatable contract for future family imports. The runtime has not yet been fully refactored to data-driven family packages; that remains the next architecture phase.

Useful file references:
- `index.html` on development: https://github.com/BobbyT416/Copier-Wizard/blob/development/index.html
- `version.json` on development: https://github.com/BobbyT416/Copier-Wizard/blob/development/version.json
- `tests/smoke-test.cjs` on development: https://github.com/BobbyT416/Copier-Wizard/blob/development/tests/smoke-test.cjs
- Permanent handoff: https://github.com/BobbyT416/Copier-Wizard/blob/development/HANDOFF.md

## 5. Immediate next actions — in order

1. Build 262's GitHub Pages deployment completed successfully at [39291308543](https://github.com/BobbyT416/Copier-Wizard/actions/runs/39291308543). The repository test marker is Build 262; have the user open https://bobbyt416.github.io/Copier-Wizard/test/ and confirm the visible build label. Production root remains Build 257 and must remain untouched.
2. Once Build 262 is live, ask the user to test:
   - Enter `T3U55A` with Type/Family/Model blank; it should identify M776dn and open the supported workflow.
   - Enter a known product number from a family not yet enabled; identity should be confirmed but guided troubleshooting must remain locked.
   - Enter E52645 product number `1PS54A`; the validated E52645 workflow should open.
   - Enter M527 product number `F2A76A`; it must not inherit the E52645 workflow.
   - Clear the product number or change machine type after verification; the previous machine's diagnostics must disappear.
   - Enter an unknown number after a known machine; old verification/results must clear.
   - Confirm the service report works before marking the repair resolved.
3. Continue family onboarding gradually. Before enabling any additional model, verify exact CPMD/Repair Manual coverage and add representative/adjacent-variant tests.
4. Use `FAMILY-ONBOARDING.md` as the acceptance contract. Next architecture step: move family-specific troubleshooting and variant data toward validated family packages/adapters, starting with one bounded family; do not rewrite all families at once.
5. Keep Build 262 as the current candidate baseline until live testing uncovers any issue. Do not merge into production.

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
### 2026-10-19 — Build 261 and family-wide verification contract
- Build 261 changes machine identity verification so cataloged products in families not yet enabled for guided troubleshooting can be identified without falsely unlocking diagnostics.
- Product-number changes clear prior verification, diagnostic result, and history; unknown product numbers explicitly show Machine Not Verified.
- Expanded `tests/smoke-test.cjs` to run the product-number-only flow for all 75 catalog entries and distinguish enabled-family readiness from identity-only verification.
- Latest complete suite passed: [run 39290567895](https://github.com/BobbyT416/Copier-Wizard/actions/runs/39290567895), commit `5975d53f6b1852325300b25d00491b4c989817dc`.
- Added `FAMILY-ONBOARDING.md` as the standard for future family imports and release gates.
- Published Build 261 app and version files to `main/test/` with user authorization. Confirmed only `test/index.html` and `test/version.json` changed on `main`; root `version.json` remains Build 257.
- Pages deployment run `39290714550` was pending at the last check. Verify live test site before asking for manual testing.
- **Next action:** confirm Pages deployment; then test Build 261 and start gradual data-driven family onboarding work.
### 2026-10-19 — Build 262 exact-model gate
- Build 262 now separates identity verification from diagnostic readiness and clears stale identity/diagnostic state when product number or manual selectors change.
- The shared M501/M506/M507/M527/M528/E50045/E50145/E52545/E52645 selection family now enables only E52645, because the normalized manual-data package identifies E52645; M527 is specifically tested as identity-verified but diagnostics locked.
- Catalog-wide browser contract covers all 75 product numbers and confirms supported vs not-yet-enabled readiness behavior.
- Latest complete automated suite passed: [run 39291163344](https://github.com/BobbyT416/Copier-Wizard/actions/runs/39291163344), commit `e845b8888edb0df93df011ccfd93d557dbd0b3be`.
- Build 262 app and version files published to `main/test/` with explicit user authorization; only `test/index.html` and `test/version.json` changed on `main`. Root `version.json` remains Build 257.
- Build 262 Pages deployment run `39291308543` completed successfully. Test URL: https://bobbyt416.github.io/Copier-Wizard/test/ . Ask the user to confirm the visible build label and manually test the workflow.
- **Next action:** have the user confirm the test page shows Build 263, then test direct product entry, product-number browsing, and Change Machine navigation. After that, begin a gradual data-driven family-package migration.



## 10. Build 263 — product browser and unsupported-machine navigation (2026-10-19)

- Implemented in commit `648187eaf5b53ede58f82a1e4c9c96b5a8e787b4` on `development`.
- Added an explicit searchable **Browse Product Numbers** panel alongside direct product-number typing and native datalist suggestions. It searches product number, model label, and catalog key; selecting a result uses the existing verification path.
- Identified-but-unsupported models remain blocked from guided diagnostics, but now show **Change Machine** and **Browse Product Numbers** actions instead of leaving the technician stranded.
- Updated `tests/smoke-test.cjs` to cover unsupported-machine navigation and choosing M776zs/T3U56A from the browser. The selectors were tightened to avoid ambiguity between the always-present browser toggle and the unsupported-state action.
- Build 263 automated browser suite passed after the follow-up test-selector correction: [GitHub Actions run 39299315189](https://github.com/BobbyT416/Copier-Wizard/actions/runs/39299315189), commit `e8e66e2312afbc38fc7eee2e09f16a1a7a523710`.
- Build 263 is committed to `main/test/index.html` and `main/test/version.json` at main commit `0a4c00a0977e028c13fe34ec8d7e6a0a0433759e`. A GitHub compare confirmed those are the only changed paths on `main`; production root `index.html` and `version.json` remain Build 257. Live Pages serving status could not be independently confirmed from this environment; ask the user to verify the visible build number before functional testing.

- Follow-up refinement: **Change Machine** now clears the previous product number and machine-type selection before returning to the selection card, preventing stale identity from confusing the next selection. Added explicit assertions for those reset behaviors. Automated validation passed in run [39299315189](https://github.com/BobbyT416/Copier-Wizard/actions/runs/39299315189).
