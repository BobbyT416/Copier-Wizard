const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const root = process.cwd();
const files = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/index.html': ['index.html', 'text/html; charset=utf-8'],
  '/cw-manual-data.js': ['cw-manual-data.js', 'text/javascript; charset=utf-8'],
  '/version.json': ['version.json', 'application/json; charset=utf-8'],
  '/manifest.json': ['manifest.json', 'application/manifest+json; charset=utf-8'],
};
const server = http.createServer((req, res) => {
  const item = files[new URL(req.url, 'http://localhost').pathname];
  if (!item) { res.writeHead(404); res.end('Not found'); return; }
  res.writeHead(200, { 'Content-Type': item[1], 'Cache-Control': 'no-store' });
  res.end(fs.readFileSync(path.join(root, item[0])));
});

(async () => {
  await new Promise(resolve => server.listen(4173, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
    assert.match(await page.title(), /Copier Wizard/i);
    assert.equal(await page.locator('#machineType').count(), 1);
    assert.equal(await page.locator('#selectCard label').filter({hasText:'Printer Type'}).innerText(), 'Printer Type',
      'opening screen field labels should not repeat optional-field explanations');
    assert.equal(await page.locator('#selectCard label').filter({hasText:'Machine Family'}).innerText(), 'Machine Family',
      'machine-family label should remain concise');
    assert.equal(await page.locator('#selectCard label').filter({hasText:'Product Number'}).filter({hasText:/^Product Number$/}).innerText(), 'Product Number',
      'product-number label should remain concise');
    assert.equal(await page.locator('#productHint').innerText(), 'Optional — helps verify the exact variant.',
      'product-number helper should remain concise');
    console.log('✓ App loads in Chromium with concise opening-screen labels');
    // Each machine selection should automatically advance to the next meaningful picker.
    const pickerFlow = await page.evaluate(() => {
      const original = window.cwFocusAndOpenSelect;
      const calls = [];
      window.cwFocusAndOpenSelect = el => { calls.push(el?.id || ''); return true; };
      const type = document.getElementById('machineType');
      type.value = 'mono';
      machineTypeChanged('mono');
      const family = document.getElementById('machineFamily');
      family.value = 'm501-family';
      familySelectionChanged('m501-family');
      const model = document.getElementById('model');
      model.value = 'M527';
      modelSelectionChanged('M527');
      window.cwFocusAndOpenSelect = original;
      return { calls, firmwareVisible: !document.getElementById('firmwareSection').classList.contains('hidden') };
    });
    assert.equal(pickerFlow.calls[0], 'machineFamily',
      'choosing printer type should open the Machine Family picker');
    assert.equal(pickerFlow.calls[1], 'model',
      'choosing machine family should open the Model picker');
    if (pickerFlow.firmwareVisible) {
      assert.ok(pickerFlow.calls.includes('firmwareLevel'),
        'when multiple FutureSmart levels apply, choosing a model should open that picker');
    }
    console.log('✓ Machine selection advances automatically to the next required picker');
    // Decision answers should be derived from the observed condition, not generic true/false wording.
    const decisionLabels = await page.evaluate(() => {
      const sourceCondition = 'error 31.03.20 still returns';
      const question = documentedDecisionQuestion(sourceCondition);
      return {
        question,
        returningError: documentedDecisionAnswerLabels(question),
        seatedConnector: documentedDecisionAnswerLabels('Is the connector seated correctly?')
      };
    });
    assert.equal(decisionLabels.question, 'Does error 31.03.20 still return?', 'source condition should become a grammatical technician question');
    assert.deepEqual(decisionLabels.returningError, {
      yes: 'Yes — error 31.03.20 still returns',
      no: 'No — error 31.03.20 does not return'
    }, 'error-code decision answers should describe the observed result');
    assert.deepEqual(decisionLabels.seatedConnector, {
      yes: 'Yes — it is',
      no: 'No — it is not'
    }, 'state decision answers should be clear and concise');
    assert.doesNotMatch(await page.locator('body').innerText(), /condition is true|condition is not true/i,
      'generic true/false wording must not appear in the UI');
    console.log('✓ Documented decision answers use contextual wording instead of generic true/false labels');

    // The picker-flow unit check above intentionally changes selector state. Reload
    // before end-to-end product-number tests so a leftover M527 selection cannot
    // turn the M776 product test into a legitimate mismatch/dead-end.
    // Navigate away and back to create a truly fresh document. Chromium can
    // restore form-control values across reloads, which left the synthetic M527
    // selection from the picker unit test in place and caused a false product mismatch.
    await page.goto('about:blank');
    await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
    await page.locator('#product').waitFor({ state: 'visible' });
    assert.equal(await page.locator('#machineType').inputValue(), '',
      'end-to-end product-number test must start with blank machine selectors');

    // A known product number alone must populate the machine identity and
    // proceed to the verified/app-ready state without requiring other fields.
    await page.locator('#product').fill('T3U55A');
    await page.locator('#product').press('Tab');
    // Verification is a distinct state; enter troubleshooting through the
    // explicit Continue button instead of assuming the hidden workflow card
    // is already visible.
    await page.getByText(/Machine Verified — App Ready/i).waitFor({ state: 'visible' });
    assert.equal(await page.locator('#machineType').inputValue(), 'color', 'product number should infer Color type');
    assert.ok(await page.locator('#machineFamily').inputValue(), 'product number should infer machine family');
    assert.ok(await page.locator('#model').inputValue(), 'product number should infer machine model');
    assert.match(await page.locator('#verify').innerText(), /T3U55A|M776dn/i, 'verification should identify the product-number variant');
    const continueButton = page.getByRole('button', { name: /Continue to Troubleshooting/i });
    assert.ok(await continueButton.isVisible(), 'verified supported machine should show an explicit Continue to Troubleshooting action');
    await continueButton.click();
    await page.waitForFunction(() => {
      const el = document.getElementById('problemCard');
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    }, null, { timeout: 3000 });
    console.log('✓ Product number alone identifies the machine and provides a clear continuation into troubleshooting');

    // Family-wide contract: every cataloged product number must work through
    // the same product-number-only identification path. This automatically
    // expands coverage when a new family/product is added to the catalog.
    const catalogProducts = await page.evaluate(() =>
      Object.entries(productNumberCatalog || {}).flatMap(([familyKey, items]) =>
        (items || []).map(item => ({
          familyKey,
          product: String(item.product || '').trim().toUpperCase(),
          model: String(item.model || '').trim()
        }))
      )
    );
    assert.ok(catalogProducts.length > 0, 'Product-number catalog should not be empty');
    const seenProducts = new Set();
    for (const item of catalogProducts) {
      assert.ok(item.product, 'Every catalog entry must include a product number');
      assert.ok(!seenProducts.has(item.product), 'Duplicate product number in catalog: ' + item.product);
      seenProducts.add(item.product);
      await page.evaluate(() => returnToMachineSelection());
      await page.locator('#product').fill(item.product);
      await page.locator('#product').press('Tab');
      const productValue = (await page.locator('#product').inputValue()).trim().toUpperCase();
      const typeValue = await page.locator('#machineType').inputValue();
      const familyValue = await page.locator('#machineFamily').inputValue();
      const modelValue = await page.locator('#model').inputValue();
      const verifyText = await page.locator('#verify').innerText();
      const guidedEnabled = await page.evaluate(() => {
        const type = document.getElementById('machineType').value;
        const familyId = document.getElementById('machineFamily').value;
        const model = document.getElementById('model').value;
        const family = machineSelectionFamilies?.[type]?.[familyId];
        return !!family && family.supported === true &&
          (!Array.isArray(family.supportedModels) || family.supportedModels.includes(model));
      });
      assert.equal(productValue, item.product, item.product + ' should remain the selected product number');
      assert.ok(typeValue, item.product + ' should infer machine type');
      assert.ok(familyValue, item.product + ' should infer machine family');
      assert.ok(modelValue, item.product + ' should infer machine model');
      assert.ok(
        verifyText.toUpperCase().includes(item.product),
        item.product + ' should be identified using the product number alone; verification text was: ' + verifyText
      );
      if (guidedEnabled) {
        assert.match(verifyText, /Machine Verified — App Ready/i, item.product + ' should unlock the validated guided workflow');
        assert.equal(await page.locator('#problemCard').isVisible(), true, item.product + ' should open diagnostics for an enabled family');
      } else {
        assert.match(verifyText, /Machine Verified — Guided Troubleshooting Not Yet Enabled/i, item.product + ' should confirm identity without claiming unsupported diagnostics');
        assert.equal(await page.locator('#problemCard').isVisible(), false, item.product + ' must not unlock diagnostics for a family that is not enabled');
        const identityOnlyStatus = page.locator('.status').filter({ hasText: 'Machine Verified — Guided Troubleshooting Not Yet Enabled' });
        await identityOnlyStatus.waitFor({ state: 'visible' });
        assert.equal(await identityOnlyStatus.getByRole('button', { name: 'Browse Product Numbers' }).count(), 0, item.product + ' should not offer product browsing after machine verification');
        assert.equal(await identityOnlyStatus.getByRole('button', { name: 'Change Machine' }).count(), 1, item.product + ' should retain a clear exit from the verified-but-unsupported state');
      }
    }
    console.log('✓ Family-wide contract: product-number-only verification passed for ' + catalogProducts.length + ' catalog entries');

    // The normalized manual package is E52645-specific. E52645 remains enabled,
    // while an adjacent model in the shared selection family must stay gated
    // until its exact workflow has been validated.
    await page.evaluate(() => returnToMachineSelection());
    await page.locator('#product').fill('1PS54A');
    await page.locator('#product').press('Tab');
    await page.locator('#problemCard').waitFor({ state: 'visible' });
    assert.match(await page.locator('#verify').innerText(), /Machine Verified — App Ready/i, 'E52645 should remain enabled for its validated manual data');
    await page.evaluate(() => returnToMachineSelection());
    await page.locator('#product').fill('F2A81A');
    await page.locator('#product').press('Tab');
    assert.match(await page.locator('#verify').innerText(), /Machine Verified — App Ready/i, 'M527c should reach the same verified entry screen shown on the main site');
    await page.locator('#problemCard').waitFor({ state: 'visible' });
    assert.match(await page.locator('#problemCard').innerText(), /What.s wrong\\?/i, 'M527 should show the normal troubleshooting choices');
    assert.ok(await page.locator('#problemCard .lookup-choice').filter({ hasText: 'Numerical Error Code' }).isVisible(), 'M527 should offer numerical error-code troubleshooting');
    assert.ok(await page.locator('#problemCard .lookup-choice').filter({ hasText: 'Alphabetical Message' }).isVisible(), 'M527 should offer alphabetical-message troubleshooting');
    assert.ok(await page.locator('#problemCard .lookup-choice').filter({ hasText: 'Parts Lookup' }).isVisible(), 'M527 should offer documented parts lookup');
    assert.ok(await page.locator('#problemCard').getByRole('button', { name: /I don.t have an error code or message/i }).isVisible(), 'M527 should offer symptom-based entry');
    console.log('✓ M527 verified-machine screen matches the main-site troubleshooting entry layout');
    await page.locator('#problemCard .lookup-choice').filter({ hasText: 'Numerical Error Code' }).click();
    await page.locator('#errorLookupPanel').waitFor({ state: 'visible' });
    await page.locator('#errorCodeLookup').fill('30.01.44');
    await page.locator('#errorCodeLookup').press('Enter');
    await page.locator('#errorCodeResults').getByText(/30\.01\.44/).first().waitFor({ state: 'visible' });
    assert.match(await page.locator('#errorCodeResults').innerText(), /Scanner error/i, 'M527 numerical lookup should find the documented scanner error');
    // Regression: the numerical browser must return documented 31-series
    // records for M527 when searching the family prefix, not an empty list.
    await page.locator('#errorCodeLookup').fill('31');
    await page.locator('#errorCodeLookup').press('Enter');
    await page.locator('#errorCodeResults .lookup-result').first().waitFor({ state: 'visible' });
    const m52731Results = await page.locator('#errorCodeResults .lookup-result').allInnerTexts();
    assert.ok(m52731Results.length >= 10,
      'M527 prefix search must show the complete matching 31-series list, not truncate it');
    assert.ok(m52731Results.some(text => /31\.01\.47/.test(text)),
      'M527 prefix search must include 31.01.47');
    assert.ok(m52731Results.some(text => /31\.03\.30/.test(text)),
      'M527 prefix search must include 31.03.30');
    // Regression: a general M527 error must not be hidden just because its
    // source's parts list names a different M527 variant's feeder kit.
    await page.locator('#errorCodeLookup').fill('31.03.30');
    await page.locator('#errorCodeLookup').press('Enter');
    await page.locator('#errorCodeResults').getByText(/31\.03\.30/).first().waitFor({ state: 'visible' });
    assert.match(await page.locator('#errorCodeResults').innerText(), /Document feeder pick motor error/i,
      'M527 numerical lookup must retain the documented 31-series error across variants');
    await page.locator('#errorCodeLookup').fill('30.01.44');
    await page.locator('#errorCodeLookup').press('Enter');
    await page.locator('#errorCodeResults').getByText(/30\.01\.44/).first().waitFor({ state: 'visible' });
    await page.locator('#errorCodeResults .lookup-result').first().click();
    await page.locator('#resultCard').waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'Change Machine' }).click();
    assert.equal(await page.locator('#problemCard').isVisible(), false, 'Change Machine should leave diagnostics locked');
    assert.equal(await page.locator('#product').inputValue(), '', 'Change Machine should clear the previous product number');
    assert.equal(await page.locator('#machineType').inputValue(), '', 'Change Machine should clear the previous machine type');
    await page.locator('.product-browser-toggle').click();
    await page.locator('#productCatalogSearch').fill('M776zs');
    const zsChoice = page.locator('#productCatalogResults button').filter({ hasText: 'T3U56A' });
    await zsChoice.waitFor({ state: 'visible' });
    await zsChoice.click();
    await page.locator('#problemCard').waitFor({ state: 'visible' });
    assert.match(await page.locator('#verify').innerText(), /T3U56A|M776zs/i, 'browser selection should verify the selected product number');
    assert.equal(await page.locator('#productBrowser').isVisible(), false, 'selecting a product should close the browser');
    console.log('✓ Unsupported-machine navigation and searchable product-number browser');

    // Model-specific product choices must not leak entries from other families.
    await page.locator('#product').fill('');
    await page.locator('#machineType').selectOption('mono');
    await page.locator('#machineFamily').selectOption('m501-family');
    await page.locator('#model').selectOption('M527');
    const fwOptionsForM527 = await page.locator('#firmwareLevel option').evaluateAll(options => options.map(o => o.value).filter(Boolean));
    if (fwOptionsForM527.length) await page.locator('#firmwareLevel').selectOption(fwOptionsForM527[0]);

    const m527Options = await page.locator('#productNumberOptions option').evaluateAll(options => options.map(o => o.value));
    assert.deepEqual(m527Options.sort(), ['F2A76A','F2A77A','F2A78A','F2A79A','F2A80A','F2A81A'].sort(), 'M527 datalist must contain only M527 product numbers');
    await page.locator('.product-browser-toggle').click();
    const m527BrowserItems = await page.locator('#productCatalogResults button').evaluateAll(buttons => buttons.map(b => ({text:b.innerText,product:b.querySelector('strong')?.textContent})));
    assert.equal(m527BrowserItems.length, 6, 'M527 browser should show only its six cataloged product numbers');
    assert.ok(m527BrowserItems.every(item => /^M527/.test(item.text)), 'M527 browser must not show E50xxx or other-model entries');
    await page.locator('#productCatalogSearch').fill('E50045');
    assert.equal(await page.locator('#productCatalogResults button').count(), 0, 'search for another model must not escape the selected M527 scope');
    assert.match(await page.locator('#productCatalogResults').innerText(), /No matching product numbers for M527/i);
    await page.locator('#productCatalogSearch').fill('');
    await page.locator('.product-browser-toggle').click();

    await page.getByRole('button', { name: 'Verify Machine' }).click();
    assert.match(await page.locator('#verify').innerText(), /Machine Verified — App Ready/i,
      'model-only M527 verification should reach the current verified-machine screen');
    await page.getByRole('button', { name: /Continue to Troubleshooting/i }).click();
    await page.locator('#problemCard').waitFor({ state: 'visible' });
    assert.match(await page.locator('#problemCard').innerText(), /What.s wrong\?/i,
      'model-only M527 verification should continue to the normal troubleshooting choices');
    assert.ok(await page.locator('#problemCard .lookup-choice').filter({ hasText: 'Numerical Error Code' }).isVisible(),
      'M527 should offer numerical error-code lookup after continuing');
    assert.equal(await page.locator('#verify #m527ManualLookup').count(), 0,
      'supported M527 should use the normal troubleshooting flow, not the unsupported-model manual-search fallback');
    await page.evaluate(() => returnToMachineSelection());
    console.log('✓ Model-only M527 verification, scoped product choices, and continuation flow');
    
    // Clearing the product number or changing manual machine selectors must
    // invalidate any previously verified machine and hide its diagnostic path.
    await page.locator('#product').fill('T3U55A');
    await page.locator('#product').press('Tab');
    await page.locator('#problemCard').waitFor({ state: 'visible' });
    await page.locator('#product').fill('');
    await page.locator('#product').press('Tab');
    assert.equal(await page.locator('#problemCard').isVisible(), false, 'clearing product number must hide the prior diagnostic path');
    assert.match(await page.locator('#verify').innerText(), /Machine Not Verified/i, 'clearing product number must clear prior verification status');
    await page.locator('#product').fill('T3U55A');
    await page.locator('#product').press('Tab');
    await page.locator('#problemCard').waitFor({ state: 'visible' });
    await page.locator('#machineType').selectOption('mono');
    assert.equal(await page.locator('#problemCard').isVisible(), false, 'changing machine type must hide diagnostics for the prior machine');
    assert.match(await page.locator('#verify').innerText(), /Machine Not Verified/i, 'changing machine type must clear prior verification status');
    console.log('✓ Changing or clearing machine identity invalidates prior verification and diagnostics');

    // Switching from a verified machine to an unknown product must clear all
    // previous verification/diagnostic state rather than leave stale guidance visible.
    await page.evaluate(() => returnToMachineSelection());
    await page.locator('#product').fill('');
    await page.locator('#product').press('Tab');
    await page.locator('#product').fill('T3U55A');
    await page.locator('#product').press('Tab');
    await page.locator('#problemCard').waitFor({ state: 'visible' });
    await page.locator('#product').fill('ZZZZZ');
    await page.locator('#product').press('Tab');
    assert.equal(await page.locator('#problemCard').isVisible(), false, 'unknown product number must not unlock diagnosis');
    assert.match(await page.locator('#productHint').innerText(), /not in the catalog/i, 'unknown product number should explain why it was not verified');
    assert.match(await page.locator('#verify').innerText(), /Machine Not Verified/i, 'unknown product must clear the prior machine-verified status');
    console.log('✓ Unknown product number is not falsely verified and manual identification remains available');

    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('#machineType').selectOption('color');
    const family = page.locator('#machineFamily');
    await family.waitFor({ state: 'visible' });
    const familyOptions = await family.locator('option').allTextContents();
    const m776Family = familyOptions.find(x => /M776/i.test(x));
    assert.ok(m776Family, 'M776 family should be available after selecting Color');
    const familyValue = await family.locator('option').filter({ hasText: /M776/i }).first().getAttribute('value');
    await family.selectOption(familyValue);
    const model = page.locator('#model');
    await model.waitFor({ state: 'visible' });
    const modelValue = await model.locator('option').filter({ hasText: /M776/i }).first().getAttribute('value');
    assert.ok(modelValue, 'M776 model entry should be available in the M776 family');
    await model.selectOption(modelValue);
    const product = page.locator('#product');
    // Product number is a text input with datalist suggestions and a searchable browser, not a select.
    // Enter the known number and let the app's product-number workflow verify it.
    await product.fill('T3U55A');
    await product.press('Tab');
    await page.locator('#problemCard').waitFor({ state: 'visible' });
    assert.ok(/T3U55A|M776dn/i.test(await page.locator('#verify').innerText()), 'Verification should acknowledge the selected machine');
    console.log('✓ M776dn/T3U55A can be selected and verified');

    await page.locator('#lookupChoiceGrid button.lookup-choice').first().click();
    await page.locator('#errorCodeLookup').fill('59.00.03');
    await page.getByRole('button', { name: /Enter Error Code/i }).click();
    await page.locator('#result h2').filter({ hasText: 'Documented Error — 59.00.03' }).waitFor({ state: 'visible' });
    const diagnosisText = await page.locator('#result').innerText();
    assert.ok(diagnosisText.includes('Documented Error'), 'The entered error code should open the documented troubleshooting path');
    const variantParts = await page.evaluate(() => cwM776PartsForError({ code: '59.00.03' }));
    assert.ok(variantParts.some(part => part.includes('RM2-3910-000CN')), 'M776dn branch should resolve the documented delivery assembly');
    assert.ok(variantParts.some(part => part.includes('RM2-9921-000CN')), 'M776dn branch should resolve the applicable duplex controller');
    await page.getByRole('button', { name: /View Removal \/ Replacement Procedure/i }).click();
    await page.getByText(/RM2-3910-000CN/).waitFor({ state: 'visible' });
    await page.getByRole('button', { name: /Back to Diagnosis/i }).click();
    await page.locator('#result h2').filter({ hasText: 'Documented Error — 59.00.03' }).waitFor({ state: 'visible' });
    console.log('✓ Real UI flow: M776dn error 59.00.03 shows correct parts, opens the matching procedure, and returns');

    await page.evaluate(() => {
      document.getElementById('result').innerHTML = '<h2>DIAGNOSTIC NAVIGATION TEST SENTINEL</h2>';
      window.showRepair('dccontroller');
    });
    assert.ok(await page.getByRole('button', { name: /Back to Diagnosis/i }).count(), 'Repair screen should include Back to Diagnosis');
    await page.getByRole('button', { name: /Back to Diagnosis/i }).click();
    await page.getByText('DIAGNOSTIC NAVIGATION TEST SENTINEL').waitFor({ state: 'visible' });
    console.log('✓ Back to Diagnosis restores the previous screen from a repair procedure');

    for (const [key, expectedPart, forbiddenPart] of [
      ['delivery-m776', 'RM2-3910-000CN', 'RM2-1786-000CN'],
      ['delivery-m776zs', 'RM2-1786-000CN', 'RM2-3910-000CN']
    ]) {
      await page.evaluate((repairKey) => {
        document.getElementById('result').innerHTML = '<h2>VARIANT PROCEDURE TEST SENTINEL</h2>';
        window.showRepair(repairKey);
      }, key);
      const repairText = await page.locator('#result').innerText();
      assert.ok(repairText.includes(expectedPart), key + ' should show its exact delivery assembly part');
      assert.ok(!repairText.includes(forbiddenPart), key + ' must not show the other variant’s delivery assembly part');
      await page.getByRole('button', { name: /Back to Diagnosis/i }).click();
      await page.getByText('VARIANT PROCEDURE TEST SENTINEL').waitFor({ state: 'visible' });
    }
    console.log('✓ M776dn/z and M776zs open different verified delivery procedures and both return to diagnosis');

    // Service reports must open from a repair/part screen before the technician
    // marks the job resolved, and retain the recommended part in the report.
    await page.evaluate(() => {
      document.getElementById('result').innerHTML = '<h2>PART RECOMMENDATION TEST</h2><div class="part">RM3-7475-010CN</div><p>DC controller PCA</p>';
      window.showRepair('dccontroller');
    });
    await page.getByRole('button', { name: /Generate Service Report/i }).click();
    await page.locator('#serviceReportCard').waitFor({ state: 'visible' });
    assert.match(await page.locator('#serviceReportCard').innerText(), /RM3-7475-010CN/, 'service report should include the recommended part before resolution');
    await page.getByRole('button', { name: /Back to Diagnosis/i }).last().click();
    await page.locator('#serviceReportCard').waitFor({ state: 'hidden' });
    console.log('✓ Service report opens before resolution and includes the recommended part');

    await page.evaluate(() => window.showDiagnosticNavigation('M13'));
    const diagnosticHelp = page.locator('.diagnostic-nav-modal');
    await diagnosticHelp.waitFor({ state: 'visible' });
    const helpText = await diagnosticHelp.innerText();
    assert.match(helpText, /M776zs/i, 'M13 guidance should identify the applicable variant');
    assert.ok(helpText.includes('59.00.03'), 'M13 guidance should identify its CPMD branch');
    assert.match(helpText, /Support Tools.*Diagnostic Tests/s, 'Diagnostic guidance should include the FutureSmart 4+ menu path');
    await diagnosticHelp.getByRole('button', { name: /Close/i }).last().click();
    console.log('✓ M13 diagnostic navigation identifies the M776zs branch and menu path');

    // Full end-to-end M776zs variant path: product verification must drive parts and repair procedure selection.
    // Product-number-first requirement applies to every supported variant:
    // enter T3U56A with all other identification fields blank and let the app
    // identify and verify M776zs automatically.
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('#product').fill('T3U56A');
    await page.locator('#product').press('Tab');
    await page.locator('#problemCard').waitFor({ state: 'visible' });
    assert.equal(await page.locator('#machineType').inputValue(), 'color', 'T3U56A should infer Color type');
    assert.ok(await page.locator('#machineFamily').inputValue(), 'T3U56A should infer machine family');
    assert.ok(await page.locator('#model').inputValue(), 'T3U56A should infer machine model');
    assert.match(await page.locator('#verify').innerText(), /T3U56A|M776zs/i, 'Verification should acknowledge M776zs');
    await page.locator('#lookupChoiceGrid button.lookup-choice').first().click();
    await page.locator('#errorCodeLookup').fill('59.00.03');
    await page.getByRole('button', { name: /Enter Error Code/i }).click();
    await page.locator('#result h2').filter({ hasText: 'Documented Error — 59.00.03' }).waitFor({ state: 'visible' });
    const zsParts = await page.evaluate(() => cwM776PartsForError({ code: '59.00.03' }));
    assert.ok(zsParts.some(part => part.includes('RM2-1786-000CN')), 'M776zs must resolve delivery assembly RM2-1786-000CN');
    assert.ok(zsParts.some(part => part.includes('RM3-7380-000CN')), 'M776zs must resolve duplex controller RM3-7380-000CN');
    assert.ok(!zsParts.some(part => part.includes('RM2-3910-000CN')), 'M776zs must not resolve M776dn/z delivery assembly');
    assert.ok(!zsParts.some(part => part.includes('RM2-9921-000CN')), 'M776zs must not resolve M776dn/z duplex controller');
    // Advance through the guided steps. Some documented steps are decision
    // points, so choose "No" to move to the next documented branch; ordinary
    // steps use the explicit completion button. Stop when the M13 step appears.
    for (let step = 0; step < 10; step++) {
      const resultText = await page.locator('#result').innerText();
      if (/M13/.test(resultText)) break;
      const complete = page.getByRole('button', { name: /Step Completed — Continue/i });
      const noCondition = page.getByRole('button', { name: /No —/i });
      if (await complete.count()) {
        await complete.click();
      } else if (await noCondition.count()) {
        await noCondition.click();
      } else {
        throw new Error('M776zs guided flow did not expose a documented next-step control. Current screen: ' + resultText.slice(0, 500));
      }
    }
    assert.match(await page.locator('#result').innerText(), /M13/, 'M776zs guided path should reach the documented M13 diagnostic test');
    await page.getByRole('button', { name: /View Removal \/ Replacement Procedure/i }).click();
    const zsRepairText = await page.locator('#result').innerText();
    assert.ok(zsRepairText.includes('RM2-1786-000CN'), 'M776zs should open its own verified delivery procedure');
    assert.ok(!zsRepairText.includes('RM2-3910-000CN'), 'M776zs repair screen must not show M776dn/z procedure');
    await page.getByRole('button', { name: /Back to Diagnosis/i }).click();
    await page.locator('#result h2').filter({ hasText: 'Documented Error — 59.00.03' }).waitFor({ state: 'visible' });
    console.log('✓ Full UI flow: M776zs/T3U56A selects 59.00.03, correct parts, M13, correct repair procedure, and returns');

    // Explicit source-reviewed applicability metadata must make generic
    // M527-family supply codes available even when the description omits "M527".
    await page.evaluate(() => {
      currentMachineModel = 'M527';
      verifiedModel = 'M527';
      beginErrorCodeDiagnosis('10.00.60');
    });
    await page.locator('#documentedStepList').waitFor({ state: 'visible' });
    assert.match(await page.locator('#documentedStepList').innerText(), /Is print quality no longer acceptable\?/i,
      'M527 should expose the CPMD decision point for the source-verified supply code');
    assert.ok(await page.locator('#documentedStepList').getByRole('button', { name: /Yes — it is/i }).isVisible(),
      'the supply-code decision should have a clear affirmative action');
    console.log('✓ Source-reviewed M527 applicability exposes generic supply-code troubleshooting');

    await page.evaluate(() => beginErrorCodeDiagnosis('32.1C.07'));
    await page.locator('#documentedStepList').waitFor({ state: 'visible' });
    assert.match(await page.locator('#documentedStepList').innerText(), /Retry the job/i,
      '32.1C.07 must show its source-documented backup/restore action');

    await page.evaluate(() => {
      const input = document.getElementById('errorCodeLookup');
      input.value = '32.1C.14';
      searchErrorCodes(input.value);
      const index = (window._errorLookupMatches || []).findIndex(item =>
        extractErrorCodeAliases(item.code).includes('32.1C.14'));
      if (index < 0) throw new Error('32.1C.14 not found in grouped error-code search');
      selectErrorLookup(index);
    });
    await page.locator('#result h2').filter({ hasText: 'Documented Error — 32.1C.14' }).waitFor({ state: 'visible' });
    assert.match(await page.locator('#documentedStepList').innerText(), /Free up disk space/i,
      '32.1C.14 must use the documented grouped backup-space recommendation');

    await page.evaluate(() => beginErrorCodeDiagnosis('32.08.A2'));
    await page.locator('#result').getByText(/No technician action required/i).waitFor({ state: 'visible' });
    assert.match(await page.locator('#result').innerText(), /No action necessary/i,
      '32.08.A2 must remain available as a no-action event code');
    console.log('✓ Backup/restore event codes, grouped aliases, and no-action event handling');

    // No-procedure codes remain usable: show a concise terminal state and a clear way back,
    // rather than leaving the technician with a hidden outcome/parts panel.
    await page.evaluate(() => {
      currentMachineModel = 'E52645';
      verifiedModel = 'E52645';
      beginErrorCodeDiagnosis('13.00.EE');
    });
    await page.locator('#result').getByText(/No step-by-step procedure available/i).waitFor({ state: 'visible' });
    assert.ok(await page.locator('#result').getByRole('button', { name: /Back to Error Code/i }).isVisible(),
      'codes without extracted procedures must retain a clear return path');
    assert.equal(await page.locator('#documentedOutcome').count(), 0,
      'no-procedure results must not expose a hidden procedure-completion outcome');
    console.log('✓ Codes without procedures remain searchable and show a clear no-procedure result');

    // CPMD review recovered documented actions that were missing from the
    // extracted data. Ensure the app shows them rather than the no-procedure fallback.
    await page.evaluate(() => beginErrorCodeDiagnosis('10.00.60'));
    await page.locator('#documentedStepList').waitFor({ state: 'visible' });
    assert.match(await page.locator('#documentedStepList').innerText(), /Is print quality no longer acceptable\?/i,
      '10.00.60 must show the documented print-quality-dependent decision point');

    // Grouped CPMD codes must be searchable by each exact alias and preserve the
    // entered alias when selected, not silently substitute the first code.
    await page.evaluate(() => {
      const input = document.getElementById('errorCodeLookup');
      input.value = '10.00.12';
      searchErrorCodes(input.value);
      const index = (window._errorLookupMatches || []).findIndex(item =>
        extractErrorCodeAliases(item.code).includes('10.00.12'));
      if (index < 0) throw new Error('10.00.12 not found in grouped error-code search');
      selectErrorLookup(index);
    });
    await page.locator('#result h2').filter({ hasText: 'Documented Error — 10.00.12' }).waitFor({ state: 'visible' });
    assert.match(await page.locator('#documentedStepList').innerText(), /FutureSmart firmware version 4\.10/i,
      '10.00.12 must use the grouped CPMD supply-memory procedure');
    await page.evaluate(() => {
      const input = document.getElementById('errorCodeLookup');
      input.value = '10.00.01';
      searchErrorCodes(input.value);
      const index = (window._errorLookupMatches || []).findIndex(item =>
        extractErrorCodeAliases(item.code).includes('10.00.01'));
      if (index < 0) throw new Error('10.00.01 not found in grouped error-code search');
      selectErrorLookup(index);
    });
    await page.locator('#result h2').filter({ hasText: 'Documented Error — 10.00.01' }).waitFor({ state: 'visible' });
    console.log('✓ Recovered supply recommendations and exact grouped-code aliases');

    // If the source explicitly says "No action necessary", display that as
    // an informational outcome rather than calling it a missing procedure.
    await page.evaluate(() => beginErrorCodeDiagnosis('32.1C.40'));
    await page.locator('#result').getByText(/No technician action required/i).waitFor({ state: 'visible' });
    assert.match(await page.locator('#result').innerText(), /explicitly states that no action is necessary/i,
      'explicit HP no-action recommendations must be preserved');
    assert.equal(await page.locator('#documentedStepList').count(), 0,
      'informational no-action codes must not enter a repair-step flow');
    console.log('✓ Explicit HP no-action recommendations are preserved as informational outcomes');

    assert.deepEqual(pageErrors, [], 'Browser should not emit uncaught JavaScript errors');
    console.log('✓ No uncaught browser JavaScript errors');
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
