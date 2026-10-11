//ref code

import { test } from "@playwright/test"


import { Locator } from '@playwright/test';

async function printvalue(allOptions: Locator) {
    const count = await allOptions.count();
    console.log("Count:", count);

    for (let index = 0; index < count; index++) {
        console.log(await allOptions.nth(index).innerText());
    }
}

test.only('dropdown only test', async ({ page }) => {

    await page.goto("https://leaftaps.com/opentaps/control/main")
    await page.locator('#username').fill("democsr2");
    await page.locator('[name="PASSWORD"]').fill("crmsfa");
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
    await printvalue(page.locator('#createLeadForm_dataSourceId>option'));

    /*let AllDropdown = page.locator('#createLeadForm_dataSourceId>option')
    //let AllDropdown=["select","PW"]
    //count of dropdown values
    
    let ddcount=await AllDropdown.count()
    console.log(ddcount)//5
    
    //use for loop to iterate it
    
    for (let index = 0; index<ddcount; index++) {
    
        let values=await AllDropdown.nth(index).innerText()
        console.log(values);
        
    }*/

    await page.locator('[name="industryEnumId"]').selectOption({ label: "Distribution" })
    console.log(" Industry Dropdown list value");

    await printvalue(page.locator('[name="industryEnumId"]>option'));

    await page.locator('#createLeadForm_marketingCampaignId').selectOption({ label: "Demo Marketing Campaign" })
    console.log(" Marketing Dropdown list value");
    await printvalue(page.locator('[name="marketingCampaignId"]>option'));




})
//select dropdown using select tag

test('learn to handle select dropdowns', async ({ page }) => {

    await page.goto('https://www.leafground.com/select.xhtml')

    await page.locator('[class="ui-selectonemenu"]').selectOption({ value: "Playwright" })

    await page.waitForTimeout(5000)

    //await page.waitForLoadState("domcontentloaded")

    await page.locator('[class="ui-selectonemenu"]').selectOption({ index: 4 })


    //print all the values

    let AllDropdown = page.locator('[class="ui-selectonemenu"]>option')
    //let AllDropdown=["select","PW"]
    //count of dropdown values

    let ddcount = await AllDropdown.count()
    console.log(ddcount)//5

    //use for loop to iterate it

    for (let index = 0; index < ddcount; index++) {

        let values = await AllDropdown.nth(index).innerText()
        console.log(values);

    }

    /* Select Tool
    Selenium
    Playwright
    Puppeteer
    Cypress */

})




//custom dropdown

test('learn to handl custom dropdown', async ({ page }) => {

    await page.goto('https://www.leafground.com/select.xhtml')

    //select the dropdown

    await page.locator('text=Select Country').nth(1).click()

    //select the desired option from the dropdown

    await page.locator('[data-label="India"]').click()


})





