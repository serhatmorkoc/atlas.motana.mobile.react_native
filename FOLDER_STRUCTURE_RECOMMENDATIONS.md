# 📁 Folder Structure Önerileri - React Native Expo Router

## 🎯 Mevcut Durum Analizi

### ✅ İyi Olan Kısımlar
- `app/` klasörü Expo Router için doğru yapılandırılmış
- `components/` feature-based organizasyon (home, account, store, order-tracking)
- `contexts/` klasörü mevcut
- `constants/` klasörü mevcut
- `mocks/` klasörü development için iyi

### ⚠️ İyileştirilmesi Gerekenler
- Utility fonksiyonları dağınık
- Custom hooks yok
- GraphQL/Apollo setup yok (henüz mock data kullanılıyor)
- Type definitions dağınık
- Theme/design system eksik
- Zustand kullanılmıyor (sadece Context API var)

---

## 🏗️ Önerilen Yeni Folder Structure

```
atlas.motana.mobile.react_native/
├── app/                          # Expo Router - File-based routing
│   ├── (tabs)/                   # Tab navigation
│   │   ├── _layout.tsx
│   │   ├── home.tsx
│   │   ├── search/
│   │   ├── orders.tsx
│   │   ├── checkout.tsx
│   │   └── account.tsx
│   ├── store/                    # Store detail pages
│   ├── order/                    # Order flow
│   ├── account/                  # Account settings
│   ├── search/                   # Search functionality
│   ├── _layout.tsx               # Root layout
│   └── index.tsx                 # Entry point
│
├── src/                          # 🆕 Source code (optional, ama önerilir)
│   ├── components/               # Reusable UI components
│   │   ├── ui/                   # 🆕 Base UI components (Button, Input, Card, etc.)
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.types.ts
│   │   │   │   └── Button.styles.ts
│   │   │   ├── Input/
│   │   │   ├── Card/
│   │   │   └── index.ts
│   │   │
│   │   ├── layout/               # 🆕 Layout components
│   │   │   ├── Container.tsx
│   │   │   ├── Screen.tsx
│   │   │   └── SafeArea.tsx
│   │   │
│   │   ├── home/                 # Feature-specific components
│   │   ├── store/
│   │   ├── account/
│   │   └── order-tracking/
│   │
│   ├── features/                  # 🆕 Feature modules (domain-driven)
│   │   ├── store/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   ├── cart/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── stores/           # Zustand store
│   │   │   └── types/
│   │   ├── order/
│   │   ├── search/
│   │   └── account/
│   │
│   ├── hooks/                    # 🆕 Custom React hooks
│   │   ├── useDebounce.ts
│   │   ├── useAsyncStorage.ts
│   │   ├── useLocation.ts
│   │   ├── useNotifications.ts
│   │   └── index.ts
│   │
│   ├── graphql/                  # 🆕 GraphQL (Apollo Client)
│   │   ├── client.ts             # Apollo Client setup
│   │   ├── cache.ts              # Cache configuration
│   │   ├── links/                # Apollo Links (auth, error, etc.)
│   │   │   ├── authLink.ts
│   │   │   ├── errorLink.ts
│   │   │   └── httpLink.ts
│   │   ├── queries/              # GraphQL Queries
│   │   │   ├── store.queries.ts
│   │   │   ├── order.queries.ts
│   │   │   ├── cart.queries.ts
│   │   │   └── user.queries.ts
│   │   ├── mutations/             # GraphQL Mutations
│   │   │   ├── store.mutations.ts
│   │   │   ├── order.mutations.ts
│   │   │   ├── cart.mutations.ts
│   │   │   └── user.mutations.ts
│   │   ├── fragments/             # GraphQL Fragments
│   │   │   ├── store.fragments.ts
│   │   │   └── order.fragments.ts
│   │   ├── generated/             # 🆕 Generated types (GraphQL Code Generator)
│   │   │   ├── types.ts
│   │   │   └── hooks.ts
│   │   └── schema.graphql          # Local schema (optional)
│   │
│   ├── stores/                   # 🆕 Zustand stores (global state)
│   │   ├── useAuthStore.ts
│   │   ├── useAppStore.ts
│   │   └── index.ts
│   │
│   ├── utils/                    # 🆕 Utility functions
│   │   ├── formatters.ts         # formatPrice, formatDate, etc.
│   │   ├── validators.ts         # email, phone, etc.
│   │   ├── helpers.ts            # common helpers
│   │   ├── constants.ts          # magic numbers, strings
│   │   └── index.ts
│   │
│   ├── types/                    # 🆕 Shared TypeScript types
│   │   ├── api.types.ts
│   │   ├── store.types.ts
│   │   ├── order.types.ts
│   │   ├── user.types.ts
│   │   └── index.ts
│   │
│   ├── theme/                    # 🆕 Design system
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   ├── shadows.ts
│   │   └── index.ts
│   │
│   └── config/                   # 🆕 App configuration
│       ├── env.ts                # Environment variables
│       ├── routes.ts             # Route constants
│       └── constants.ts
│
├── components/                   # ⚠️ Mevcut - src/components'a taşınabilir
├── contexts/                     # ⚠️ Mevcut - src/features içine taşınabilir
├── constants/                    # ⚠️ Mevcut - src/theme ve src/config'e ayrılabilir
├── mocks/                        # ✅ Mock data (dev için)
│   ├── stores.ts
│   ├── menu-items.ts
│   └── ...
│
├── assets/                       # Static assets
│   ├── images/
│   ├── fonts/
│   └── icons/
│
├── __tests__/                    # 🆕 Test files
│   ├── components/
│   ├── hooks/
│   └── utils/
│
└── docs/                         # 🆕 Documentation
    ├── ARCHITECTURE.md
    ├── API.md
    └── CONTRIBUTING.md
```

