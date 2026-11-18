import { expect, test } from "@playwright/test";

// Démo du cas passant, de bout en bout. Chaque itération ajoute ses étapes (test.step).
test("Démo : le cas passant", async ({ page }) => {
  await test.step("J'ouvre l'application", async () => {
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
  });

  await test.step("Je choisis mon persona", async () => {
    await page.getByTestId("choix-persona").first().click();
    await expect(page.getByTestId("changer-persona")).toBeVisible();
  });

  await test.step("J'ouvre le chatbot", async () => {
    await page.getByTestId("bulle-chatbot").click();
    await expect(page.getByText("De quoi avez-vous besoin ?")).toBeVisible();
  });

  await test.step("Je vois les questions fréquentes", async () => {
    await expect(page.getByTestId("question-frequente").first()).toBeVisible();
  });
});
