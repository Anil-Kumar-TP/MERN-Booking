import { test, expect } from '@playwright/test';

const UI_URL = 'http://localhost:5173/'

test('should allow the user to sign in', async ({ page }) => {
  await page.goto(UI_URL);

  //get the signIn button
  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("ponnu@gmail.com");
  await page.locator("[name=password]").fill("123456");

  await page.getByRole("button", { name: 'Login' }).click();

  await expect(page.getByText("Sign in Successful")).toBeVisible();

  await expect(page.getByRole("link", { name: 'My Bookings' })).toBeVisible();

  await expect(page.getByRole("link", { name: 'My Hotels' })).toBeVisible();

  await expect(page.getByRole("button", { name: 'Sign Out' })).toBeVisible();

});

test('should allow the user to register', async ({ page }) => {

  const testEmail = `test_register_${Math.floor(Math.random() * 90000) + 1000}@test.com`
  
  await page.goto(UI_URL);

  await page.getByRole("link", { name: "Sign In" }).click();
  await page.getByRole("link", { name: "Create an account here" }).click();

  await expect(page.getByRole('heading', { name: 'Create an Account' })).toBeVisible();

  await page.locator("[name=firstName]").fill("anyone");
  await page.locator("[name=lastName]").fill("anyone");
  await page.locator("[name=email]").fill(testEmail);
  await page.locator("[name=password]").fill("123456");
  await page.locator("[name=confirmPassword]").fill("123456");

  await page.getByRole("button", { name: 'Create Account' }).click();

  await expect(page.getByText("Registration Successful")).toBeVisible();

  await expect(page.getByRole("link", { name: 'My Bookings' })).toBeVisible();

  await expect(page.getByRole("link", { name: 'My Hotels' })).toBeVisible();

  await expect(page.getByRole("button", { name: 'Sign Out' })).toBeVisible();

})