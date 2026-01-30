# MaquisPay Architecture

## 1. Overview
MaquisPay is a Single Page Application (SPA) built with React 19, designed for bar and maquis management. It follows a modular architecture emphasizing separation of concerns, strong typing, and a modern component-based UI.

## 2. Directory Structure

```
/
├── index.html          # Entry HTML (Tailwind CDN, Fonts)
├── index.tsx           # React Mount Point
├── App.tsx             # Main Router/State Controller
├── types.ts            # TypeScript Definitions (Shared Schema)
├── metadata.json       # App Configuration
├── services/
│   └── mockDb.ts       # Simulated Backend (Logic & Persistence)
├── components/         # Reusable UI Components
│   ├── Button.tsx
│   ├── DrinkCard.tsx
│   ├── Logo.tsx
│   └── QuantityModal.tsx
└── views/              # Page Logic
    ├── LoginView.tsx
    ├── SellerView.tsx
    └── ManagerView.tsx
```

## 3. Data Flow

1.  **Persistence Layer**: The app uses `localStorage` as a database.
    *   `mockDb.ts` acts as the ORM/API layer.
    *   It handles Data Integrity (Stock deduction, transaction logging).
    *   It handles Seed Data (Initialization on first run).
2.  **State Management**:
    *   `App.tsx` holds the global Session state (Current User).
    *   Views (`SellerView`, `ManagerView`) fetch data from `mockDb` on mount and on user actions.
    *   Local state (React `useState`) handles UI interactivity (Modals, Inputs).

## 4. Key Components

### A. Services (`mockDb.ts`)
Implements business logic usually found in a backend:
*   `init()`: Seeds the database with Users, Drinks, and Transaction History.
*   `createSale()`: Atomic operation that:
    1.  Validates stock and active status.
    2.  Deducts stock.
    3.  Creates a Sale record.
    4.  Creates 'OUT' Stock Movements.
*   `cancelSale()`: Atomic operation that:
    1.  Updates Sale status to 'CANCELLED'.
    2.  Restores stock.
    3.  Creates 'IN' Stock Movements (Audit).

### B. Views
*   **LoginView**: PIN-based authentication.
*   **SellerView**:
    *   Filters `isActive` drinks.
    *   Manages Cart state in memory.
*   **ManagerView**:
    *   Dashboard with Recharts.
    *   Stock Table with inline editing.
    *   Sales Audit log with Cancellation capabilities.

## 5. UI/UX Design System
*   **Framework**: Tailwind CSS.
*   **Theme**:
    *   Primary: Violet (`violet-600`).
    *   Radius: Ultra-rounded (`rounded-[2.5rem]`, `rounded-3xl`).
    *   Typography: 'Plus Jakarta Sans'.
*   **Icons**: Lucide React.

## 6. Future Improvements (Roadmap)
*   Migration to a real backend (Supabase/Firebase).
*   Receipt printing capability.
*   Multi-device sync (WebSockets).
