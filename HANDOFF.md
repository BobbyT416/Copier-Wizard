# Copier Wizard — Permanent Project Handoff

**Updated:** 2026-10-20 (Build 276 adds automatic machine-selection progression)
**Repository:** https://github.com/BobbyT416/Copier-Wizard  
**Working branch:** `development`  
**Production branch:** `main`  
**Current development build:** **275** (`index.html` runtime label/update checker and `version.json` set to 275; test-site `index.html` and `version.json` synchronized. User confirmed Build 273 fixed the M527 entry path; Build 275 shortens opening field placeholders and product-number hints without changing selection/verification logic. Inline JavaScript syntax checks passed; Playwright smoke tests have not been run.)  
**Purpose:** A durable checkpoint for continuing Copier Wizard work across chats. Keep this file current after meaningful milestones and before a chat ends when possible.

> Accuracy rule: distinguish proposed, committed, automated-tested, deployed, and manually tested work. Do not claim tests or deployment passed without checking evidence. User prefers concrete progress over repeated plans. Continue independently until a genuine user decision or hands-on test is required.


## 0E. Simplify opening screen fields — Build 274 (2026-10-20)

- User asked to reduce the amount of explanation shown beside/under the opening-screen fields.
- Removed repeated “optional if product number is entered” text from Printer Type, Machine Family, and Model labels; removed “(optional)” from Product Number label.
- Replaced the long initial product hint with one concise instruction: “Enter a product number, or select printer type, family, and model.”
- Shortened dynamic product-number hints to brief status text and removed the family documentation paragraph displayed under Model, since it cluttered the form. Product-number validation and all selection behavior remain in place.
- Added smoke-test assertions for concise labels and the short hint.
- Published Build 274 to the test folder only. Development/test HTML match; all 15 inline script blocks compile; version metadata is 274; production root remains Build 257. Full Playwright smoke tests have not been run.

## 0E. Simplify opening machine-selection screen — Build 275 (2026-10-20)

- User requested less explanatory text beside the opening fields.
- Shortened dropdown placeholders to **Select type…**, **Select family…**, and **Select model…**.
- Changed product-number placeholder to **HP product number (optional)** and the helper line to **Optional — helps verify the exact variant.**
- Shortened the product-number catalog feedback to concise status messages.
- Preserved the user's category-first flow: Printer Type (Monochrome / Color / PageWide) → Machine Family → Model → Product Number → FutureSmart when applicable → Verify Machine. No selection or verification logic was intentionally changed.
- Published Build 275 to test only. Development/test HTML are identical; both version files say 275; all 15 inline script blocks compile; production root remains Build 257.
- User has not yet manually reviewed Build 275. Full browser smoke test suite not run.

## 0E. Automatic machine-selection progression — Build 276 (2026-10-20)

- User confirmed the simplified opening-screen labels worked, then requested that choosing machine information jump to the next field and open its selection list.
- Build 276 adds `cwFocusAndOpenSelect()`, which focuses the next enabled select and attempts the native `showPicker()` API, falling back to `click()` when unavailable or blocked.
- Selecting **Printer Type** now populates and opens **Machine Family**. Selecting **Machine Family** now populates and opens **Model**.
- After selecting a model, if more than one FutureSmart level applies, the FutureSmart picker opens automatically. A single applicable level is still selected automatically. If no additional firmware choice is required, the page scrolls to Product Number but deliberately does not open the mobile keyboard for that optional text field.
- Added Playwright smoke-test assertions for the automatic picker sequence and firmware-picker behavior.
- Published only to `main/test/index.html` and `main/test/version.json`. Development and test HTML match; all 15 inline JavaScript blocks compile; both version files show Build 276; production root remains Build 257.
- The full Playwright suite and iPhone/Safari native picker behavior have not been run/independently verified in this session.

## 0D. Restore the main-site M527 verified troubleshooting screen — Build 273 (2026-10-20)

