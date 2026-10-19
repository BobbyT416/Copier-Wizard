# Copier Wizard — Machine-Family Onboarding Contract

**Status:** Working standard for development; not yet a completed architecture migration.  
**Last updated:** 2026-10-19  
**Applies to:** Every new HP machine family, model, and product-number variant.

## Goal

Add a family by supplying validated identity and HP-source data, then run the same automated contract tests used for existing families. Avoid introducing new family-specific branches in the shared diagnostic engine unless the HP documentation genuinely requires unique behavior.

## Non-negotiable safety rules

1. A known product number must identify its exact cataloged machine without requiring Type, Family, Model, or firmware selections.
2. Identity verification and diagnostic readiness are separate states. A machine can be correctly identified while guided troubleshooting is not enabled.
3. An unsupported or incompletely documented family must not unlock diagnostic steps, part recommendations, or repair procedures.
4. No part or procedure may be shown unless its exact model/product applicability and HP source are verified.
5. CPMD is the primary source for troubleshooting and diagnostic branches. The Repair/Service Manual is the source for removal/replacement procedures.
6. Preserve HP terminology, documented decision order, informational stop messages, and the complete part description. Never invent steps or branches.
7. If sources conflict, record the conflict and withhold the uncertain recommendation until reconciled.
8. Never let a previous machine's verified state, result, parts, or report leak into a newly selected or unrecognized product number.
9. Keep changes on `development`; publish to the test site only after validation. Do not modify production app files at the repository root.

## Required data for each family

### 1. Identity registry

- Stable family ID and display label.
- Supported machine types (monochrome, color, or PageWide).
- Selectable model identifiers.
- Product-number-to-exact-model mapping, including variants.
- An explicit capability status; identity mapping alone does not mean troubleshooting is supported.

### 2. Source registry

For each CPMD, Repair/Service Manual, and other approved HP document:

- Source ID and exact document title/revision.
- Applicable family, model, and product variants.
- Which capabilities the source supports (troubleshooting, parts, or removal/replacement).
- Source-validation status and any known gaps or conflicts.

### 3. Troubleshooting records

- Error/message code and official description.
- Summary and technician-facing instructions.
- Ordered steps and explicit decision outcomes, only when documented.
- Diagnostic tests and documented navigation/instructions.
- A clear stop state for informational/no-action messages.
- Source ID and exact model/product applicability for each record.

### 4. Parts and repair procedures

- Service part number, product number when applicable, and complete HP description.
- Exact model/product applicability and source reference.
- Verified repair-procedure ID, source manual, and applicability.
- Explicit conflict/missing-procedure state; never substitute a neighboring model's procedure.

## Standard onboarding sequence

1. **Register identity only.** Add model and product mappings; test every product number with all other identification fields blank.
2. **Audit source coverage.** Confirm which manuals and CPMDs are present, applicable, and validated. Mark gaps honestly.
3. **Import a small, bounded set of documented cases.** Start with a representative error path and a documented message/stop case.
4. **Validate parts and procedures.** Match the part, description, model/product variant, and exact removal/replacement procedure.
5. **Enable the family only when ready.** The shared UI may confirm identity before this point, but must keep unsupported diagnostic controls locked.
6. **Run the family contract and regression suite.** Include adjacent variants and negative tests for unknown product numbers, wrong-model parts, missing procedures, and source conflicts.
7. **Publish to the test site.** Verify the deployed build/version and ask for hands-on testing only after CI passes.
8. **Record the result.** Update `HANDOFF.md` with commit, build, tests, deployment, known gaps, and next action.

## Required automated acceptance tests

- Every catalog product number is unique and maps to a selectable machine type, family, and model.
- Product-number-only entry reaches a visible identity-verified state.
- For enabled families, the documented diagnostic UI opens and normal troubleshooting works.
- For not-yet-enabled families, identity can be confirmed but diagnostics remain locked.
- Unknown/unmapped products clear stale identity/results and do not verify or unlock diagnosis.
- Changing machine/product identity clears stale diagnostic history and service-report context.
- Parts and procedures are filtered by exact applicability; adjacent variants cannot cross-use them.
- Informational/no-action messages stop without an invented escalation.
- Missing procedures and source conflicts do not produce unsafe recommendations.
- Build markers agree; JavaScript parses; no uncaught browser errors occur.

## Current implementation notes (2026-10-19)

- Product-number catalog and machine-family selection are currently defined in `index.html`.
- The M776 workflow includes family-specific logic in the shared app code.
- `cw-manual-data.js` contains the existing E52645-oriented manual data and normalized knowledge layer.
- The existing UI has a `supported` flag per selectable family, but family-specific behavior is not yet fully driven by a common family package.
- Build 261 introduces a separation between identity verification and guided-workflow readiness and adds a catalog-wide browser-test loop. Its latest test result must be checked before this build is published.
- The next architecture step after the contract test is stable: gradually move family-specific troubleshooting/variant data into validated family packages and adapters, beginning with a small known-good family; do not rewrite all families at once.

