# FinTracker - Personal Financial Tracking System

## Project Overview

A comprehensive web-based financial tracking system built with React, TypeScript, Redux Toolkit, and Tailwind CSS. This application helps track daily expenses, income, bills, credit cards, and achieve monthly surplus goals.

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **State Management**: Redux Toolkit with Redux Thunk
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API**: Mock services (frontend-only, no database integration)

## Features Implemented

### 1. Authentication
- Login with passcode
- Remember me functionality
- Session persistence using mock storage
- Protected routes

### 2. Dashboard
- Real-time balance display
- Monthly income and expenses summary
- Monthly surplus tracking with progress bar
- Surplus goal visualization
- Quick stats cards
- Upcoming bills widget

### 3. Expenses Tracking
- Add, view, and manage expenses
- Categorize expenses (fixed and variable)
- Multiple payment methods (Cash, Credit Cards, Debit, Shopee Pay Later)
- Approval workflow (pending/approved/rejected)
- Filter and search capabilities
- Transaction history

### 4. Credit Cards Management
- Track up to 3 credit cards
- Real-time outstanding balance visualization
- Circular progress indicators showing utilization
- Available credit calculation
- Payment due date tracking
- Minimum payment calculation
- Installment plan tracking
- Visual alerts for high utilization

### 5. Bills & Payments
- Add and track bills
- Due date reminders
- Recurring bill setup
- Color-coded urgency indicators (red/yellow/blue)
- Mark bills as paid
- Paid bills history

### 6. Income Management
- Add income transactions
- Track by source (Salary, Bonus, Reimbursement)
- Auto-generate recurring salary entries
- Approval workflow

### 7. Balance Tracking
- Current balance display
- Account separation (Cash, Bank, Set Aside)
- Real-time updates

## Project Structure

```
src/
├── app/                          # Redux store configuration
│   ├── store.ts                  # Store setup with all reducers
│   └── hooks.ts                  # Typed Redux hooks
│
├── features/                     # Feature-based modules
│   ├── auth/                     # Authentication
│   │   ├── authSlice.ts         # Auth state management
│   │   └── LoginPage.tsx        # Login UI
│   │
│   ├── dashboard/               # Dashboard
│   │   ├── Dashboard.tsx        # Main dashboard
│   │   └── QuickStats.tsx       # Stats cards component
│   │
│   ├── expenses/                # Expense tracking
│   │   ├── expenseSlice.ts      # Expense state management
│   │   ├── ExpensesPage.tsx     # Main expenses page
│   │   ├── ExpenseList.tsx      # Expense list table
│   │   └── AddExpenseModal.tsx  # Add expense form
│   │
│   ├── income/                  # Income tracking
│   │   └── incomeSlice.ts       # Income state management
│   │
│   ├── creditCards/             # Credit card management
│   │   ├── creditCardSlice.ts   # Credit card state
│   │   ├── CreditCardsPage.tsx  # Main credit cards page
│   │   └── CreditCardWidget.tsx # Individual card widget
│   │
│   ├── bills/                   # Bills tracking
│   │   ├── billSlice.ts         # Bills state management
│   │   ├── BillsPage.tsx        # Main bills page
│   │   ├── BillList.tsx         # Bills list component
│   │   ├── UpcomingBillsList.tsx # Dashboard widget
│   │   └── AddBillModal.tsx     # Add bill form
│   │
│   ├── budget/                  # Budget management
│   │   └── budgetSlice.ts       # Budget state management
│   │
│   └── balance/                 # Balance tracking
│       └── balanceSlice.ts      # Balance state management
│
├── components/                  # Shared components
│   ├── common/                  # Reusable UI components
│   │   ├── Button.tsx           # Button component
│   │   ├── Card.tsx             # Card container
│   │   ├── Input.tsx            # Input field
│   │   ├── Select.tsx           # Select dropdown
│   │   ├── Modal.tsx            # Modal dialog
│   │   └── Badge.tsx            # Status badge
│   │
│   └── layout/                  # Layout components
│       ├── Layout.tsx           # Main layout wrapper
│       ├── Sidebar.tsx          # Navigation sidebar
│       └── Header.tsx           # Top header bar
│
├── services/                    # API services (mock)
│   ├── mockApi.ts              # Mock API utilities
│   ├── authService.ts          # Auth service
│   ├── expenseService.ts       # Expense service
│   ├── incomeService.ts        # Income service
│   ├── creditCardService.ts    # Credit card service
│   └── billService.ts          # Bill service
│
├── types/                       # TypeScript types
│   └── index.ts                # All type definitions
│
├── constants/                   # Constants
│   ├── categories.ts           # Category definitions and labels
│   └── users.ts                # User configurations
│
├── utils/                       # Utility functions
│   └── dateUtils.ts            # Date and currency formatting
│
├── routes/                      # Routing
│   └── Router.tsx              # Route configuration
│
├── App.tsx                      # Main app component
├── main.tsx                     # App entry point
└── index.css                    # Global styles
```

