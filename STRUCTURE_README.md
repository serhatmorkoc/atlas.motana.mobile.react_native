# 📁 Source Code Structure

Bu klasör, projenin organize edilmiş kaynak kodlarını içerir.

## 📂 Klasör Yapısı

```
src/
├── graphql/          # GraphQL + Apollo Client (şu an placeholder)
├── utils/            # Utility functions
├── types/            # Shared TypeScript types
├── theme/            # Design system (colors, typography, spacing)
├── hooks/            # Custom React hooks
└── config/           # Configuration (env, routes)
```

## 🚀 Kullanım

### Utils
```typescript
import { formatPrice, formatDate, formatDistance } from '@/utils';
import { isValidEmail, isValidPhone } from '@/utils/validators';
import { debounce, generateId } from '@/utils/helpers';
import { DELIVERY_FEE, SERVICE_FEE } from '@/utils/constants';
```

### Types
```typescript
import { Store, StoreDetails } from '@/types/store.types';
import { MenuItem, MenuItemExtra } from '@/types/menu.types';
import { Order, OrderStatus } from '@/types/order.types';
import { CartItem, CartStoreGroup } from '@/types/cart.types';
```

### Theme
```typescript
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { shadows } from '@/theme/shadows';
```

### Hooks
```typescript
import { useDebounce } from '@/hooks/useDebounce';
import { useAsyncStorage } from '@/hooks/useAsyncStorage';
```

### Config
```typescript
import { config } from '@/config/env';
import { routes } from '@/config/routes';
```

## 📝 Notlar

- **GraphQL klasörü**: Şu an placeholder dosyalar içeriyor. GraphQL entegrasyonu yapıldığında aktif hale gelecek.
- **Zustand**: Şu an kullanılmıyor, Context API ile devam ediliyor.
- **Path Aliases**: `tsconfig.json`'da tanımlı, `@/` ile erişilebilir.