- User supplied a screenshot of the expected main-site flow after verifying product F2A81A: “Machine Verified — App Ready,” product M527c / FutureSmart 5, then the standard “2. What's wrong?” card with Numerical Error Code, Alphabetical Message, Parts Lookup, and “I don't have an error code or message.”
- Root cause: development had a `supportedModels: ["E52645"]` restriction inside the shared M501/M506/M507/M527/M528/E50045/E50145/E52545/E52645 family. Production main did not have this restriction, so the test branch incorrectly diverted M527 to the unsupported/manual-search screen.
- Build 273 changes the allowed list to `["E52645","M527"]`, restoring the normal App Ready + problemCard entry path for M527 while keeping the other family models gated.
- `cwActiveErrorCatalog()` now scopes M527 numerical-code search/browse results to extracted error records that explicitly mention M527 and match the verified M527 product variant where the source names variants. The existing M527 error renderer continues to suppress E52645-specific overrides and filter M527 parts.
- Smoke test updated to assert the four expected entry options and that M527c error-code search finds documented 30.01.44 Scanner error.
- Published only to `main/test/index.html` and `main/test/version.json`. Static validation confirms development and test HTML are identical, all 15 inline script blocks compile, version metadata is Build 273, and production root remains Build 257.
- User manually tested the live Build 273 test site and confirmed: “That worked.” This verifies the expected M527 verified-machine screen is now reached. Full browser/Playwright smoke tests remain unrun.

## 0C. Multiple M527 troubleshooting entry options — Build 272 (2026-10-20)

- User tested Build 271 and said a single manual-search field was only a slight improvement; they expected multiple troubleshooting options.
- Build 272 replaces the single generic M527 search prompt with three selectable entry modes: **Numerical Error Code**, **Control-Panel Message**, and **Symptom or Problem**.
- Search behavior changes by mode: error-code mode searches the extracted error-code field; message mode searches descriptions and summaries; symptom mode searches descriptions, summaries, steps, and parts. Results still must explicitly mention M527 in the supplied HP text.
- Exact-variant safeguard remains: the source-reference results are available at family selection, but starting a documented diagnostic branch requires a verified exact M527 product number. No generic E52645 workflow is enabled by this change.
- Added regression assertions for all three options and their placeholder changes in `tests/smoke-test.cjs`.
- Published only to `main/test/index.html`; development and test HTML are identical, both labels and version metadata show Build 272, all 15 inline script blocks compile, and production root stays at Build 257.
- Full Playwright smoke tests and live Pages behavior have not been independently verified in this session.

## 0B. M527 model-only verification fix — Build 271 (2026-10-20)

- User screenshot showed Build 270 still displaying the old “Machine selected — guided workflow not yet enabled” card and its redundant Browse Product Numbers button when M527 was selected without entering a product number.
- Root cause confirmed in `verifyModel()`: the no-product-number branch still used the generic unsupported-family fallback; the new M527 manual-search entry was only shown after a valid product number had been entered.
- Build 271 adds an M527-specific no-product-number result: “HP M527 selected — manual search available,” with the HP manual search field and Change Machine. It removes the redundant Browse Product Numbers button from that result.
- Manual search remains usable before exact variant confirmation, but its result explains that the exact product number must be entered and Verify Machine selected before documented troubleshooting can start. This prevents a family-level search from silently running variant-specific steps or parts.
- Added a Playwright smoke-test regression assertion for the model-only M527 path in `tests/smoke-test.cjs`.
- Published Build 271 only to `main/test/index.html` and `main/test/version.json`. Production root remains untouched.
- Static validation performed: all 15 inline script blocks compiled successfully; development and test `index.html` contents match exactly; both runtime labels show Build 271 and test `version.json` is 271. Playwright smoke test was **not run** because the browser/test runtime was not available in this session; live GitHub Pages behavior is **not independently confirmed**.

## 0A. Latest M527 work — Build 270 (2026-10-20)

- The user reported Build 269 still dead-ended after machine verification. Build 269 had fixed stale version labeling only; it had not delivered guided M527 troubleshooting.
- Build 270 adds a **Start Documented Troubleshooting** action to M527 manual-search results when an extracted error record includes steps. For a verified M527 product number, it routes to the existing documented-error renderer.
- The M527 route suppresses getE52645TechnicianOverride, checks the extracted record for M527-family applicability, displays the exact variant from the selected product number, and only lists part entries whose source text explicitly names M527 and is not restricted to a different named M527 variant.
- The M527 route uses the supplied normalized HP error catalog; it does not unlock the generic E52645 symptom workflow or any E52645-only part override. An unvalidated error entry is withheld.
- Added smoke-test assertions for product F2A81A (M527c), searching error 30.01.44, starting the documented workflow, and checking that the resulting screen contains the documented scanner error and technician troubleshooting without identifying as E52645. **These assertions have not been run in this session.**
- Test-only release: main/test/index.html and main/test/version.json updated to Build 270. Production root files were not changed. Live Pages deployment is not independently confirmed.
- Development commits: 79eb7eca94b30c601f12359d0ef2e005be16211a (initial M527 entry point), b7f286687993c6b367e9fc6fc3e564deecf428fd (regex correction), b8d54542f66ebf57eeb121270098aff669ca92f4 (M527c regression test), ef5437f61282d5ea262e4b14b3c582c70b23a836 (version metadata), a5dd8e8bd5032e697acebd72b766b7e749453a47 (model-correct unverified-code fallback). Test commits: 81e4842c94602cc6b66afcba6e26087478497ea5 (test index), 389068c0458d4edd7595a4e0a75c8ca58193b4d4 (test version).
- Next: run the smoke test in CI or a local Playwright environment, fix any failures, verify live test-site Build 270, then expand exact-model validation for more M527 error codes and variant-specific repair procedures. Do not claim Build 270 behavior is tested until that happens.

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
- Build 265 navigation fix was committed across `index.html`, `version.json`, and `tests/smoke-test.cjs`; latest known development commit after making the scroll assertion wait for the viewport is `e9d7f255d4ad558f312973f6ba647a97375372f5`. Confirm branch head before further work.
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


