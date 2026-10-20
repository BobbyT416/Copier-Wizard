# Copier Wizard — Permanent Project Handoff

**Updated:** 2026-10-20 (Build 290 test-catalog review; full audit remains in progress)
**Repository:** https://github.com/BobbyT416/Copier-Wizard  
**Working branch:** `development`  
**Production branch:** `main`  
**Current development build:** **283** (`development/version.json` and `index.html` `CURRENT` marker report 283). **Latest test-site artifact:** **290** (`main/test/version.json` reports 290). These are different branches/artifacts: Build 290's test HTML imports `test/cw-cpmd-catalog.js`; production root remains protected. Do not claim Build 283 or Build 290 passed CI/browser tests or was deployed unless verified. Production `main` must remain untouched unless the user explicitly approves.)  
**Purpose:** A durable checkpoint for continuing Copier Wizard work across chats. Keep this file current after meaningful milestones and before a chat ends when possible.

> Accuracy rule: distinguish proposed, committed, automated-tested, deployed, and manually tested work. Do not claim tests or deployment passed without checking evidence. User prefers concrete progress over repeated plans. Continue independently until a genuine user decision or hands-on test is required.







## 0Q. Build 283 — restore missing source-backed supply actions and grouped-code behavior (2026-10-20)

- Updated only `development` app/data/test files; did not merge into `main` or deploy to the test site.
- Reconciled the M527-family CPMD supply section against its actual source text. The previous data extraction had incorrectly merged the `10.00.11, 10.00.12 Supply Memory Error` procedure into `10.00.10`, leaving both grouped codes unsearchable and making `10.00.10` display unrelated steps. Split the records: `10.00.10` now keeps its four applicable steps; a separate grouped `10.00.11, 10.00.12` entry contains the source-backed firmware, reset-frequency, genuine-supply/warranty, reinstall, and replacement guidance.
- Restored documented recommended actions for `10.00.15`, `10.00.35`, `10.00.41`, `10.00.60`, `10.00.69`, `10.00.70`, and `10.00.91`; added the explicit no-action wording for `10.00.33`; and preserved the authenticity note for `10.00.34`. These corrections reduce false 'no procedure extracted' results without inventing steps.
- Expanded the generic no-action matcher to recognize exact standalone source statements `No action necessary.` and `There is no action needed [for this message].` This allows informational entries such as `10.00.40`, `10.00.59`, and `32.1C.40` to display as no-action outcomes.
- Fixed grouped-code selection to preserve the exact alias the technician entered. For example, selecting the grouped `10.00.00 or 10.00.01` record after searching `10.00.01` should open/report `10.00.01`, not silently substitute `10.00.00`.
- Added/updated smoke tests for the genuinely missing-procedure path (`13.00.EE`), the recovered `10.00.60` procedure, exact alias searches for `10.00.12` and `10.00.01`, and the explicit no-action `32.1C.40` outcome.
- Build `version.json` and the app `CURRENT` marker both report **283**. Static parsing confirms all 15 inline scripts and the smoke-test source parse successfully; the current Actions run for the latest test commit is still pending. Do not publish until it completes and any failures are fixed.
- CPMD coverage comparison after these fixes: **168 of 210 concrete code tokens** from the 303-record catalog are now present in the app's stored `code` fields; **42 concrete tokens remain to reconcile**: `11.00.02`, `32.08.A1`, `32.08.A2`, `32.08.A3`, `32.1C.06`, `32.1C.07`, `32.1C.08`, `32.1C.09`, `32.1C.0A`, `32.1C.0D`, `32.1C.11`, `32.1C.13`, `32.1C.14`, `41.03.01`, `41.03.A1`, `41.03.B1`, `41.03.C1`, `41.03.A2`, `41.03.B2`, `41.03.C2`, `41.03.03`, `41.03.A3`, `41.03.B3`, `41.03.C3`, `41.03.04`, `41.03.A4`, `41.03.B4`, `41.03.C4`, `41.03.05`, `41.03.A5`, `41.03.B5`, `41.03.C5`, `41.03.0D`, `41.03.AD`, `41.03.BD`, `41.03.CD`, `42.B0.02`, `65.80.A0`, `65.80.A1`, `82.73.46`, `82.73.47`, `98.01.00`. Many are grouped entries or event codes; reconcile body instructions and applicability before enabling them, and keep event-code entries distinct from repair procedures.
- Next: finish Build 283 CI/browser verification; continue the 42-token reconciliation from the actual CPMD body; then audit every remaining no-step record against the CPMD for extraction gaps, explicit no-action entries, and genuinely absent procedures. Candidate next family remains M607/M608/M609 plus E60055/E60065/E60075/E60155/E60165/E60175, which has both a service manual and CPMD in the Library; keep it gated until validation is complete.

