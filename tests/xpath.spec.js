import { test, expect } from '@playwright/test';
test.only('dropdown only test', async ({ page }) => {

    await page.goto("https://leaftaps.com/opentaps/control/main")
    await page.locator('//form[@id="login"]//p/input[@name="USERNAME"]').fill("democsr2");
   await page.locator('//form[@id="login"]//following::input[@type="password"]').fill("crmsfa");
    await page.locator('[value="Login"]').click();
    // page.locator('.decorativeSubmit').click;
    await page.waitForTimeout(2000);
    await page.waitForLoadState('domcontentloaded');
    await page.locator('text=CRM/SFA').click();

    await page.waitForTimeout(2000);

    await page.locator('text="Create Lead"').first().click();
    await page.waitForLoadState('domcontentloaded');

    await page.waitForTimeout(2000);
    await page.locator('#createLeadForm_dataSourceId').selectOption({ value: "LEAD_COLDCALL" })
    await page.waitForTimeout(5000)

})