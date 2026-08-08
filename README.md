# Skyper Money

> **Smart budgeting starts here.**

Skyper Money is a personal finance and budgeting web application built for our hackathon. It helps users organize their income, track expenses, manage custom money categories, understand their spending patterns, and monitor their savings.

---

## Hackathon Team

| Member | Role |
|---|---|
| **Harshit Singh Rana** | JavaScript, Application Logic |
| **Naman Kothari** | HTML, CSS |
| **Jatin Gariya** | Program Manager |

---

## Problem Statement

Managing personal finances can become difficult when income, expenses, savings, and different spending categories are scattered across multiple places.

Skyper Money provides a simple centralized dashboard where users can:

- Record income and expenses
- Organize spending into categories
- Track their total balance and savings
- See where their money is being spent
- Create their own custom categories
- Filter transactions
- Export their transaction report
- Keep their data separated between users

---

## Key Features

### Landing Page

The landing page introduces Skyper Money and explains its budgeting approach through:

- Hero section
- Money Chambers
- Financial category cards
- "How it Works" section
- Clear call-to-action buttons

### Personal Dashboard

The dashboard provides an overview of the user's financial activity:

- **Total Balance**
- **Total Income**
- **Total Expenses**
- **Total Savings**
- **Savings Rate**
- Recent Transactions
- Spending Breakdown by Category

Financial values are calculated automatically from the user's transactions.

### Transaction Management

Users can:

- Add income
- Add expenses
- Select a category
- Delete transactions
- View recent transactions
- Filter transactions by type
- Filter transactions by category

### Custom Money Chambers

Users can create their own categories with:

- Category name
- Category icon

This allows the budgeting system to adapt to each user's personal spending habits.

### Spending Breakdown

The dashboard automatically calculates how much the user has spent in each category and displays:

- Category
- Amount spent
- Percentage of total expenses
- Visual progress bar

### Export Report

Users can export their transaction data as a CSV report for further analysis or record keeping.

### User-Specific Data

Skyper Money uses browser `localStorage` to keep user data separated.

Each logged-in user has their own:

- Transactions
- Categories
- Dashboard data

Refreshing the page does not remove saved transactions.

---

## Financial Calculations

Skyper Money automatically calculates the user's financial summary.

### Balance / Savings

```text
Savings = Total Income - Total Expenses
```

### Savings Rate

```text
Savings Rate = (Savings / Total Income) × 100
```

### Category Spending

For each expense category:

```text
Category Percentage =
(Category Expense / Total Expenses) × 100
```

These values update automatically whenever transactions are added or deleted.

---

## Technology Stack

Skyper Money is currently built using lightweight web technologies:

- **HTML5** — Structure and content
- **CSS3** — Responsive UI and visual design
- **JavaScript** — Application logic and dynamic dashboard
- **LocalStorage API** — User and financial data persistence
- **CSV** — Transaction report export

No external backend or database is required for the current hackathon prototype.

---

## Project Structure

```text
Skyper-Money/
│
├── index.html
├── login.html
├── signup.html
├── dashboard.html
│
├── css/
│   ├── style.css
│   ├── dashboard.css
│   └── ...
│
├── js/
│   ├── landingPage.js
│   ├── login.js
│   ├── dashboard.js
│   └── ...
│
├── assets/
│   └── images/
│       ├── saving.jpg
│       ├── food.jpg
│       ├── rent.jpg
│       ├── travel.jpg
│       ├── investment.jpg
│       └── shopping.jpg
│
└── README.md
```

> File names may vary depending on the final project structure.

---

## How to Run

### 1. Clone the repository

```bash
git clone https://github.com/harshit070908-bot/algolympia-project
```

### 2. Open the project

Open the project folder in your preferred code editor.

### 3. Run the application

For a simple frontend setup, open `index.html` in a browser.

For development, using a local server such as VS Code Live Server is recommended.

---

## User Data

The current hackathon version uses browser `localStorage`.

The application stores:

```text
users
currentUser
skyperMoney_<user-email>
```

A user's financial data is associated with their logged-in account.

Example:

```text
skyperMoney_harshit@example.com
```

can contain:

```json
{
  "transactions": [],
  "categories": []
}
```

This allows different users on the same browser to have separate application data.

---

## Design System

Skyper Money uses a financial-focused visual identity built around:

- 🔵 Blue — Primary actions and financial navigation
- 🟢 Green — Income, savings, and positive financial values
- 🔴 Red — Expenses and destructive actions
- 🟡 Yellow — Warnings and attention states
- ⚪ Light surfaces — Cards, panels, and readable content areas

The interface uses rounded cards, subtle shadows, floating navigation, responsive layouts, and clear financial indicators.

---

## Hackathon MVP

The current MVP focuses on delivering a complete usable budgeting experience rather than introducing unnecessary complexity.

### Completed

- [x] Landing page
- [x] Login
- [x] Signup
- [x] User-specific dashboard
- [x] Add transaction
- [x] Delete transaction
- [x] Add category
- [x] Income tracking
- [x] Expense tracking
- [x] Savings calculation
- [x] Savings rate calculation
- [x] Category spending breakdown
- [x] Transaction filtering
- [x] CSV report export
- [x] LocalStorage persistence
- [x] Responsive UI

---

## Future Improvements

Possible future versions could include:

- Backend API
- Cloud database
- Secure authentication
- Password hashing
- Multi-device synchronization
- AI-powered financial insights
- Spending predictions
- Budget recommendations
- Monthly financial reports
- Charts and advanced analytics
- Recurring transactions
- Savings goals and notifications

---

## Hackathon Prototype Note

This version is designed as a hackathon MVP.

User authentication and financial data are currently handled through browser `localStorage`, so this implementation should **not be considered production-grade authentication or secure financial storage**.

A production version would require a secure backend, database, encrypted connections, proper password hashing, authentication/session management, and appropriate data protection.

---

## Vision

Skyper Money aims to make personal budgeting simple:

> **Know where your money goes.  
> Control where it goes next.  
> Build better financial habits.**

---

## License

This project was created as part of a hackathon project by:

**Harshit Singh Rana · Naman Kothari · Jatin Gariya**