---

## 📋 Detaylı Öneriler

### 1. **`src/` Klasörü Ekle (Önerilir ama zorunlu değil)**

**Avantajlar:**
- Tüm source code tek yerde
- Import path'leri daha temiz (`@/src/...`)
- Build output'u daha temiz

**Alternatif:** Root'ta kalabilir, ama organize edilmeli.

---

### 2. **`src/components/ui/` - Base UI Components**

**Neden?**
- Reusable, generic components
- Design system'in temeli
- Tüm projede tutarlılık

**Örnek Yapı:**
```
components/ui/
├── Button/
│   ├── Button.tsx
│   ├── Button.types.ts
│   ├── Button.styles.ts
│   └── Button.test.tsx
├── Input/
├── Card/
├── Modal/
└── index.ts
```

**Örnek Kullanım:**
```typescript
// components/ui/Button/Button.tsx
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ButtonProps } from './Button.types';
import { styles } from './Button.styles';

export function Button({ title, onPress, variant = 'primary' }: ButtonProps) {
  return (
    <TouchableOpacity style={styles[variant]} onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
}
```

---

### 3. **`src/features/` - Feature-Based Organization**

**Neden?**
- Domain-driven design
- Her feature kendi modülü
- Kolay maintainability
- Team collaboration için ideal

**Örnek: Cart Feature**
```
features/cart/
├── components/
│   ├── CartItem.tsx
│   ├── CartSummary.tsx
│   └── EmptyCart.tsx
├── hooks/
│   ├── useCart.ts
│   └── useCartTotal.ts
├── stores/
│   └── cartStore.ts          # Zustand
├── types/
│   └── cart.types.ts
└── utils/
    └── cartCalculations.ts
```

**Avantajlar:**
- Tüm cart-related kod bir yerde
- Başka feature'a bağımlılık yok
- Test edilmesi kolay

---

### 4. **`src/hooks/` - Custom Hooks**

**Neden?**
- Logic reuse
- Component'lerden business logic'i ayırma
- Test edilebilirlik

**Örnekler:**
```typescript
// hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}

// hooks/useAsyncStorage.ts
export function useAsyncStorage<T>(key: string) {
  const [value, setValue] = useState<T | null>(null);
  
  useEffect(() => {
    AsyncStorage.getItem(key).then(setValue);
  }, [key]);
  
  const updateValue = async (newValue: T) => {
    await AsyncStorage.setItem(key, JSON.stringify(newValue));
    setValue(newValue);
  };
  
  return [value, updateValue] as const;
}
```

---

### 5. **`src/graphql/` - GraphQL + Apollo Client**

**Neden?**
- Type-safe GraphQL queries/mutations
- Apollo Client cache management
- Code generation ile otomatik type'lar
- Centralized GraphQL operations

