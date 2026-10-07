import { chromium, test } from "@playwright/test";
test("To launch a browser", async () => {
    const browserInstance = await chromium.launch({ headless: false, channel: "chrome" });
    const browserContext = await browserInstance.newContext();
    const page = await browserContext.newPage();
    await page.goto("http://leaftaps.com/opentaps/control/main");
    //await page.goto("https://www.google.com/?hl=en-US");
});