### 2026-10-19 — Build 264: model-scoped product-number choices
- User reported that after selecting M527, Browse Product Numbers displayed E50xxx/E52645-family entries. Root cause was confirmed: the browser flattened and searched the entire product-number catalog, regardless of the selected model. The native datalist also listed the entire catalog.
- Build 264 scopes both the browser and native product-number suggestions to the selected model's catalog key. With no model selected, browsing the full catalog remains available.
- Changing the selected model clears a stale search term so results from a previously browsed model cannot leave the new model's list looking empty.
- When manual machine selectors are already populated, a conflicting directly entered product number now produces an explicit Product Number Mismatch and does not silently replace the selected machine. The mismatch state offers Change Machine.
- Added regression tests for the M527 scope: only its six product numbers are listed; searching E50045 while M527 is selected returns no results; choosing F2A76A preserves the M527 identity; entering T3U55A while M527 is selected produces a mismatch rather than switching machines.
- Automated run passed: https://github.com/BobbyT416/Copier-Wizard/actions/runs/39304868336 (head commit `fff8549d1a0c38898fe0d8a21cb7888471e74578`; 75 product numbers also passed the existing product-only verification test).
- Published Build 264 to `main/test/index.html` and `main/test/version.json` only. Verified each release commit touched only its intended `test/...` file. Production root app was not changed.
- Live Pages rendering could not be independently confirmed from the available browser access; user should confirm the test site displays Build 264 before functional testing.
- Next action: user tests M527's filtered browser and mismatch behavior. If correct, continue standardizing the family-onboarding and regression-test process.


## 11. Build 265 — verified-machine continuation (2026-10-19)

- User reported that after machine verification the app appeared to be a dead end.
- Code inspection found that the supported-machine branch removed the hidden state from `#problemCard` but did not scroll to it or offer a clear continue action in the verification status. On a phone, the newly revealed section can remain below the fold and look like the flow stopped.
- Build 265 updates the successful verification status to include **Continue to Troubleshooting**, which scrolls the next section into view. Successful verification also automatically scrolls to the troubleshooting section after layout settles.
- The existing safety gate remains: M527 (product `F2A76A`) is identity-verified but guided troubleshooting remains locked because the current normalized manual-data package has only validated the E52645 workflow in that shared monochrome family. Do not unlock M527 by merely changing navigation. Unsupported-model screen retains Change Machine and Browse Product Numbers options.
- Added a browser regression assertion to `tests/smoke-test.cjs` that the supported M776dn product-number flow exposes the continue action and brings the troubleshooting card into the viewport.
- Development files updated: `index.html` build marker 265; `version.json` build/version 265; `tests/smoke-test.cjs` navigation regression test. Relevant commits: app `5a555e5fb3a6af50dc29822d2d2df37f82cde283`, version `7b01d3d6009b46b6b2c7280cf77959902f18ede6`, smoke-test `e9d7f255d4ad558f312973f6ba647a97375372f5`. Handoff snapshot commit: `775bdb75740da49be89d78e2e4fc1485d42af292`.
- **Automated test status:** pending independent confirmation for Build 265. The regression test waits for the troubleshooting card to enter the viewport after the Continue action. Do not claim the suite passed until a matching run is inspected.
- Published Build 265 to `main/test/index.html` and `main/test/version.json` under the user's standing authorization for test-only releases. Release commits: `34f7bb76fb916e9be31b1ca31e03253a4560ec03` (test app) and `469762ec6a40af05d1cb1434fcffa94f60aee73c` (version marker).
- Compare from the Build 264 release commit `aacf1a208bc551ab8a3863050bff149aabaa75ae` to the Build 265 version commit confirms only `test/index.html` and `test/version.json` changed on `main`. Production root files were not modified.
- Live Pages deployment/serving status is not yet independently confirmed. Test URL remains https://bobbyt416.github.io/Copier-Wizard/test/ .
- **Next action:** confirm the Pages deployment and visible Build 265 label; then have the user test M776dn (`T3U55A`) continuation. Separately confirm that M527 (`F2A76A`) remains clearly identified but gated from guided troubleshooting pending exact workflow validation.