## 0P. M527 CPMD inventory comparison and browser-test follow-up (2026-10-20)

- Located the actual combined-family M527 CPMD PDF and its generated `m527-cpmd-catalog.json` / `.csv` inventory in the user's Library. The catalog states that it represents the M501/M506/M507/M527/M528/E50045/E50145/E52545/E52645 combined-family CPMD and warns that a code's presence does not prove applicability to every model.
- Parsed the CPMD catalog: **303 TOC records**, **330 unique code tokens**, including **210 concrete code tokens** and **120 pattern/nonstandard tokens**. Record types: 242 message entries, 22 grouped entries, 32 family-section headings, and 7 event-code entries. These counts describe the catalog's TOC inventory; they are not 330 independent actionable control-panel errors.
- Compared concrete tokens against the current `cw-manual-data.js` error-record `code` fields. **165 of 210 concrete tokens appear directly in the stored code fields; 45 are not directly searchable by their own token.** Some may be intended grouped aliases or event-log-only entries, but they must be explicitly reconciled, not ignored.
- Missing concrete tokens from the code-field comparison (preserve this list for the audit): `10.00.01`, `10.00.11`, `10.00.12`, `11.00.02`, `32.08.A1`, `32.08.A2`, `32.08.A3`, `32.1C.06`, `32.1C.07`, `32.1C.08`, `32.1C.09`, `32.1C.0A`, `32.1C.0D`, `32.1C.11`, `32.1C.13`, `32.1C.14`, `41.03.01`, `41.03.A1`, `41.03.B1`, `41.03.C1`, `41.03.A2`, `41.03.B2`, `41.03.C2`, `41.03.03`, `41.03.A3`, `41.03.B3`, `41.03.C3`, `41.03.04`, `41.03.A4`, `41.03.B4`, `41.03.C4`, `41.03.05`, `41.03.A5`, `41.03.B5`, `41.03.C5`, `41.03.0D`, `41.03.AD`, `41.03.BD`, `41.03.CD`, `42.B0.02`, `65.80.A0`, `65.80.A1`, `82.73.46`, `82.73.47`, `98.01.00`.
- Important grouped-entry finding: many of the missing tokens appear in grouped headings whose first code is already represented (e.g. `10.00.00 or 10.00.01`, `10.00.11/10.00.12`, `11.00.01/11.00.02`, and the 41.03 families). Ensure each token is searchable and resolves to the exact documented grouped entry. For an exact entered alias, the result title/report should preserve the exact code the technician entered, rather than always substituting the first alias in the group.
- The 7 event-code entries and family/pattern headings must remain clearly distinguished from concrete control-panel messages. Add them to search only with accurate type/description and source wording; do not turn every TOC heading into a repair procedure.
- Latest Playwright run against commit `1eb2ee67044714ee99964d7af4d9473c84b586b4` passed build/syntax/safety validation and installed Chromium, but browser smoke tests failed at an outdated assertion expecting `HP M527 selected — manual search available`; the current app correctly shows `Machine Verified — App Ready` and a Continue button. Updated the test to validate the current flow and retain the M527-only product-number scope assertions. New test commit: `0921ad5d093fd41c28d22145b38e2acc43a52981`; its Actions run is pending/not yet verified.
- Current family readiness found in `machineSelectionFamilies`: guided troubleshooting is enabled for the validated `E52645` and `M527` models in the M501/M506/M507/M527/M528 family, and for `M776`; the other listed families remain gated. Candidate next family for onboarding is M607/M608/M609 plus E60055/E60065/E60075/E60155/E60165/E60175 because the Library contains both the `HP E60xx5_E62xx5 Service Manual.pdf` and `M607_8_9 E600x5 E601x5 CPMD.pdf`. Do not enable it until its code, procedure, part, model-variant, and regression-test coverage is audited.

