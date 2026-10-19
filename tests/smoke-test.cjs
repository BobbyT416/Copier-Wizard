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
    console.log('✓ App loads in Chromium');

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
    const productOption = product.locator('option').filter({ hasText: /T3U55A/ }).first();
    assert.ok(await productOption.count(), 'M776dn product number T3U55A should be offered');
    await product.selectOption(await productOption.getAttribute('value'));
    await page.getByRole('button', { name: /Verify Machine/i }).click();
    await page.locator('#problemCard').waitFor({ state: 'visible' });
    assert.ok(/T3U55A|M776dn/i.test(await page.locator('#verify').innerText()), 'Verification should acknowledge the selected machine');
    console.log('✓ M776dn/T3U55A can be selected and verified');

    await page.locator('#lookupChoiceGrid button.lookup-choice').first().click();
    await page.locator('#errorCodeLookup').fill('59.00.03');
    await page.getByRole('button', { name: /Enter Error Code/i }).click();
    await page.locator('#result h2').filter({ hasText: 'Documented Error — 59.00.03' }).waitFor({ state: 'visible' });
    const diagnosisText = await page.locator('#result').innerText();
    assert.ok(diagnosisText.includes('Paper delivery assembly — RM2-3910-000CN'), 'M776dn branch should identify the documented delivery assembly');
    assert.ok(diagnosisText.includes('RM2-9921-000CN'), 'M776dn branch should identify the applicable duplex controller');
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

    await page.evaluate(() => window.showDiagnosticNavigation('M13'));
    const diagnosticHelp = page.locator('.diagnostic-nav-modal');
    await diagnosticHelp.waitFor({ state: 'visible' });
    const helpText = await diagnosticHelp.innerText();
    assert.match(helpText, /M776zs/i, 'M13 guidance should identify the applicable variant');
    assert.ok(helpText.includes('59.00.03'), 'M13 guidance should identify its CPMD branch');
    assert.match(helpText, /Support Tools.*Diagnostic Tests/s, 'Diagnostic guidance should include the FutureSmart 4+ menu path');
    await diagnosticHelp.getByRole('button', { name: /Close/i }).last().click();
    console.log('✓ M13 diagnostic navigation identifies the M776zs branch and menu path');

    assert.deepEqual(pageErrors, [], 'Browser should not emit uncaught JavaScript errors');
    console.log('✓ No uncaught browser JavaScript errors');
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
