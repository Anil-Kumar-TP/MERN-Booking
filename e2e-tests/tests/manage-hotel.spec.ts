import { test, expect } from '@playwright/test';
import path from 'path'

const UI_URL = 'http://localhost:5173/'

test.beforeEach(async ({ page }) => {
   
    await page.goto(UI_URL);

    //get the signIn button
    await page.getByRole("link", { name: "Sign In" }).click();

    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

    await page.locator("[name=email]").fill("ponnu@gmail.com");
    await page.locator("[name=password]").fill("123456");

    await page.getByRole("button", { name: 'Login' }).click();

    await expect(page.getByText("Sign in Successful")).toBeVisible();
});

test("should allow user to add a hotel", async ({ page }) => {
    await page.goto(`${UI_URL}add-hotel`)

    await page.locator('[name="name"]').fill("Test Hotel");
    await page.locator('[name="city"]').fill("Test City");
    await page.locator('[name="country"]').fill("Test Country");
    await page.locator('[name="description"]').fill("Test Description for hotel");
    await page.locator('[name="pricePerNight"]').fill("100");
    await page.selectOption('select[name="starRating"]', "3");
    await page.getByText("Budget").click();
    await page.getByLabel("Free Wifi").check();
    await page.getByLabel("Parking").check();
    await page.locator('[name="adultCount"]').fill("2");
    await page.locator('[name="childCount"]').fill("1");
    await page.setInputFiles('[name="imageFiles"]', [
        path.join(__dirname, "files", "Car11.png"),
    ]);

    await page.getByRole('button', { name: 'Save' }).click();

     
    await expect(page.getByText("Hotel Saved")).toBeVisible();
});


test("should display hotels", async ({ page }) => {
    await page.goto(`${UI_URL}my-hotels`);

    // Use getByRole for the heading 'The Savoy'
    await expect(page.getByRole('heading', { name: 'The Savoy' })).toBeVisible();

    // Use more specific locators within the context of the hotel container
    const hotelContainer = page.locator('div').filter({ hasText: 'The Savoy' }).first();
    
    // Check visibility within hotelContainer for more specificity
    await expect(hotelContainer.getByText("Known for its opulent Art Deco and Edwardian")).toBeVisible();
    await expect(hotelContainer.getByText("London, UK")).toBeVisible();
    
    // Use the exact option to match "Luxury" specifically
    await expect(hotelContainer.getByText("Luxury", { exact: true })).toBeVisible();
    
    await expect(hotelContainer.getByText("$800 per night")).toBeVisible();
    await expect(hotelContainer.getByText("4 adults, 2 children")).toBeVisible();
    await expect(hotelContainer.getByText("4 Star Rating")).toBeVisible();

    // Use getByRole for links
    await expect(page.getByRole("link", { name: 'View Details' })).toBeVisible();
    await expect(page.getByRole("link", { name: 'Add Hotel' })).toBeVisible();
});


test("should edit hotel", async ({ page }) => {
    await page.goto(`${UI_URL}my-hotels`);

    // Click the 'View Details' link
    await page.getByRole("link", { name: 'View Details' }).click();

    // Wait until the input field with name="name" is visible and interactable
    const nameField = page.locator('[name="name"]');
    await nameField.waitFor({ state: 'visible' });

    // Check if the initial value is correct
    await expect(nameField).toHaveValue("The Savoy");

    // Fill the input with the new value
    await nameField.fill("The Savoy Updated");

    // Save the changes
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Hotel Saved")).toBeVisible();

    // Reload the page to verify the update
    await page.reload();
    await expect(nameField).toHaveValue("The Savoy Updated");

    // Reset the value back to "The Savoy"
    await nameField.fill("The Savoy");
    await page.getByRole("button", { name: "Save" }).click();
});