## 0O. Build 282 — distinguish no-action entries from extraction gaps (2026-10-20)

- Added a reusable source-data rule: if the documented summary or steps contain the exact standalone recommendation `No action necessary.`, the result is shown as **No technician action required** instead of a generic missing-procedure warning. The match is deliberately exact to avoid suppressing troubleshooting because the phrase appears incidentally in other text.
- Updated regression coverage to test two different cases: `13.00.EE` should keep a clear no-procedure result and return navigation; `32.1C.40` should show the explicit no-action outcome and must not enter a repair-step flow.
- Build 281's first CI run failed because `version.json` had been bumped before the app's `const CURRENT` marker; that mismatch was fixed. Build 282 synchronizes both to 282. The no-action regex was also corrected after source inspection. Wait for the latest Actions run before claiming validation passed.
- Source-audit finding: in `cw-manual-data.js`, the shared E52645 database has 256 error records, 191 with non-empty `steps`, and 65 without. Of those 65, 13 summaries contain `See recommended action`, 26 are marked informational/event-log-only, 31 lack a `desc`, 13 are pattern entries, and none has a `parts` array. These are extraction-structure counts, not proof the source has no procedure.
- Confirmed extraction-gap example: code `10.00.60` has no stored `steps`, but the uploaded CPMD search result includes a recommended action to replace the toner cartridge only if print quality is no longer acceptable, plus a note to have replacement supplies available. Therefore the app must not equate an empty `steps` array with 'the manual has no procedure.' Audit each affected record against its actual applicable source before labeling it no-procedure or importing any instructions.
- Additional confirmed source behavior: `32.1C.40` is informational and its CPMD recommendation is `No action necessary.` This is the reason the explicit no-action fallback was added.
- Static syntax check before the latest no-action matcher correction passed for all 15 inline scripts and the smoke-test file. The current corrected revision still needs the GitHub Actions validation run to confirm syntax, build/safety checks, and browser tests.
- Next: confirm Build 282 Actions status; audit all 65 no-step records against applicable CPMD/service-manual sources, repair extraction gaps without mixing model-specific procedures, and add test cases for complete procedure, source recommendation without steps, explicit no-action, and genuinely absent procedure. Then continue the end-to-end diagnostic audit and add machine families through a repeatable validated onboarding process.

## 0N. Build 281 — simplify no-procedure results (2026-10-20)

- Implemented on `development`: when a code is found but has no extracted step-by-step procedure, the result now ends in a concise terminal state with a clear explanation and navigation buttons. It does not leave the technician facing a hidden completion/outcome panel. Source-listed parts, if any, are labeled as documentation context rather than a replacement recommendation.
- The documented code and description/summary remain visible. This change does not remove codes, invent steps, or treat missing extracted steps as proof that HP has no recommendation elsewhere in the source.
- Added a Playwright smoke-test assertion using `32.1C.40` to check the no-procedure state, return navigation, and absence of the hidden procedure outcome panel.
- Bumped `version.json` from 280 to **281**.
- Commits: app `d79b3c4e0c50397736050e8849776f6d9a2b69fa`; regression test `0e4648b631d86085e6d7ad45c70f148511e52c6b`; build marker `9292c954a3957a353117674985d089d771450e8c`.
- Static validation: all 15 inline scripts in `index.html` parse; `tests/smoke-test.cjs` parses; 19 smoke-test checkpoints are present. **The Playwright suite has not been executed against this latest HEAD**, so do not claim browser behavior is verified and do not deploy yet.
- Next: run the latest Playwright workflow; resolve any failures; audit whether the 65 shared-database records with no `steps` are true no-procedure entries, informational records, extraction gaps, or procedures documented elsewhere. Then continue auditing all diagnostic entry points and prepare the repeatable machine-family onboarding checklist.