## 12. Build 266 — contextual diagnostic decision wording (2026-10-19)

- User preferred wording that follows the actual HP-documented condition instead of generic button labels “Yes — condition is true” / “No — condition is not true”.
- Updated the shared documented-decision renderer used by both the guided documented path and the alphabetical message path. The displayed question is still derived from the extracted HP source condition; common question forms now get answer buttons that state the observed result. Example: “Does error 31.03.20 still return?” → “Yes — error 31.03.20 still returns” / “No — error 31.03.20 does not return”. State questions use concise answers such as “Yes — it is” / “No — it is not” below the specific question.
- Corrected a grammatical issue in question conversion so conditions ending “still returns/occurs/persists/fails” become questions using the base verb (“Does … still return/occur/persist/fail?”).
- For unrecognized question forms, fallback labels are “Yes — this matches the documented check” / “No — this does not match the documented check”. This is a display-only change: it does not change the parsed condition, documented action, or yes/no branch behavior.
- Added smoke tests for source-condition-to-question grammar, contextual answer labels, and absence of the old generic true/false labels in rendered UI. Existing M776zs guided-flow test now selects a “No —” answer without depending on the old exact wording.
- Development commit validated: `1e65b144c9b85e438640a7ca93b10d1ece0e6120`. Full browser/syntax/safety suite passed: [GitHub Actions run 39310472182](https://github.com/BobbyT416/Copier-Wizard/actions/runs/39310472182).
- Published Build 266 to the test site under the user's standing authorization for test-only releases. Test app commit `f7320bf5c6b84932e03ec61fb3c76e21176e36a1` changed only `test/index.html`; test version commit `1ff01897f8c73c8c61bda5946d95d4c9fb0ecf5e` changed only `test/version.json`. Production root `index.html` and `version.json` were not changed; root version remains Build 257.
- GitHub Pages deployment completed successfully for the final test-site version commit: [run 39310685674](https://github.com/BobbyT416/Copier-Wizard/actions/runs/39310685674). The preceding app-only deployment was cancelled when the version-marker commit triggered the final deployment. The final run includes both test files.
- The live site could not be independently read by the available web fetcher; the repository files and successful deployment workflow are confirmed. Ask the user to verify the visible Build 266 label before functional testing.
- **Next action:** have the user review the contextual Yes/No wording during a real troubleshooting flow. If anything sounds unnatural or does not match the HP branch, adjust the presentation without changing diagnostic logic. Production remains untouched.


## 2026-10-19 — Build 268 M527 verified-machine reference entry point
- User reported Build 267 still dead-ended after verifying M527c. Root cause: the family readiness gate correctly blocks the E52645 guided workflow for M527, but the verified screen offered no diagnostic entry point.
- Added a **Search HP Manual** reference lookup to the verified-but-guided-workflow-disabled screen. It searches the indexed HP error records only when the record's extracted text explicitly mentions the M527 family, then displays the source entry's documented summary/steps and only part references that explicitly mention M527. It is a source-reference lookup, **not** a validated branching workflow, and does not unlock the E52645 guided diagnostic engine.
- Removed product-number browsing from the verified screen; Change Machine remains available.
- Added a smoke-test path for verified M527 manual search using error code 30.01.44. The test has been updated in source but has **not yet been run in a browser in this session**.
- Development source commit for the new lookup: `4def11a2d33e8d689f1c2dce9575b5c1a845d494`; development version marker updated to Build 268 in commit `a5aa04eed242cc2f6563aa70ff47412d369b8698`. Earlier same-turn commits added the implementation and test changes; these are all on `development`.
- Next: publish Build 268 to `main/test/index.html` and `main/test/version.json` only; verify the Pages deployment; then test M527 error-code search and check that unknown codes produce a safe no-match message. Production root stays untouched.

- Test-only publication: `main/test/index.html` updated in commit `aeb8090eeae13a0b4df13bde53741c87abe80d4c`; `main/test/version.json` updated to Build 268 in commit `3d90f74b7784a6a78b3e9ea03a48c470b5e3a602`. Re-fetched repository files confirm the test folder contains the M527 search code and version 268. Live GitHub Pages deployment and browser test are not independently confirmed; do not claim either passed.
