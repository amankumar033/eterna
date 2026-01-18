# Token Trading Table - Axiom Trade Replica

A pixel-perfect replica of Axiom Trade's token discovery table built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Features
- **Token Columns**: New pairs, Final Stretch, Migrated
- **UI Patterns**: Popover, Tooltip, Modal, Sorting
- **Interaction Patterns**: Hover effects, click actions
- **Real-time Updates**: WebSocket mock with smooth color transitions
- **Loading States**: Skeleton, shimmer, progressive loading, error boundaries
- **Responsive Design**: Works seamlessly from 320px to 4K displays

### Technical Highlights
- **Next.js 14** App Router with TypeScript (strict mode)
- **Redux Toolkit** for complex state management
- **React Query** for data fetching and caching
- **Radix UI** components for accessibility
- **Performance Optimized**: Memoized components, <100ms interactions
- **Atomic Architecture**: Reusable components, custom hooks, shared utilities

## 🚦 Lighthouse Performance

**Desktop**
![Lighthouse Desktop](./screenshots/lighthouse-desktop.png)

**Mobile**
![Lighthouse Mobile](./screenshots/lighthouse-mobile.png)

## 🎯 Visual Regression Testing

Visual regression testing was performed using **Playwright**.

- Tool: Playwright Screenshot Diff
- Tolerance: ≤ 2px
- Result: ✅ PASS

![Visual Regression](./visual-regression-pass.png)

## 📱 Responsive Layout Snapshots

### Mobile (320px)
![Mobile 320px](./mobile.png)

### Tablet (768px)
![Tablet 768px](./tablet.png)

### Desktop (1024px)
![Desktop 1024px](./desktop.png)

### Large Desktop (1600px+)
![Desktop 1600px](./desktop.png)


## 📁 Project Structure