**Apollo Client Setup:**
```typescript
// graphql/client.ts
import { ApolloClient, InMemoryCache, from } from '@apollo/client';
import { authLink } from './links/authLink';
import { errorLink } from './links/errorLink';
import { httpLink } from './links/httpLink';

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          stores: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

// graphql/links/httpLink.ts
import { createHttpLink } from '@apollo/client';
import { config } from '@/config/env';

export const httpLink = createHttpLink({
  uri: `${config.graphqlUrl}/graphql`,
});

// graphql/links/authLink.ts
import { setContext } from '@apollo/client/link/context';
import { useAuthStore } from '@/stores/useAuthStore';

export const authLink = setContext((_, { headers }) => {
  const token = useAuthStore.getState().token;
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// graphql/links/errorLink.ts
import { onError } from '@apollo/client/link/error';

export const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }
  
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});
```

**GraphQL Queries:**
```typescript
// graphql/queries/store.queries.ts
import { gql } from '@apollo/client';
import { StoreFragment } from '../fragments/store.fragments';

export const GET_STORES = gql`
  query GetStores($limit: Int, $offset: Int) {
    stores(limit: $limit, offset: $offset) {
      ...StoreFragment
    }
  }
  ${StoreFragment}
`;

export const GET_STORE_BY_ID = gql`
  query GetStoreById($id: ID!) {
    store(id: $id) {
      ...StoreFragment
      description
      address
      phone
      openingHours {
        day
        open
        close
      }
      menuItems {
        id
        name
        price
        image
        category
      }
    }
  }
  ${StoreFragment}
`;

// graphql/fragments/store.fragments.ts
import { gql } from '@apollo/client';

export const StoreFragment = gql`
  fragment StoreFragment on Store {
    id
    name
    image
    rating
    deliveryTime
    cuisine
    deliveryFee
    distance
  }
`;
```

**GraphQL Mutations:**
```typescript
// graphql/mutations/order.mutations.ts
import { gql } from '@apollo/client';

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      status
      totalPrice
      items {
        id
        name
        quantity
        price
      }
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation CancelOrder($orderId: ID!) {
    cancelOrder(orderId: $orderId) {
      id
      status
    }
  }
`;
```

**Custom Hooks (Apollo ile):**
```typescript
// features/store/hooks/useStores.ts
import { useQuery } from '@apollo/client';
import { GET_STORES } from '@/graphql/queries/store.queries';
import { GetStoresQuery, GetStoresQueryVariables } from '@/graphql/generated/types';

export function useStores(limit?: number, offset?: number) {
  const { data, loading, error, refetch } = useQuery<
    GetStoresQuery,
    GetStoresQueryVariables
  >(GET_STORES, {
    variables: { limit, offset },
    fetchPolicy: 'cache-and-network',
  });

  return {
    stores: data?.stores || [],
    loading,
    error,
    refetch,
  };
}

// features/store/hooks/useStore.ts
import { useQuery } from '@apollo/client';
import { GET_STORE_BY_ID } from '@/graphql/queries/store.queries';
import { GetStoreByIdQuery, GetStoreByIdQueryVariables } from '@/graphql/generated/types';

export function useStore(id: string) {
  const { data, loading, error } = useQuery<
    GetStoreByIdQuery,
    GetStoreByIdQueryVariables
  >(GET_STORE_BY_ID, {
    variables: { id },
    skip: !id,
  });

  return {
    store: data?.store,
    loading,
    error,
  };
}

// features/order/hooks/useCreateOrder.ts
import { useMutation } from '@apollo/client';
import { CREATE_ORDER } from '@/graphql/mutations/order.mutations';
import { CreateOrderMutation, CreateOrderMutationVariables } from '@/graphql/generated/types';

export function useCreateOrder() {
  const [createOrder, { loading, error }] = useMutation<
    CreateOrderMutation,
    CreateOrderMutationVariables
  >(CREATE_ORDER);

  const handleCreateOrder = async (input: CreateOrderMutationVariables['input']) => {
    try {
      const { data } = await createOrder({
        variables: { input },
        refetchQueries: ['GetOrders'], // Cache'i güncelle
      });
      return data?.createOrder;
    } catch (err) {
      console.error('Order creation failed:', err);
      throw err;
    }
  };

  return {
    createOrder: handleCreateOrder,
    loading,
    error,
  };
}
```

**GraphQL Code Generator Setup:**

`codegen.yml` dosyası:
```yaml
schema: ${GRAPHQL_URL}/graphql
documents: 'src/graphql/**/*.{ts,tsx}'
generates:
  src/graphql/generated/types.ts:
    plugins:
      - typescript
      - typescript-operations
      - typescript-react-apollo
    config:
      withHooks: true
      withComponent: false
      withHOC: false
