# 📁 Proje Yapısı

## Klasör Organizasyonu

```
atlas.motana.mobile.react_native/
├── app/                    # Expo Router - File-based routing (ROOT'ta zorunlu)
│   ├── (tabs)/            # Tab navigation screens
│   ├── account/            # Account settings screens
│   ├── order/             # Order flow screens
│   ├── store/             # Store detail screens
│   ├── search/            # Search screens
│   └── _layout.tsx        # Root layout
│
├── assets/                 # Static assets (images, fonts, icons)
│
├── components/             # Reusable UI components
│   ├── home/
│   ├── store/
│   ├── account/
│   └── order-tracking/
│
├── constants/              # App constants
│   ├── categories.ts
│   └── colors.ts
│
├── contexts/               # React Context providers
│   └── CartContext.tsx
│
├── mocks/                  # Mock data (development)
│   ├── stores.ts
│   ├── menu-items.ts
│   ├── orders.ts
│   └── offers.ts
│
├── utils/                  # Utility functions
│   ├── formatters.ts      # formatPrice, formatDate, etc.
│   ├── validators.ts      # isValidEmail, isValidPhone, etc.
│   ├── helpers.ts         # debounce, throttle, etc.
│   └── constants.ts       # DELIVERY_FEE, SERVICE_FEE, etc.
│
├── types/                  # Shared TypeScript types
│   ├── store.types.ts
│   ├── menu.types.ts
│   ├── order.types.ts
│   └── cart.types.ts
│
├── theme/                  # Design system
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── shadows.ts
│
├── hooks/                  # Custom React hooks
│   ├── useDebounce.ts
│   └── useAsyncStorage.ts
│
├── config/                 # Configuration
│   ├── env.ts             # Environment variables
│   └── routes.ts          # Route constants
│
└── graphql/                # GraphQL + Apollo (placeholder)
    ├── client.ts
    ├── queries/
    ├── mutations/
    ├── fragments/
    └── links/
```

## Import Path Aliases

Tüm import'lar `@/` prefix'i ile çalışır:

```typescript
// Components
import { StoreCard } from '@/components/home';

// Utils
import { formatPrice, formatDate } from '@/utils';
import { DELIVERY_FEE } from '@/utils/constants';

// Types
import { Store } from '@/types/store.types';

// Theme
import { colors, spacing } from '@/theme';

// Hooks
import { useDebounce } from '@/hooks';

// Config
import { config } from '@/config/env';
import { routes } from '@/config/routes';

// Contexts
import { useCart } from '@/contexts/CartContext';

// Mocks
import { stores } from '@/mocks/stores';
```

## Önemli Notlar

- ✅ `app/` klasörü **root'ta kalmalı** (Expo Router zorunlu)
- ✅ `assets/` klasörü **root'ta kalmalı** (Expo convention)
- ✅ Tüm diğer klasörler root'ta organize edildi
- ✅ Path aliases `tsconfig.json`'da tanımlı