## 0M. User priorities and troubleshooting audit kickoff (2026-10-20)

The user explicitly directed: **keep documented error codes even when no procedure is available; simplify the technician experience; perform a complete self-audit of troubleshooting; and work toward onboarding additional machine families.** These are active priorities, not completed work.

### Initial source inspection (development branch)
- `version.json` currently reports build **280**, while the previous handoff described Build 279. Reconcile the in-app build marker, latest commits, CI, and deployment before describing a build as released or verified.
- The shared `cw-manual-data.js` `CW_MANUAL_DATABASE` parses successfully and contains **256 error records** in the E52645 source database. A preliminary structural count finds **65 records without a non-empty `steps` array** across the full shared database. This is a data-shape count, not yet a source-verified audit of which codes truly have no procedure; some records may be patterns, aliases, grouped headings, or have procedures elsewhere in the source.
- A preliminary applicability filter found 57 candidate M527 records and zero without steps, but this is not yet an authoritative M527 CPMD reconciliation. Do not report this as proof that every M527 code has a procedure.
- `renderDocumentedErrorBranch()` already preserves catalog hits with no extracted steps and displays a warning rather than inventing steps. However, the renderer also creates a hidden documented-parts section that normally becomes visible after the documented steps finish; no-step records may therefore have a confusing/blocked path to any source-listed parts. Review and simplify this path without inventing actions or parts.
- `searchErrorCodes()` now displays all matching prefixes without an eight-result cap. Keep that behavior; do not remove valid codes to make the UI shorter. Simplify presentation and navigation, not coverage.

### Required self-audit before declaring troubleshooting complete
1. Inventory every diagnostic entry point: numerical codes, alphabetical control-panel messages, symptom categories, manual-text search, model-specific overrides, diagnostic tests, part recommendations, removal/replacement procedures, and service-report capture.
2. For every error/message record, validate source provenance, applicable model/family/variant/firmware, whether a documented procedure exists, parts linkage, and end-of-path navigation.
3. Test four outcomes separately: complete documented procedure; description/recommendation without a detailed procedure; code listed but no action supplied; and unknown/unverified code. Keep listed codes discoverable in every case.
4. Check grouped/pattern codes and aliases so they resolve to the proper source entry without generating fabricated instructions. Ensure documented informational/no-action entries do not trigger generic repair steps.
5. Verify the full user flow with browser tests and manual iPhone/Safari testing where possible; record evidence, failures, and remaining gaps.
6. After the audit baseline is stable, onboard more machine families one at a time using a repeatable family checklist and regression tests. Do not enable guided troubleshooting for a family until model/variant scope, source coverage, parts, procedures, and fallback behavior are validated.

### Guardrails
- Preserve all documented error codes, including those with no detailed procedure.
- Do not fabricate troubleshooting, part recommendations, or source claims.
- Apply reusable fixes globally when safe; keep model/variant applicability filters strict.
- Work only on `development` and test builds. **Do not merge into or deploy `main` without explicit user approval.**
- Update this handoff with measured results and test evidence after each meaningful milestone; do not mark the audit complete until the checks above are actually performed.

## 0L. Latest browser run and follow-up test fix (2026-10-20)

- Validation run `39366938249` ran the Build 279 source. HTML/JavaScript/build/safety validation passed; the product-number-only flow passed and all 75 cataloged product numbers passed.
- The browser suite then stopped on a strict-mode test selector at `tests/smoke-test.cjs:190`: the regex `/Numerical Error Code/i` matched both the main numerical lookup choice and the separate “Browse All Numerical Error Codes” button. This was a test-selector ambiguity, not a product or numerical-code failure.
- Fixed the M527 screen assertions and click to target `.lookup-choice` elements filtered by text. Development commit: `bdf516d8e13bf150e371290bec1f5ed1d8c1f21d`. Copied the updated test file to the temporary validation branch, but no new workflow run was exposed after that app-authored commit.
- The failed validation-only PRs were closed without merging. Production remains untouched. Build 279 is **not yet browser-suite verified** and has not been deployed to the test site.
- Next action: obtain a fresh Actions run against the latest `development` HEAD (the previous run does not include the selector fix), then continue through the M527 prefix and exact-code checks. Do not mark fixed or publish until those checks pass.

