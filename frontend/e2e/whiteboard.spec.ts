import { expect, test, type Locator, type Page } from "@playwright/test";

async function circleObject(page: Page, object: Locator) {
  const box = await object.boundingBox();
  if (!box) throw new Error("Object must be visible to circle it");
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  const rx = box.width / 2 + 14;
  const ry = box.height / 2 + 14;
  await page.mouse.move(cx + rx, cy);
  await page.mouse.down();
  for (let i = 1; i <= 48; i++) {
    await page.mouse.move(
      cx + rx * Math.cos((i * Math.PI) / 24),
      cy + ry * Math.sin((i * Math.PI) / 24),
    );
  }
  await page.mouse.up();
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("/whiteboard-preview");
});

test("real pointer circle submits only in Ask mode and every sample addition needs approval", async ({
  page,
}) => {
  const board = page.getByLabel("Scrollable whiteboard");
  await page.getByRole("button", { name: "Start sample activity" }).click();
  await expect(board.getByRole("article")).toHaveCount(0);
  await page.getByRole("button", { name: "Approve addition" }).click();
  const code = board.getByRole("article", { name: "Python code 1" });
  await expect(code).toBeVisible();
  await circleObject(page, code);
  await expect(
    page.getByText("Help me understand this selection.", { exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Ask + circle" }).click();
  await circleObject(page, code);
  await expect(
    page.getByText("Help me understand this selection.", { exact: true }),
  ).toBeVisible();
  await expect(board.getByRole("article")).toHaveCount(1);
  const conversation = page.getByLabel("Tutor conversation");
  expect(await conversation.evaluate((element) => element.scrollTop > 0)).toBe(
    true,
  );
  await page.getByRole("button", { name: "Approve addition" }).click();
  await expect(board.getByRole("article")).toHaveCount(2);
  await expect(board.getByText("About your selection")).toBeVisible();
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(board.getByRole("article")).toHaveCount(1);
  await page.getByRole("button", { name: "Redo", exact: true }).click();
  await expect(board.getByRole("article")).toHaveCount(2);
});

test("edits, drags, deletes and restores actual structured objects", async ({
  page,
}) => {
  const board = page.getByLabel("Scrollable whiteboard");
  await page.getByRole("button", { name: "+ Note" }).click();
  await page
    .getByLabel("Edit selected note")
    .fill("Trace the accumulator after every iteration.");
  await page.getByRole("button", { name: "Save object" }).click();
  const handle = page.getByRole("button", { name: "Select and move note 1" });
  const rect = await handle.boundingBox();
  if (!rect) throw new Error("Missing drag handle");
  await page.mouse.move(rect.x + 50, rect.y + 15);
  await page.mouse.down();
  await page.mouse.move(rect.x + 150, rect.y + 95, { steps: 8 });
  await page.mouse.up();
  const note = board.getByRole("article", { name: "Note 1" });
  await expect(note).toHaveCSS("left", "140px");
  await expect(note).toHaveCSS("top", "128px");
  await expect(note).toContainText("Trace the accumulator");
  await page.getByRole("button", { name: "Delete selected" }).click();
  await expect(board.getByRole("article")).toHaveCount(0);
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(note).toContainText("Trace the accumulator");
});

test("rejects incomplete gestures and preserves work after a dismissed response", async ({
  page,
}) => {
  const board = page.getByLabel("Scrollable whiteboard");
  await page.getByRole("button", { name: "+ Note" }).click();
  await page.getByRole("button", { name: "Ask + circle" }).click();
  const box = await board.boundingBox();
  if (!box) throw new Error("Missing board");
  await page.mouse.move(box.x + 35, box.y + 35);
  await page.mouse.down();
  await page.mouse.move(box.x + 350, box.y + 350, { steps: 16 });
  await page.mouse.up();
  await expect(page.getByRole("status")).toContainText(
    "Finish a closed circle",
  );
  await expect(page.getByText("Sample tutor · fixture")).toHaveCount(0);
  await page.getByRole("button", { name: "Ask about selection (1)" }).click();
  await page.getByRole("button", { name: "Dismiss" }).click();
  await expect(board.getByRole("article")).toHaveCount(1);
  await expect(board).toContainText("Write your idea here…");
});

test("keyboard alternative, narrow layout and reload communicate preview limitations", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "+ Ellipse" }).click();
  const handle = page.getByRole("button", {
    name: "Select and move ellipse 1",
  });
  await handle.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("article", { name: "Ellipse 1" })).toHaveCSS(
    "left",
    "50px",
  );
  await page.getByRole("checkbox", { name: /Ellipse 1/ }).focus();
  await page.keyboard.press("Space");
  await expect(
    page.getByRole("button", { name: "Ask about selection (0)" }),
  ).toBeDisabled();
  await page.keyboard.press("Space");
  await page.getByRole("button", { name: "Ask about selection (1)" }).focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByText("Help me understand this selection.", { exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Think it through." }),
  ).toBeVisible();
  await expect(
    page.getByLabel("Scrollable whiteboard").getByRole("article"),
  ).toHaveCount(0);
  await expect(
    page.getByText(/Work lasts until you leave or reload/),
  ).toBeVisible();
});
