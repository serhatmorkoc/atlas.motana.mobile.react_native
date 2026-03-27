# Supabase Email Confirmation'ı Kapatma

Kayıt olan kullanıcıların otomatik olarak aktif olması için email confirmation'ı kapatma rehberi.

---

## 📋 Adım Adım Rehber

### Adım 1: Supabase Dashboard'a Giriş

1. [Supabase Dashboard](https://app.supabase.com) adresine gidin
2. Projenize giriş yapın

### Adım 2: Authentication → Providers'a Git

1. Sol menüden **Authentication** seçin
2. Üst menüden **Providers** (veya **Sign in / Providers**) sekmesine tıklayın
3. **Email** provider'ını bulun ve tıklayın

### Adım 3: Email Confirmation'ı Kapat

**Email** provider ayarlarında:
- **"Confirm Email"** (veya **"Enable email confirmations"**) toggle'ını **KAPALI** yapın

```
☐ Confirm Email
```

**Alternatif Yol:**
Eğer yukarıdaki yolu bulamazsanız:
1. **Authentication** → **Settings** (veya **Configuration**)
2. **Auth Settings** bölümünde **"Enable email confirmations"** toggle'ını kapatın

### Adım 4: Kaydet

1. **Save** butonuna tıklayın
2. Değişiklikler hemen aktif olur

---

## ✅ Sonuç

Artık kullanıcılar kayıt olduğunda:
- ✅ Email confirmation gerekmeyecek
- ✅ Otomatik olarak aktif olacaklar
- ✅ Hemen giriş yapabilecekler

---

## ⚠️ Önemli Notlar

1. **Güvenlik**: Email confirmation kapalıyken, herkes geçerli bir email ile kayıt olabilir. Production'da dikkatli olun.

2. **Test**: Değişikliklerden sonra yeni bir kullanıcı ile test edin.

3. **Mevcut Kullanıcılar**: Bu ayar sadece yeni kayıtları etkiler. Mevcut kullanıcıların durumu değişmez.

---

## 🔄 Alternatif: Sadece Development'ta Kapat

Eğer sadece development ortamında email confirmation'ı kapatmak istiyorsanız:

1. Supabase Dashboard'da **Settings** → **API** → **Project Settings**
2. **Auth Settings** bölümünde
3. Development için ayrı bir proje kullanabilirsiniz

---

Sorun yaşarsanız, Supabase Dashboard'daki ayarları kontrol edin! 🚀