```

**Package.json scripts:**
```json
{
  "scripts": {
    "codegen": "graphql-codegen --config codegen.yml",
    "codegen:watch": "graphql-codegen --config codegen.yml --watch"
  }
}
```

**App Layout'ta Apollo Provider:**
```typescript
// app/_layout.tsx
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/graphql/client';

export default function RootLayout() {
  return (
    <ApolloProvider client={apolloClient}>
      {/* Your app */}
    </ApolloProvider>
  );
}
```

---

### 6. **`src/stores/` - Zustand Global State**

**Neden?**
- Context API'den daha performanslı
- Daha az boilerplate
- DevTools desteği

**Örnek:**
```typescript
// stores/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'auth-storage' }
  )
);
```

---

### 7. **`src/utils/` - Utility Functions**

**Neden?**
- Reusable helper functions
- Pure functions (test edilebilir)
- Business logic'ten ayrı

**Örnekler:**
```typescript
// utils/formatters.ts
export const formatters = {
  price: (amount: number, currency: string = '₺'): string => {
    return `${currency}${amount.toFixed(2)}`;
  },
  
  date: (date: Date | string): string => {
    return new Intl.DateTimeFormat('tr-TR').format(new Date(date));
  },
  
  distance: (km: number): string => {
    return km < 1 ? `${(km * 1000).toFixed(0)} m` : `${km.toFixed(1)} km`;
  },
};

// utils/validators.ts
export const validators = {
  email: (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },
  
  phone: (phone: string): boolean => {
    return /^[0-9]{10,11}$/.test(phone.replace(/\s/g, ''));
  },
};
```

---

### 8. **`src/theme/` - Design System**

**Neden?**
- Tutarlı design
- Easy theming (dark mode için)
- Centralized styling

**Örnek:**
```typescript
// theme/colors.ts
export const colors = {
  primary: {
    main: '#FF6B35',
    light: '#FF8C5A',
    dark: '#E55A2B',
  },
  secondary: {
    main: '#4A7C59',
    light: '#6B9B7A',
    dark: '#3A5F47',
  },
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    disabled: '#9CA3AF',
  },
  background: {
    default: '#FFFFFF',
    paper: '#F9FAFB',
  },
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
};

// theme/typography.ts
export const typography = {
  h1: { fontSize: 32, fontWeight: '700' as const },
  h2: { fontSize: 24, fontWeight: '700' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
};

// theme/spacing.ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
```

---

### 9. **`src/types/` - Shared Types**

**Neden?**
- Type reusability
- Single source of truth
- Better IntelliSense

**Örnek:**
```typescript
// types/store.types.ts
export interface Store {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  cuisine: string;
  deliveryFee: string;
  distance: string;
}

export interface StoreDetails extends Store {
  description: string;
  address: string;
  phone: string;
  openingHours: OpeningHours;
}

// types/api.types.ts
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
```

---

### 10. **`src/config/` - Configuration**

**Neden?**
- Environment variables
- App constants
- Route definitions

**Örnek:**
```typescript
// config/env.ts
export const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.motana.com',
  env: process.env.NODE_ENV || 'development',
  isDev: __DEV__,
};

