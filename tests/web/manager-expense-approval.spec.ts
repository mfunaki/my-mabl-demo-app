import { test, expect } from '@playwright/test';

test.describe('Manager Expense Approval Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Reset API before each test
    await fetch('http://localhost:4000/api/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {
      console.log('API reset failed - API may not be running');
    });

    // Create a test expense by employee
    await fetch('http://localhost:4000/api/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'employee',
      },
      body: JSON.stringify({
        title: 'Conference',
        amount: 5000,
        description: 'Annual tech conference',
      }),
    }).catch(() => {
      console.log('Failed to create test expense');
    });
  });

  test('Step 1: Access login page', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Verify page title
    const pageTitle = await page.title();
    expect(pageTitle).toBeTruthy();

    // Verify login form is displayed by checking for login title
    const loginTitle = page.locator('[data-testid="login-title"]');
    await expect(loginTitle).toBeVisible();

    // Verify input fields exist
    const usernameInput = page.locator('[data-testid="username-input"]');
    const passwordInput = page.locator('[data-testid="password-input"]');
    const loginButton = page.locator('[data-testid="login-button"]');

    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();
  });

  test('Step 2: Manager authentication and login', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Fill in username
    const usernameInput = page.locator('[data-testid="username-input"]');
    await usernameInput.fill('manager');

    // Fill in password
    const passwordInput = page.locator('[data-testid="password-input"]');
    await passwordInput.fill('manager123');

    // Click login button
    const loginButton = page.locator('[data-testid="login-button"]');
    await loginButton.click();

    // Wait for navigation to dashboard
    await page.waitForURL('/dashboard');

    // Verify redirect to dashboard
    expect(page.url()).toContain('/dashboard');

    // Verify dashboard component is displayed by checking for title
    const dashboardTitle = page.locator('[data-testid="dashboard-title"]');
    await expect(dashboardTitle).toBeVisible();

    // Verify no error messages are displayed
    const errorMessages = page.locator('[data-testid="login-error"]');
    const errorCount = await errorMessages.count();
    expect(errorCount).toBe(0);
  });

  test('Step 3: Verify expense list', async ({ page }) => {
    // Login as manager
    await page.goto('/login');
    await page.locator('[data-testid="username-input"]').fill('manager');
    await page.locator('[data-testid="password-input"]').fill('manager123');
    await page.locator('[data-testid="login-button"]').click();
    await page.waitForURL('/dashboard');

    // Verify expense table is displayed (check for table headers)
    const tableHeaders = await page.locator('th').allTextContents();
    expect(tableHeaders.length).toBeGreaterThan(0);

    // Verify at least one expense row is displayed
    const expenseRows = page.locator('[data-testid^="expense-row-"]');
    const rowCount = await expenseRows.count();
    expect(rowCount).toBeGreaterThanOrEqual(1);
  });

  test('Step 4: Find Conference expense', async ({ page }) => {
    // Login as manager
    await page.goto('/login');
    await page.locator('[data-testid="username-input"]').fill('manager');
    await page.locator('[data-testid="password-input"]').fill('manager123');
    await page.locator('[data-testid="login-button"]').click();
    await page.waitForURL('/dashboard');

    // Find Conference expense by looking for the text in the page
    const conferenceCell = page.locator('text=Conference').first();
    await expect(conferenceCell).toBeVisible();

    // Get page content to verify the expense details
    const pageContent = await page.content();
    expect(pageContent).toContain('Conference');
    expect(pageContent).toContain('PENDING');
  });

  test('Step 5 & 6: Approve Conference expense and verify status change', async ({ page }) => {
    // Login as manager
    await page.goto('/login');
    await page.locator('[data-testid="username-input"]').fill('manager');
    await page.locator('[data-testid="password-input"]').fill('manager123');
    await page.locator('[data-testid="login-button"]').click();
    await page.waitForURL('/dashboard');

    // Wait for Conference expense to be loaded
    await page.waitForSelector('text=Conference');

    // Find Conference row
    const conferenceCell = page.locator('text=Conference').first();
    const row = conferenceCell.locator('xpath=ancestor::tr');

    // Find the approve button in this row
    const approveButton = row.locator('[data-testid^="approve-button-"]').first();
    
    // Verify button is clickable
    await expect(approveButton).toBeEnabled();

    // Listen for confirm dialog and accept it before clicking
    page.once('dialog', dialog => {
      dialog.accept();
    });

    // Click approve button
    await approveButton.click();

    // Wait for the request to complete and page update
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Reload to see the updated state from server
    await page.reload();
    await page.waitForLoadState('domcontentloaded');

    // Verify status changed to APPROVED by checking page content after reload
    const pageContent = await page.content();
    expect(pageContent).toContain('Conference');
    expect(pageContent).toContain('APPROVED');

    // Verify no error messages
    const errorMessages = page.locator('[data-testid="error-message"]');
    const errorCount = await errorMessages.count();
    expect(errorCount).toBe(0);
  });

  test('Step 7: Logout functionality', async ({ page }) => {
    // Login as manager
    await page.goto('/login');
    await page.locator('[data-testid="username-input"]').fill('manager');
    await page.locator('[data-testid="password-input"]').fill('manager123');
    await page.locator('[data-testid="login-button"]').click();
    await page.waitForURL('/dashboard');

    // Click logout button
    const logoutButton = page.locator('[data-testid="logout-button"]');
    await expect(logoutButton).toBeVisible();
    await logoutButton.click();

    // Verify redirect to login page
    await page.waitForURL('/login');
    expect(page.url()).toContain('/login');

    // Verify login form is displayed again
    const loginTitle = page.locator('[data-testid="login-title"]');
    await expect(loginTitle).toBeVisible();
  });

  test('Complete Manager Approval Workflow', async ({ page }) => {
    // STEP 1: Access login page
    await page.goto('/login');
    const pageTitle = await page.title();
    expect(pageTitle).toBeTruthy();
    await expect(page.locator('[data-testid="login-title"]')).toBeVisible();

    // STEP 2: Manager authentication
    await page.locator('[data-testid="username-input"]').fill('manager');
    await page.locator('[data-testid="password-input"]').fill('manager123');
    await page.locator('[data-testid="login-button"]').click();
    await page.waitForURL('/dashboard');
    expect(page.url()).toContain('/dashboard');
    await expect(page.locator('[data-testid="dashboard-title"]')).toBeVisible();

    // STEP 3: Verify expense list
    const tableHeaders = await page.locator('th').allTextContents();
    expect(tableHeaders.length).toBeGreaterThan(0);
    const expenseRows = page.locator('[data-testid^="expense-row-"]');
    const rowCount = await expenseRows.count();
    expect(rowCount).toBeGreaterThanOrEqual(1);

    // STEP 4: Find Conference expense
    const conferenceCell = page.locator('text=Conference').first();
    await expect(conferenceCell).toBeVisible();
    let pageContent = await page.content();
    expect(pageContent).toContain('Conference');
    expect(pageContent).toContain('PENDING');

    // STEP 5 & 6: Approve Conference and verify status
    const row = conferenceCell.locator('xpath=ancestor::tr');
    const approveButton = row.locator('[data-testid^="approve-button-"]').first();
    await expect(approveButton).toBeEnabled();

    // Listen for confirm dialog and accept it
    page.once('dialog', dialog => {
      dialog.accept();
    });

    await approveButton.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.reload();
    await page.waitForLoadState('domcontentloaded');

    // Verify status changed to APPROVED
    pageContent = await page.content();
    expect(pageContent).toContain('Conference');
    expect(pageContent).toContain('APPROVED');

    // STEP 7: Logout
    const logoutButton = page.locator('[data-testid="logout-button"]');
    await logoutButton.click();
    await page.waitForURL('/login');
    expect(page.url()).toContain('/login');
  });
});