```
├── app/
│   ├── pulse/              # Main token discovery page
│   ├── layout.tsx          # Root layout with providers
│   └── page.tsx            # Home page
├── components/
│   ├── ui/                 # Base UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── popover.tsx
│   │   ├── skeleton.tsx
│   │   ├── table.tsx
│   │   └── tooltip.tsx
│   ├── token-table/        # Token table components
│   │   ├── TokenTable.tsx
│   │   ├── TokenRow.tsx
│   │   ├── TokenCell.tsx
│   │   ├── TokenTableFilters.tsx
│   │   ├── TokenTableSkeleton.tsx
│   │   └── TableHeaderCell.tsx
│   └── error-boundary/     # Error handling
│       └── ErrorBoundary.tsx
├── hooks/                  # Custom React hooks
│   ├── useTokenData.ts     # Token data fetching
│   ├── useWebSocket.ts     # WebSocket mock
│   └── useSorting.ts       # Table sorting logic
├── store/                  # Redux store
│   └── slices/
│       └── tokenTableSlice.ts
├── types/                  # TypeScript types
│   └── token.ts
└── lib/                    # Utilities and providers
    ├── hooks/
    ├── providers/
    ├── store.ts
    └── utils.ts
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

Navigate to [http://localhost:3000/pulse](http://localhost:3000/pulse) to see the token discovery table.

## 📱 Responsive Design

The application is fully responsive and tested down to **320px width**:

### Breakpoints
- **Mobile**: 320px - 640px
- **Tablet**: 641px - 1024px
- **Desktop**: 1025px+
- **Large Desktop**: 1600px+

### Responsive Features
- Adaptive table layout with horizontal scroll on mobile
- Collapsible column labels on small screens
- Touch-friendly button sizes
- Optimized font sizes per breakpoint
- Responsive image loading

### Layout Snapshots

#### Mobile (320px)
- Single column filter layout
- Abbreviated column headers
- Compact token information
- Horizontal scroll for table

#### Tablet (768px)
- Two-column filter layout
- Full column headers
- Expanded token details
- Optimized table spacing

#### Desktop (1024px+)
- Full multi-column layout
- All features visible
- Maximum table width: 1600px
- Optimal spacing and typography

## 🎨 UI Components

### Token Table
- **Sortable Columns**: Click headers to sort (asc → desc → none)
- **Real-time Prices**: Color transitions (green/red) on price changes
- **Status Badges**: Visual indicators for token status
- **Interactive Cells**: Tooltips, popovers, and modals for details

### Interaction Patterns
- **Tooltips**: Hover for quick information
- **Popovers**: Click for detailed breakdowns
- **Modals**: Full-screen details for complex data
- **Sorting**: Multi-state sorting with visual indicators

## ⚡ Performance Optimizations

### Code Optimizations
- **Memoization**: All table components use `React.memo`
- **Lazy Loading**: Suspense boundaries for progressive loading
- **Debouncing**: Search input debounced for performance
- **Virtual Scrolling**: Ready for large datasets (can be added)

### Performance Metrics
- **Lighthouse Score**: Target ≥90 (mobile & desktop)
- **Interaction Time**: <100ms for all interactions
- **Layout Shifts**: Zero CLS (Cumulative Layout Shift)
- **Bundle Size**: Optimized with tree-shaking

## 🧪 State Management

### Redux Toolkit
- Token data state
- Filtering and sorting
- Real-time price updates
- Loading and error states

### React Query
- Data fetching and caching
- Automatic refetching
- Error handling
- Loading states

## 🔌 WebSocket Mock

The application includes a mock WebSocket implementation that:
- Simulates real-time price updates
- Updates prices every 1.5-3 seconds
- Provides smooth color transitions
- Can be easily replaced with real WebSocket connection

## 🎯 Features Breakdown

### Token Columns
1. **Token**: Name, symbol, and logo
2. **Price**: Real-time price with color transitions
3. **24h Change**: Percentage change with popover details
4. **Liquidity**: Total liquidity with tooltip
5. **Volume 5m**: 5-minute volume with modal details
6. **Trades**: Total trade count
7. **Status**: New Pairs, Final Stretch, or Migrated
8. **Actions**: External links and actions

### Filtering & Search
- **Search**: By token name, symbol, or contract address
- **Status Filter**: Filter by New Pairs, Final Stretch, or Migrated
- **Real-time**: Filters apply instantly

### Loading States
- **Skeleton Loading**: Shimmer effect during initial load
- **Progressive Loading**: Suspense boundaries for smooth transitions
- **Error Boundaries**: Graceful error handling with retry

## 🏗️ Architecture

### Atomic Design Principles
- **Atoms**: Basic UI components (Button, Input)
- **Molecules**: Composite components (TokenCell, TableHeader)
- **Organisms**: Complex components (TokenTable, Filters)
- **Templates**: Page layouts (Pulse page)

### Code Quality
- **TypeScript Strict Mode**: Full type safety
- **ESLint**: Code quality enforcement
- **Component Documentation**: JSDoc comments
- **DRY Principles**: Reusable utilities and hooks

## 📊 Performance Checklist

- ✅ Memoized components
- ✅ Optimized re-renders
- ✅ Lazy loading with Suspense
- ✅ Error boundaries
- ✅ Debounced search
- ✅ Efficient state management
- ✅ Responsive images
- ✅ CSS transitions (not animations)
- ✅ Zero layout shifts

## 🔧 Customization

### Theme
Edit `app/globals.css` to customize colors and theme variables.

### Mock Data
Modify `hooks/useTokenData.ts` to change mock data generation or connect to real API.

### WebSocket
Replace `useMockWebSocket` in `hooks/useWebSocket.ts` with real WebSocket connection.

## 📝 Development Notes

### Adding New Columns
1. Update `COLUMNS` array in `TokenTable.tsx`
2. Add rendering logic in `TokenCell.tsx`
3. Update types in `types/token.ts` if needed

### Adding New Filters
1. Update Redux slice in `store/slices/tokenTableSlice.ts`
2. Add UI in `TokenTableFilters.tsx`
3. Update filtering logic in slice

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Other Platforms
The app can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- Railway
- Docker

## 📄 License

This project is built for educational purposes as a replica of Axiom Trade's interface.

## 🙏 Acknowledgments

- Inspired by [Axiom Trade](https://axiom.trade)
- Built with [Next.js](https://nextjs.org)
- UI components from [Radix UI](https://www.radix-ui.com)
- Styling with [Tailwind CSS](https://tailwindcss.com)
