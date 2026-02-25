# Manager Expense Approval Flow - Operation Guide

## Overview

This document describes the operation procedures for a Manager (supervisor/administrator) to approve expense requests in the expense management system.

### Target Users
- **Manager (Supervisor/Administrator)**: Users who use the web application and have permission to view and approve expense requests from all employees

### Prerequisites
- A web browser (Chrome, Firefox, Safari, Edge, etc.) is installed
- Access to the system URL (`http://localhost:3000` or production URL) is available
- You have manager account credentials

### Credentials (Demo Environment)
| Username | Password |
|----------|----------|
| manager  | manager123 |

---

## Operation Procedures

### Step 1: Access the Login Page

1. Launch your web browser
2. Enter the system URL in the address bar
   - Local environment: `http://localhost:3000/login`
   - Production environment: `/login` at the URL provided by the administrator

3. Verify that the login page is displayed

**Verification Points:**
- The page title displays "**Expense Management - Manager Login**"
- The username input field is displayed
- The password input field is displayed
- The "Login" button is displayed

![Login Page](../../tests/artifacts/web/manager-expense-approval-flow/screenshots/item_00028_step_4_2026-01-27T14-09-38Z.png)

---

### Step 2: Log in as Manager

1. Enter `manager` in the **Username** field
2. Enter `manager123` in the **Password** field
3. Click the "**Login**" button

**Verification Points:**
- While typing, the password is masked as "●●●●●●●●●"
- No error message is displayed

![After Entering Credentials](../../tests/artifacts/web/manager-expense-approval-flow/screenshots/item_00054_step_6.3_2026-01-27T14-09-50Z.png)

---

### Step 3: Verify the Dashboard Page

After successful login, you will be automatically redirected to the expense approval dashboard.

**Verification Points:**
- The page title displays "**Expense Approval Dashboard**"
- The expense list table is displayed
- The following information is displayed:
  - **Count**: Total number of requests and pending approval count
  - **Total**: Total expense amount

![Dashboard Page](../../tests/artifacts/web/manager-expense-approval-flow/screenshots/item_00061_step_7_2026-01-27T14-09-51Z.png)

---

### Step 4: Review the Expense List

Review the details of each request in the expense list table.

**Table Structure:**

| Column | Description |
|--------|-------------|
| ID | Expense request identification number |
| Title | Expense name (e.g., Taxi, Conference) |
| Applicant | Employee name who submitted the expense |
| Amount | Requested amount (in Yen) |
| Status | PENDING (awaiting approval) / APPROVED / REJECTED |
| Date | Date and time when the request was submitted |
| Action | Approve button (displayed only for PENDING status) |

**Status Color Coding:**
- 🟡 **PENDING** (Yellow): Awaiting approval
- 🟢 **APPROVED** (Green): Approved
- 🔴 **REJECTED** (Red): Rejected

---

### Step 5: Identify the Target Expense

Find the expense to approve from the list.

1. Scroll through the expense list table
2. Identify the row of the expense you want to approve
3. Verify that the status is "**PENDING**"

**Example: Approving Conference Expense**
- Title: Conference
- Applicant: employee
- Amount: ¥5,000
- Status: PENDING

---

### Step 6: Approve the Expense

1. Find the "**Approve**" button at the right end of the target expense row
2. Click the "**Approve**" button
3. If a confirmation dialog appears, click "**OK**"

**Verification Points:**
- The approve button is displayed in green
- The button is in a clickable state

---

### Step 7: Verify the Approval Result

After the approval process is complete, the screen will be updated.

**Verification Points:**
- The status of the approved expense has changed to "**APPROVED**" (green)
- The "Approve" button is no longer displayed (because it's already approved)
- The "Pending approval count" at the top of the screen has decreased by 1

---

### Step 8: Log Out

After completing your work, log out of the system.

1. Click the "**Logout**" button at the top right of the screen
2. You will be automatically redirected to the login page

**Verification Points:**
- The login page is displayed again
- The URL has changed to `/login`

![After Logout](../../tests/artifacts/web/manager-expense-approval-flow/screenshots/item_00216_step_29_2026-01-27T14-10-40Z.png)

---

## Screen Elements List

### Login Page (`/login`)

| Element | Description | data-testid |
|---------|-------------|-------------|
| Title | "Expense Management - Manager Login" | login-title |
| Username Input | Enter manager ID | username-input |
| Password Input | Enter password | password-input |
| Login Button | Execute authentication | login-button |

### Dashboard Page (`/dashboard`)

| Element | Description | data-testid |
|---------|-------------|-------------|
| Title | "Expense Approval Dashboard" | dashboard-title |
| Expense Row | Each expense request row | expense-row-{id} |
| Approve Button | Approve the expense | approve-button-{id} |
| Logout Button | Log out of the system | logout-button |
| Reset All Data Button | Reset test data | reset-button |

---

## Troubleshooting

### Cannot Log In

| Symptom | Cause | Solution |
|---------|-------|----------|
| Error message is displayed | Incorrect username or password | Re-enter the correct credentials |
| Page does not display | Server is not running | Contact the system administrator |
| Does not redirect to dashboard | Network connection issue | Refresh the browser and try again |

### Approve Button Not Displayed

| Symptom | Cause | Solution |
|---------|-------|----------|
| No approve button | Already approved or rejected | Check the status |
| Action column is empty | No permission | Verify you are logged in with a manager account |

### Approval Not Reflected

1. Press the browser refresh button (F5 key) to reload the page
2. If it still doesn't reflect, log out once and log in again

---

## Related Documents

- [Application Specification](../spec-expense-app.md)
- [Employee Expense Submission Guide](./employee-expense-submission-guide.md) *Planned*
- [System Administrator Guide](./admin-guide.md) *Planned*

---

## Revision History

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-28 | 1.0 | Initial release |

---

*This guide was automatically generated based on test artifacts (screenshots) and specifications.*