// config/routes.ts
export const routes = {
  home: '/(tabs)/home',
  store: (id: string) => `/store/${id}`,
  orderTracking: (id: string) => `/order/tracking?id=${id}`,
} as const;
```

---

## 🔄 Migration Stratejisi

### Phase 1: Temel Yapı (Hemen)
1. ✅ `src/hooks/` oluştur, common hooks'ları taşı
2. ✅ `src/utils/` oluştur, helper functions'ları taşı
3. ✅ `src/types/` oluştur, shared types'ları taşı
4. ✅ `src/theme/` oluştur, `constants/colors.ts`'i genişlet

### Phase 2: GraphQL & State (Kısa vadede)
1. ✅ `src/graphql/` oluştur, Apollo Client setup yap
2. ✅ GraphQL Code Generator kurulumu
3. ✅ `src/stores/` oluştur, Zustand stores ekle
4. ✅ GraphQL queries/mutations yaz

### Phase 3: Feature Modules (Orta vadede)
1. ✅ `src/features/` oluştur
2. ✅ Her feature'ı kendi modülüne taşı
3. ✅ `src/components/ui/` base components ekle

### Phase 4: Polish (Uzun vadede)
1. ✅ Test structure ekle
2. ✅ Documentation
3. ✅ CI/CD setup

---

## 📝 Import Path Best Practices

**tsconfig.json'da path aliases:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/features/*": ["./src/features/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/services/*": ["./src/services/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/types/*": ["./src/types/*"],
      "@/theme/*": ["./src/theme/*"],
      "@/config/*": ["./src/config/*"]
    }
  }
}
```

**Kullanım:**
```typescript
// ✅ İyi
import { Button } from '@/components/ui/Button';
import { useStores } from '@/features/store/hooks/useStores';
import { formatPrice } from '@/utils/formatters';

// ❌ Kötü
import { Button } from '../../../components/ui/Button';
```

---

## 🎯 Öncelik Sırası

### 🔴 Yüksek Öncelik (Hemen yapılmalı)
1. `src/utils/` - Utility functions organize et
2. `src/types/` - Shared types organize et
3. `src/theme/` - Design system oluştur
4. `src/hooks/` - Common hooks extract et

### 🟡 Orta Öncelik (Kısa vadede)
1. `src/graphql/` - Apollo Client setup & GraphQL operations
2. `src/stores/` - Zustand stores ekle
3. `src/components/ui/` - Base components
4. GraphQL Code Generator kurulumu

### 🟢 Düşük Öncelik (Uzun vadede)
1. `src/features/` - Feature modules
2. `__tests__/` - Test structure
3. `docs/` - Documentation

---

## 💡 Ekstra Öneriler

### 1. **Component Naming Convention**
```
✅ Button.tsx
✅ StoreCard.tsx
✅ ProductDetailModal.tsx

❌ button.tsx
❌ store-card.tsx
```

### 2. **File Organization Pattern**
Her component için:
```
ComponentName/
├── ComponentName.tsx
├── ComponentName.types.ts
├── ComponentName.styles.ts
├── ComponentName.test.tsx
└── index.ts
```

### 3. **Barrel Exports (index.ts)**
```typescript
// components/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Card } from './Card';
```

### 4. **Constants Organization**
```typescript
// utils/constants.ts
export const DELIVERY_FEE = 15;
export const SERVICE_FEE = 5;
export const MIN_ORDER_AMOUNT = 50;

// config/routes.ts
export const ROUTES = {
  HOME: '/(tabs)/home',
  STORE: (id: string) => `/store/${id}`,
} as const;
```

---

## 📦 GraphQL + Apollo Gerekli Paketler

### Installation:
```bash
# Apollo Client
npm install @apollo/client graphql

# GraphQL Code Generator (dev dependency)
npm install -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-apollo
```

### Package.json'a ekle:
```json
{
  "dependencies": {
    "@apollo/client": "^3.8.0",
    "graphql": "^16.8.0"
  },
  "devDependencies": {
    "@graphql-codegen/cli": "^5.0.0",
    "@graphql-codegen/typescript": "^4.0.0",
    "@graphql-codegen/typescript-operations": "^4.0.0",
    "@graphql-codegen/typescript-react-apollo": "^4.0.0"
  },
  "scripts": {
    "codegen": "graphql-codegen --config codegen.yml",
    "codegen:watch": "graphql-codegen --config codegen.yml --watch"
  }
}
```

### codegen.yml Örneği:
```yaml
schema: ${GRAPHQL_URL}/graphql
# veya local schema dosyası:
# schema: src/graphql/schema.graphql

documents: 'src/graphql/**/*.{ts,tsx}'

generates:
  src/graphql/generated/types.ts:
    plugins:
      - typescript
      - typescript-operations
      - typescript-react-apollo
    config:
      withHooks: true
      withComponent: false
      withHOC: false
      skipTypename: false
      apolloClientVersion: 3
      scalars:
        DateTime: string
        JSON: any
```