## 0K. M527 31-series source comparison and regression cleanup (2026-10-20)

- Compared the stored catalog's concrete 31-series entries against the uploaded M527/E52645-family CPMD material. The catalog currently contains all 14 concrete records found in the M527-family list: `31.01.47`, `31.03.14`, `31.03.20`, `31.03.22`, `31.03.30`, `31.03.31`, `31.03.32`, `31.03.33`, `31.03.34`, `31.13.00`, `31.13.01`, `31.13.02`, `31.13.13`, and `31.13.14`, plus the general `31.*` record.
- The separate CPMD passage for `31.03.37` describes an ADF multi-pick ultrasonic-sensor issue and specifically notes that it typically appears on Flow models such as M776z/M776zs. It is not being added as an M527-specific record without M527 applicability evidence.
- Source-level JavaScript syntax check on Build 279: all 15 inline scripts parsed successfully. This is a static check, not a substitute for Playwright/browser verification.
- Corrected test regexes to match literal dots in `30.01.44`, `31.01.47`, and `31.03.30`; the relevant commits are `63e7757f2af3471184e73a0f21edebd07a143d1d` and `2ce5982e8a3579f1bcafebcd0143c7bdbf42bca6`.
- Latest automated browser result is still unverified; the available commit-run lookup does not expose push-triggered runs. Keep Build 279 unreleased until the browser suite has actually passed. Production remains untouched.

## 0J. Build 279 — numerical error-code search fix (2026-10-20)

