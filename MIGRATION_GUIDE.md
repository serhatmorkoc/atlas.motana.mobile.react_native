# 📦 Klasör Taşıma Rehberi

## ✅ Tamamlanan Taşımalar

Aşağıdaki klasörler `src/` altına taşındı:
- ✅ `contexts/` → `src/contexts/`
- ✅ `mocks/` → `src/mocks/`
- ✅ `constants/` → `src/constants/`

## ⚠️ Manuel Taşıma Gereken

`components/` klasörü dosyalar açık olduğu için otomatik taşınamadı. Lütfen manuel olarak taşıyın:

### Windows (PowerShell):
```powershell
# Tüm component dosyalarını kapatın, sonra:
Move-Item -Path "components" -Destination "src\components" -Force
```

### Veya manuel olarak:
1. Tüm component dosyalarını kapatın (IDE'de)
2. `components` klasörünü `src/` altına taşıyın
3. Projeyi yeniden başlatın

## 📝 Notlar

- `app/` klasörü **root'ta kalmalı** (Expo Router zorunlu)
- `assets/` klasörü **root'ta kalmalı** (Expo convention)
- Tüm import'lar `@/` alias'ı ile çalışıyor, değişiklik gerekmiyor
- `tsconfig.json` path mapping'leri güncellendi

## 🔍 Kontrol

Taşıma sonrası projeyi çalıştırın:
```bash
npm start
# veya
bun run start
```

Eğer import hataları görürseniz, IDE'yi yeniden başlatın (TypeScript server'ı yenilemek için).