### Environment Variables (.env):
```env
EXPO_PUBLIC_GRAPHQL_URL=https://api.motana.com/graphql
GRAPHQL_URL=https://api.motana.com/graphql
```

---

## 🔄 Apollo Client Best Practices

### 1. **Cache Management**
```typescript
// graphql/cache.ts
import { InMemoryCache, FieldPolicy } from '@apollo/client';

export const cacheConfig = {
  typePolicies: {
    Query: {
      fields: {
        stores: {
          keyArgs: ['filter'],
          merge(existing = [], incoming, { args }) {
            // Pagination için merge logic
            if (args?.offset === 0) {
              return incoming;
            }
            return [...existing, ...incoming];
          },
        },
        orders: {
          keyArgs: ['status'],
          merge(existing = [], incoming) {
            return incoming;
          },
        },
      },
    },
    Store: {
      fields: {
        menuItems: {
          merge(existing = [], incoming) {
            return incoming;
          },
        },
      },
    },
  },
};
```

### 2. **Error Handling**
```typescript
// graphql/links/errorLink.ts
import { onError } from '@apollo/client/link/error';
import { GraphQLError } from 'graphql';

export const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach((error: GraphQLError) => {
      switch (error.extensions?.code) {
        case 'UNAUTHENTICATED':
          // Token refresh logic
          break;
        case 'FORBIDDEN':
          // Redirect to login
          break;
        default:
          console.error(`[GraphQL error]: ${error.message}`);
      }
    });
  }
  
  if (networkError) {
    if (networkError.statusCode === 401) {
      // Handle unauthorized
    }
    console.error(`[Network error]: ${networkError}`);
  }
});
```

### 3. **Optimistic Updates**
```typescript
// features/cart/hooks/useAddToCart.ts
import { useMutation } from '@apollo/client';
import { ADD_TO_CART } from '@/graphql/mutations/cart.mutations';

export function useAddToCart() {
  const [addToCart, { loading }] = useMutation(ADD_TO_CART, {
    optimisticResponse: {
      addToCart: {
        __typename: 'CartItem',
        id: 'temp-id',
        // ... optimistic data
      },
    },
    update(cache, { data }) {
      // Cache'i manuel güncelle
      cache.modify({
        fields: {
          cart(existingCart = []) {
            const newItemRef = cache.writeFragment({
              data: data?.addToCart,
              fragment: gql`
                fragment NewCartItem on CartItem {
                  id
                  quantity
                }
              `,
            });
            return [...existingCart, newItemRef];
          },
        },
      });
    },
  });

  return { addToCart, loading };
}
```

### 4. **Subscriptions (Real-time)**
```typescript
// graphql/subscriptions/order.subscriptions.ts
import { gql } from '@apollo/client';

export const ORDER_STATUS_UPDATED = gql`
  subscription OrderStatusUpdated($orderId: ID!) {
    orderStatusUpdated(orderId: $orderId) {
      id
      status
      estimatedTime
    }
  }
`;

// features/order/hooks/useOrderStatus.ts
import { useSubscription } from '@apollo/client';
import { ORDER_STATUS_UPDATED } from '@/graphql/subscriptions/order.subscriptions';

export function useOrderStatus(orderId: string) {
  const { data, loading } = useSubscription(ORDER_STATUS_UPDATED, {
    variables: { orderId },
    skip: !orderId,
  });

  return {
    order: data?.orderStatusUpdated,
    loading,
  };
}
```

---

## 🚀 Sonuç

Bu yapı ile:
- ✅ Scalable (büyüyebilir)
- ✅ Maintainable (bakımı kolay)
- ✅ Testable (test edilebilir)
- ✅ Team-friendly (takım çalışmasına uygun)
- ✅ Type-safe (TypeScript + GraphQL Code Generator)
- ✅ GraphQL + Apollo optimized
- ✅ Real-time updates (subscriptions)

**Not:** Tüm değişiklikleri bir anda yapmak zorunda değilsiniz. Adım adım, feature bazında migrate edebilirsiniz.

**GraphQL Avantajları:**
- ✅ Type-safe queries/mutations
- ✅ Otomatik type generation
- ✅ Efficient data fetching (sadece ihtiyaç olan field'lar)
- ✅ Real-time subscriptions
- ✅ Apollo cache management