- **Root cause found in `index.html`:** the final keyboard handler intercepted Enter and immediately called the diagnostic router, while the existing `searchErrorCodes()` function was not wired to the input event. As a result, the numerical-code result list was not populated through the expected search flow. The renderer also displayed `item.description` although the HP records use `desc`, hiding useful descriptions, and it truncated prefix results to eight entries.
- Fixed the numerical-code input listener so typing and Enter search the active catalog; the explicit **Enter Error Code** button remains the direct-entry route. Selecting a result still opens its documented diagnostic.
- Removed the eight-result cap so a prefix such as `31` can display all matching catalog entries, and corrected descriptions to use `item.desc || item.description`.
- Bumped development build to **279** in `index.html` and `version.json`.
- Updated `tests/smoke-test.cjs`: product-number test now follows the explicit verification/Continue flow; M527 prefix regression asserts the full list is returned (at least 10 results) and includes `31.01.47` and `31.03.30`. Exact-code regression remains in place.
- Commits: app fix `674cec521a56a0a4ced9599c8cc7a08b21a18ffa`, description fix `4cba53080fa65cb9e60b55b3b8cea84c0b3e4ad3`, test updates `45dbdaaf8cb7ff2e14346ef1c29658d3d941e8d9` and `01905437c04fb2cc95dddac8c826b5de0fde120c`, build marker `026f5539c1414b52dc0bace21a4d4d7d67b1ff8e).
- **Verification status:** source changes committed; automated browser run for the latest commit is not yet visible through the available commit-run lookup. Do not mark fixed or deploy until CI confirms the browser tests pass and the M527 list is reconciled against the correct HP CPMD/service manual.
- Production branch `main` was not changed. Do not release to production. Next: inspect the next Actions run, resolve any failure, then compare all M527-applicable numeric codes in the uploaded M527 service manual/CPMD against the catalog and test Build 279 at the test URL.

## 0I. Correct M527 31-series regression assertion — 2026-10-20

- Re-inspected the live `development` source and `cw-manual-data.js`. The shared data layer contains individual M527-family 31-series records including `31.01.47` and `31.03.30`; `31.03.37` is not present as a separate record in the stored catalog. Do not invent its detailed diagnostic content or assume applicability to M527 without validating the CPMD passage.
- `cwM527DocumentMatches()` explicitly permits all `31.xx.xx` records, and `cwActiveErrorCatalog()` applies that filter when the selected model begins with M527. The numerical search uses this active catalog and should match a prefix such as `31`.
- Found the M527 prefix-search regression assertion used a wrongly escaped regular expression (`/31\\\\./` in the JavaScript source), which would not match a normal code such as `31.03.30`. Corrected it to `/31\\./` so it actually verifies visible 31-series results.
- Test-file commit: `0e500bc24786eef33b3a5401ac42768e118d4bc1` on `development`.
- Automated result for this commit: **not yet verified**. Check the resulting GitHub Actions run before claiming success. No test-site release was made and production remains untouched.
- Next: inspect the CI result; if green, run/review the actual M527 list against the CPMD and identify whether remaining live-site behavior reflects stale test-site files or another runtime issue. Do not call the issue fixed until the displayed list is verified.

## 0H. Fix browser-test state contamination before M527 verification (2026-10-20)

- Inspected failed Actions run [39365402765](https://github.com/BobbyT416/Copier-Wizard/actions/runs/39365402765). HTML/JavaScript/build/safety checks passed; Playwright failed at the product-number-only T3U55A test because the earlier picker-flow unit check left the machine selector on M527. T3U55A was then correctly rejected as a mismatch, leaving `#problemCard` hidden. This is a test isolation defect, not evidence that the product-number feature itself is broken.
- Added `page.reload()` after the picker/decision-wording checks and before the end-to-end product-number tests, so later tests start from a clean machine-selection state. Commit: `9f086537713930d5c9d8440ceecffb9bf2fd1195` on `development`.
- This test adjustment is committed; its new Actions result has not yet been checked. Do not claim the suite passed until the run is inspected.
- Source inspection confirms `cwActiveErrorCatalog()` filters M527 records through `cwM527DocumentMatches()`, which allows 31-series codes regardless of whether each record repeats the model name. The standard numerical-code lookup loops over `cwActiveErrorCatalog()`. The separate M527 manual-reference search still has an explicit M527-text filter, but it is a different UI path and should not be confused with the standard Numerical Error Code browser.
- The uploaded CPMD PDF `08431526-6768-47f3-bbb9-8ee5e8bcfaf0.pdf` documents the 31-series section, including `31.03.37`; its note says that code typically appears on Flow models such as M776z/M776zs. Do not assume it applies to M527 without checking the M527-specific manual applicability. Catalog entries currently include the other 31-series codes listed in section 0F, plus wildcard `31.*`, but not a discrete `31.03.37` record.
- Next: inspect the Actions run for commit `9f086537...`; fix any failure, verify the M527 prefix and exact-code regression tests execute and pass, then reconcile the complete applicable numerical-code index against the CPMD. Test-site release remains pending and production must remain untouched.

## 0G. Build 278 CI failure and test-selector correction (2026-10-20)

