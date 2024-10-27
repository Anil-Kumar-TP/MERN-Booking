import { test, expect } from '@playwright/test';

const UI_URL = 'http://localhost:5173/';

test.beforeEach(async ({ page }) => {
    await page.goto(UI_URL);

    // Get the Sign In button
    await page.getByRole("link", { name: "Sign In" }).click();

    // Check if the Sign In heading is visible
    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

    // Fill in the email and password fields
    await page.locator("[name=email]").fill("ponnu@gmail.com");
    await page.locator("[name=password]").fill("123456");

    // Click the Login button
    await page.getByRole("button", { name: "Login" }).click();

    // Check if the sign-in success message is visible
    await expect(page.getByText("Sign in Successful")).toBeVisible();
});

test("Should show hotel search results", async ({ page }) => {
    await page.goto(UI_URL);

    // Search for hotels in the UK
    await page.getByPlaceholder("Where are you going?").fill("UK");
    await page.getByRole("button", { name: "Search" }).click();

    // Check if the search results are visible
    await expect(page.getByText("Hotels found in UK")).toBeVisible();

    // Use a more specific selector to check for "The Savoy" link
    await expect(page.getByRole("link", { name: "The Savoy" })).toBeVisible();
});

test("should show hotel details", async ({ page }) => {
    await page.goto(UI_URL);

    await page.getByPlaceholder("Where are you going?").fill("UK");
    await page.getByRole("button", { name: "Search" }).click();

    // Use getByRole to ensure only the link element is selected
    await page.getByRole("link", { name: "The Savoy" }).click();

    await expect(page).toHaveURL(/detail/);
    await expect(page.getByRole("button", { name: "Book Now" })).toBeVisible();
});

test("should book hotel", async ({ page }) => {
    await page.goto(UI_URL);

    await page.getByPlaceholder("Where are you going?").fill("UK");

    const date = new Date();
    date.setDate(date.getDate() + 3);
    const formattedDate = date.toISOString().split("T")[0];

    await page.getByPlaceholder("Check-out Date").fill(formattedDate);


    await page.getByRole("button", { name: "Search" }).click();

    // Use getByRole to ensure only the link element is selected
    await page.getByRole("link", { name: "The Savoy" }).click();

    await page.getByRole("button", { name: "Book Now" }).click();

    await expect(page.getByText("Total Cost: $2400.00")).toBeVisible();

    const stripeFrame = page.frameLocator("iframe").first();

    await stripeFrame.locator('[placeholder="Card number"]').fill("4242424242424242");

    await stripeFrame.locator('[placeholder="MM / YY"]').fill("04/30")
    await stripeFrame.locator('[placeholder="CVC"]').fill("242")
    await stripeFrame.locator('[placeholder="ZIP"]').fill("24289")

    await page.getByRole("button", { name: 'Confirm Booking' }).click();

    await expect(page.getByText("Booking Saved")).toBeVisible({ timeout: 20000 });
});