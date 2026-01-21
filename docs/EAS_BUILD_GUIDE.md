# 📱 EAS Build ile iOS/Android Publish Rehberi

Bu döküman, Windows veya Linux bilgisayardan Mac'e ihtiyaç duymadan iOS ve Android uygulamalarını build alıp App Store ve Google Play'e yüklemeyi açıklar.

---

## 📋 İçindekiler

1. [Gereksinimler](#gereksinimler)
2. [EAS CLI Kurulumu](#eas-cli-kurulumu)
3. [Proje Yapılandırması](#proje-yapılandırması)
4. [iOS Build](#ios-build)
5. [Android Build](#android-build)
6. [App Store'a Yükleme](#app-storea-yükleme)
7. [Google Play'e Yükleme](#google-playe-yükleme)
8. [OTA Updates](#ota-updates)
9. [CI/CD Entegrasyonu](#cicd-entegrasyonu)
10. [Sorun Giderme](#sorun-giderme)

---

## Gereksinimler

### Hesaplar
- [ ] **Expo Hesabı** - [expo.dev](https://expo.dev) (Ücretsiz)
- [ ] **Apple Developer Hesabı** - [developer.apple.com](https://developer.apple.com) ($99/yıl - iOS için)
- [ ] **Google Play Developer Hesabı** - [play.google.com/console](https://play.google.com/console) ($25 tek seferlik - Android için)

### Yazılımlar
- Node.js 18+
- npm veya yarn
- Git

---

## EAS CLI Kurulumu

### 1. EAS CLI'ı Global Olarak Kur

```bash
npm install -g eas-cli
```

### 2. Expo Hesabına Giriş Yap

```bash
eas login
```

E-posta ve şifre ile giriş yap. Hesabın yoksa [expo.dev](https://expo.dev/signup) adresinden oluştur.

### 3. Giriş Durumunu Kontrol Et

```bash
eas whoami
```

---

## Proje Yapılandırması

### 1. EAS'i Projeye Bağla

```bash
eas build:configure
```

Bu komut:
- `eas.json` dosyasını oluşturur
- `app.json`'da gerekli alanları ekler
- Projeyi Expo dashboard'a kaydeder

### 2. eas.json Dosyası

Proje kökünde `eas.json` dosyası oluşturulacak:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 3. app.json Güncellemesi

`app.json` dosyasında şu alanların dolu olduğundan emin ol:

```json
{
  "expo": {
    "name": "Motana",
    "slug": "motana",
    "version": "1.0.0",
    "owner": "your-expo-username",
    "ios": {
      "bundleIdentifier": "com.yourcompany.motana",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.yourcompany.motana",
      "versionCode": 1
    }
  }
}
```

---

## iOS Build

### Profiller

| Profil | Kullanım | Dağıtım |
|--------|----------|---------|
| `development` | Geliştirme/Test | Simulator + Kayıtlı cihazlar |
| `preview` | Internal test | TestFlight benzeri |
| `production` | App Store | Herkes |

### Development Build (Test için)

```bash
eas build --platform ios --profile development
```

### Preview Build (Internal Test)

```bash
eas build --platform ios --profile preview
```

### Production Build (App Store için)

```bash
eas build --platform ios --profile production
```

### İlk Build'de Yapılacaklar

İlk iOS build'inde EAS sana şunları soracak:

1. **Apple Developer hesabı bağlantısı**
   - Apple ID ve şifre gir
   - 2FA kodu gir (varsa)

2. **Bundle Identifier seçimi**
   - Yeni oluştur veya mevcut olanı seç

3. **Provisioning Profile**
   - EAS otomatik oluşturur

4. **Distribution Certificate**
   - EAS otomatik oluşturur

> 💡 Tüm sertifikalar EAS tarafından yönetilir, manuel işlem gerekmez!

---

## Android Build

### Development Build

```bash
eas build --platform android --profile development
```

### Preview Build (APK)

```bash
eas build --platform android --profile preview
```

### Production Build (AAB - Google Play için)

```bash
eas build --platform android --profile production
```

### Keystore Yönetimi

İlk Android build'inde EAS otomatik olarak:
- Upload Keystore oluşturur
- Güvenli şekilde saklar
- Her build'de kullanır

> ⚠️ Keystore kaybedilirse uygulama güncellenemez! EAS bunu sizin için güvenle saklar.

---

## App Store'a Yükleme

### 1. Build Al (Production)

```bash
eas build --platform ios --profile production
```

### 2. App Store Connect'e Gönder

Build tamamlandıktan sonra:

```bash
eas submit --platform ios
```

Veya build ile birlikte:

```bash
eas build --platform ios --profile production --auto-submit
```

### 3. App Store Connect'te Yapılacaklar

1. [App Store Connect](https://appstoreconnect.apple.com)'e giriş yap
2. "My Apps" > Uygulamanı seç
3. "App Store" sekmesinde:
   - Screenshots ekle
   - Açıklama yaz
   - Kategorileri seç
   - Fiyatlandırma ayarla
4. "Submit for Review" butonuna tıkla

---

## Google Play'e Yükleme

### 1. Build Al (Production)

```bash
eas build --platform android --profile production
```

### 2. Google Play'e Gönder

```bash
eas submit --platform android
```

### İlk Yüklemede

1. Google Play Console'da uygulama oluştur
2. Service Account oluştur:
   - Google Cloud Console > IAM > Service Accounts
   - JSON key indir
3. EAS'e service account ekle:
   ```bash
   eas credentials
   ```

---

## OTA Updates

Kod değişikliklerini **yeni build almadan** yayınla:

### Update Gönder

```bash
# Preview branch'e update
eas update --branch preview --message "Bug fix"

# Production branch'e update
eas update --branch production --message "v1.0.1 hotfix"
```

### eas.json'a Update Konfigürasyonu Ekle

```json
{
  "build": {
    "production": {
      "channel": "production"
    },
    "preview": {
      "channel": "preview"
    }
  }
}
```

> 💡 OTA Updates sadece JavaScript değişikliklerini günceller. Native kod değişiklikleri için yeni build gerekir.

---

## CI/CD Entegrasyonu

### GitHub Actions Örneği

`.github/workflows/eas-build.yml`:

```yaml
name: EAS Build

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 18.x
          cache: npm

      - name: Setup EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Install dependencies
        run: npm ci

      - name: Build iOS
        run: eas build --platform ios --profile production --non-interactive

      - name: Build Android
        run: eas build --platform android --profile production --non-interactive
```

### EXPO_TOKEN Oluşturma

1. [expo.dev/accounts/[username]/settings/access-tokens](https://expo.dev/accounts) adresine git
2. "Create Token" tıkla
3. Token'ı GitHub Secrets'a ekle: `EXPO_TOKEN`

---

## Sorun Giderme

### Sık Karşılaşılan Hatalar

#### 1. "Invalid credentials"
```bash
eas credentials
# Apple hesap bilgilerini güncelle
```

#### 2. "Bundle identifier already exists"
- App Store Connect'te aynı bundle ID ile uygulama var
- Farklı bir bundle ID kullan veya mevcut uygulamayı sil

#### 3. "Provisioning profile not found"
```bash
eas credentials --platform ios
# "Remove" seçip yeniden oluştur
```

#### 4. Build başarısız
```bash
# Build loglarını kontrol et
eas build:list
# Son build'in ID'sini al ve logları görüntüle
eas build:view [BUILD_ID]
```

### Faydalı Komutlar

```bash
# Tüm build'leri listele
eas build:list

# Build durumunu kontrol et
eas build:view

# Credentials yönetimi
eas credentials

# Projeyi Expo dashboard'da aç
eas project:info

# Cache temizle ve yeniden build
eas build --clear-cache --platform ios
```

---

## Fiyatlandırma

### EAS Build

| Plan | Fiyat | Build/Ay | Öncelik |
|------|-------|----------|---------|
| Free | $0 | 30 | Düşük (15-30 dk) |
| Production | $99/ay | Sınırsız | Yüksek (5-15 dk) |
| Enterprise | Özel | Sınırsız | En yüksek |

### Tahmini Build Süreleri

| Platform | İlk Build | Sonraki Build'ler |
|----------|-----------|-------------------|
| iOS | 15-30 dk | 10-20 dk |
| Android | 10-20 dk | 5-15 dk |

> 💡 Free plan çoğu indie geliştirici için yeterlidir. Ayda 30 build = günde ~1 build.

---

## Hızlı Başlangıç Checklist

- [ ] `npm install -g eas-cli`
- [ ] `eas login`
- [ ] `eas build:configure`
- [ ] `app.json` içinde `bundleIdentifier` ve `package` ayarla
- [ ] Apple Developer hesabı hazırla ($99/yıl)
- [ ] `eas build --platform ios --profile production`
- [ ] `eas submit --platform ios`
- [ ] App Store Connect'te uygulama bilgilerini doldur
- [ ] Review'a gönder

---

## Kaynaklar

- 📚 [EAS Build Dokümantasyonu](https://docs.expo.dev/build/introduction/)
- 📚 [EAS Submit Dokümantasyonu](https://docs.expo.dev/submit/introduction/)
- 📚 [EAS Update Dokümantasyonu](https://docs.expo.dev/eas-update/introduction/)
- 🎥 [Expo YouTube Kanalı](https://www.youtube.com/c/exposition)
- 💬 [Expo Discord](https://chat.expo.dev/)

---

*Son güncelleme: Ocak 2026*