## Key Design Patterns

### 1. Feature-Based Architecture
Each feature module is self-contained with its own:
- Redux slice for state management
- Components for UI
- Service layer for API calls

### 2. Redux Toolkit with Thunk
- Async operations handled with createAsyncThunk
- Normalized state structure
- Type-safe reducers and actions

### 3. Component Hierarchy
- **Pages**: Top-level route components
- **Containers**: Smart components with Redux connection
- **Presentational**: Reusable UI components
- **Layout**: App structure components

### 4. Mock API Layer
All API calls go through mock services that:
- Simulate network latency
- Return realistic data
- Maintain in-memory state
- Can be easily replaced with real API

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

- **Passcode**: 

## Future Enhancements

The following modules are planned but not yet implemented:

1. **Income Page**: Full income management interface
2. **Balance Page**: Detailed balance breakdown and history
3. **Budget Management**:
   - Set category budgets
   - Budget vs actual comparison
   - Budget alerts
4. **Reports & Analytics**:
   - Monthly trends
   - Category breakdown charts
   - Custom date range reports
   - Export to Excel/PDF
5. **Settings**:
   - User profile management
   - Notification preferences
   - Category customization
6. **Review System**:
   - Transaction approval workflow
   - Comment on transactions
   - Audit trail

## State Management

### Redux Store Structure

```typescript
{
  auth: {
    isAuthenticated: boolean,
    user: User | null,
    token: string | null,
    loading: boolean,
    error: string | null
  },
  expense: {
    expenses: Expense[],
    pendingExpenses: Expense[],
    loading: boolean,
    error: string | null
  },
  income: {
    incomes: Income[],
    loading: boolean,
    error: string | null
  },
  creditCard: {
    cards: CreditCard[],
    transactions: CreditCardTransaction[],
    payments: CreditCardPayment[],
    installments: Installment[],
    loading: boolean,
    error: string | null
  },
  bill: {
    bills: Bill[],
    upcomingBills: Bill[],
    loading: boolean,
    error: string | null
  },
  budget: {
    budgets: Budget[],
    loading: boolean,
    error: string | null
  },
  balance: {
    cash: number,
    bank: number,
    setAside: number,
    total: number,
    openingBalance: number,
    lastUpdated: string
  }
}
```

## Mock Data

The application comes with realistic mock data:
- 2 sample expenses
- 1 sample income
- 3 credit cards with balances
- 2 unpaid bills
- 3 category budgets
- 1 installment plan

## Styling Guidelines

- **Color Scheme**: Blue primary, neutral grays
- **Design System**: Consistent spacing (4px grid)
- **Typography**: Clear hierarchy with font weights
- **Components**: Rounded corners, subtle shadows
- **Responsive**: Mobile-first approach
- **Accessibility**: WCAG compliant color contrast

## Code Quality

- **TypeScript**: Full type coverage
- **ESLint**: Code linting configured
- **Consistent Naming**: PascalCase for components, camelCase for functions
- **Component Size**: Each file focused on single responsibility
- **Comments**: Self-documenting code with JSDoc where needed

## Performance Considerations

- Lazy loading for routes (future enhancement)
- Memoization with React.memo where beneficial
- Efficient Redux selectors
- Optimized re-renders with proper dependency arrays

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

Built with attention to scalability, maintainability, and user experience.