- Inspected the actual GitHub Actions result for Build 278: [run 39362768841](https://github.com/BobbyT416/Copier-Wizard/actions/runs/39362768841). HTML/JavaScript/build/safety validation passed, but the Playwright smoke suite failed before reaching the M527 regression test.
- Failure was an ambiguous test locator in `tests/smoke-test.cjs`: filtering labels by substring `Product Number` matched both the Product Number label and “Search by product number or model.” This is a test-selector failure, not evidence that the application itself failed.
- Corrected the test locator to match the exact Product Number label in commit `8bc72c85c208856dc13e3e0e68d2c476debee363` on `development`. The rerun is pending/not yet verified at handoff time.
- No test-site release was made. Production remains untouched.
- Next: inspect the Actions run triggered by `8bc72c85...`; fix any further failures. Then complete the CPMD-to-catalog comparison for every numerical code applicable to M527, and only publish to `main/test/` after the suite passes. Do not call the 31-series issue fixed until the actual M527 browser behavior and manual reconciliation are verified.

## 0F. M527 numerical 31-series error-code investigation — Build 278 (2026-10-20)

- User's live test reported that selecting M527 and opening Numerical Error Code showed no 31-series errors.
- Inspected current development source. `cwActiveErrorCatalog()` routes M527 to `E52645_ERROR_CATALOG.filter(item => cwM527DocumentMatches(item, ...))`. The current `cwM527DocumentMatches()` explicitly allows codes beginning `31.` (and `31.*`) without requiring the record text to repeat M527. Therefore the source code at the current development head should not filter out all 31-series records; the test site may be serving an older build, or the failure is elsewhere in the catalog/rendering path. This has not yet been reproduced in a live browser.
- Inspected `cw-manual-data.js`: the stored error catalog currently has these 31-series entries: `31.*`, `31.01.47`, `31.03.14`, `31.03.20`, `31.03.22`, `31.03.30`, `31.03.31`, `31.03.32`, `31.03.33`, `31.03.34`, `31.13.00`, `31.13.01`, `31.13.02`, `31.13.13`, and `31.13.14`. The stored catalog has no `31.03.37` record.
- The uploaded file `08431526-6768-47f3-bbb9-8ee5e8bcfaf0.pdf` includes a `31.03.37` section, but its note says the code typically appears on Flow models such as M776z/M776zs. Do not automatically add this entry to M527's supported list until its applicability in the M527 CPMD is confirmed; don't fabricate model applicability or copy an M776-specific workflow into M527.
- Build 278 changes the app's build marker and `version.json`, and adds a browser regression assertion that a verified M527 search for prefix `31` returns at least one 31-series result, followed by the existing exact `31.03.30` lookup check. This is a regression guard, not yet proof that the entire issue is fixed.
- Development commits: app `1951db532d925f210fad8be02015d3407f5298a5`; version `225d6f76525903f5ab30f16c92a49fd21f415ec8`; smoke test `a8e538630314f0fd4069e4108f547dfa69b97bc2`. Commit each update sequentially; verify current branch head before further writes.
- **Automated test status:** not yet checked after Build 278 changes. **Test-site deployment:** not performed in this step. **Production:** untouched.
- Next action: inspect the GitHub Actions run triggered by the Build 278 commits; fix any failures; then publish the validated Build 278 files to `main/test/` only, confirm Pages deployment, and manually verify M527 prefix search on the test URL. Continue comparing every code in the M527 CPMD index against the stored list before declaring completion.


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


## 0J. Build 279 — M527 31-series manual-search filter correction (2026-10-20)

- Re-inspected development source and confirmed the M527-specific manual-search path (cwM527ManualSearch) still used a separate hard-coded condition requiring every extracted source passage to explicitly mention M527. This contradicted cwM527DocumentMatches(), which intentionally allows the shared CPMD 31.xx.xx document-feeder family for M527 models.
- Changed the manual-search path to use cwM527DocumentMatches(item, cwM527ExactModel()), aligning its applicability rule with the numerical catalog's shared 31-series rule. Variant-specific parts remain independently filtered.
- Bumped index.html and version.json to Build 279. This is a development-only change; no test-site publication or production change has been made.
- Important unresolved verification: prior GitHub Actions run 39365402765 failed before the M527-specific tests, timing out on the product-number-only M776 test because the app's current verifyModel() still requires type/family/model before checking the product number. Do not claim the 31-series fix is verified until the browser suite reaches and passes the M527 prefix/exact-code assertions.
- The uploaded CPMD contains a section titled 31.* errors and discrete entries including 31.01.47, 31.03.14, 31.03.20, 31.03.22, 31.03.31, 31.03.37, 31.13.00, 31.13.01, 31.13.02, 31.13.13, and 31.13.14. Applicability must be checked per ADF type/model; do not assume every code is applicable to every M527 variant solely because it is in the broader CPMD.
- Next: repair the stale product-number-only behavior or isolate it as a separate failing contract without weakening requirements; run Playwright and ensure it reaches the M527 numerical lookup. Then reconcile the complete CPMD index against the actual searchable M527 catalog, including discrete 31-series codes, and only then publish test files.


## 0Q. Build 290 test-catalog audit and safety hold (2026-10-20)

- Reconciled the apparent build-number discrepancy: development/version.json is still Build 282, while main/test/version.json is Build 290. Build 290 was committed directly to the test-site files on main; it is not the same as the current development build. Do not describe development as Build 290.
- Inspected the test artifact test/cw-cpmd-catalog.js: 336 records, 330 unique code tokens, 6 duplicate records. Record-type counts: 37 family-section entries, 52 grouped entries, 240 message entries, and 7 event-code entries. Every record has an empty steps array. These counts are structural and are not a verified count of actionable M527 errors.
- Inspected Build 290's integration diff. It concatenates the full combined-family CPMD catalog with the E52645-oriented catalog and explicitly permits every source === CPMD record through the M527 applicability filter. The catalog itself warns that presence in the combined-family CPMD does not prove applicability to each model. This is an applicability risk and must be corrected before calling Build 290 reliable for M527.
- Because all imported CPMD entries have empty steps, their presence does not establish that a procedure is absent in the source; the extraction currently imports index/TOC-style records rather than detailed procedure content. Do not show a definitive “HP provides no procedure” claim solely from these records.
- The available workflow lookup returned no workflow runs for the Build 290 version commit; this is not proof of failure, but it also provides no passing evidence. Do not claim automated validation or deployment success without checking the relevant Actions/Pages run and live test build.
- Required next actions: (1) reconcile every CPMD record against the PDF's detailed entry and applicable model/variant; add explicit applicability metadata rather than allowing all CPMD rows through the M527 filter; (2) preserve aliases and grouped code tokens so each exact code remains searchable, but route to the correct grouped source entry and retain the code entered by the technician; (3) extract detailed descriptions/actions only from the source body; separate no-action, informational/event-log-only, summary-only, procedure-not-extracted, and genuinely no-procedure cases; (4) add regression coverage for wrong-family exclusion, applicable M527 code inclusion, alias lookup, no-action stop state, missing-extraction state, and navigation; (5) run automated tests and verify the deployed test URL/build before asking the user to test. Production root files must remain untouched without explicit approval.
- User's active direction: retain all documented codes, simplify the technician experience, self-audit the entire troubleshooting workflow, then expand family coverage. The audit remains incomplete.


## 0R. Build 291 — CPMD lookup/applicability separation (2026-10-20)

- Updated the test site only: `main/test/index.html` commit `74543fb04b20aa6a90de1cf4eb8176c60bfdbc48`; `main/test/version.json` commit `ea16c5b288cbe5374d9a74ba69a633fe10cddab4` now reports Build 291. Cache key for `cw-cpmd-catalog.js` bumped from 290 to 291.
- Change: M527 reference search now keeps every extracted CPMD row searchable even if the row does not explicitly identify M527. Separately, the M527 diagnostic catalog no longer bypasses `cwM527DocumentMatches()` merely because `source === 'CPMD'`. A selected code that is not validated for M527 should reach the existing “Entry Not Validated for This Model” stop state, which withholds troubleshooting steps and parts.
- Existing applicability exceptions in `cwM527DocumentMatches()` for the documented shared 31-series and 44-series sections remain in place. They still require a careful source/model applicability review; do not assume this one fix validates every code or variant.
- Validation status: code edits were committed, but automated browser tests, live GitHub Pages deployment, and live Build 291 behavior have not yet been independently verified. Do not report them as passing. Next: inspect the rendered M527 search result and diagnostic-stop paths, add regression tests for generic CPMD lookup vs blocked diagnostic, applicable 31/44 entries, model-specific entries, and wrong-variant parts; then run available CI and verify deployment.
- Production root files remain untouched. Build 291 is a test-site change on `main/test/*`, not a production release and not the development build number.
