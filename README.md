# Kiedy Wypłata 🇵🇱

Aplikacja webowa do sprawdzania terminów wypłat świadczeń społecznych w Polsce.

## 🎯 Funkcje

- **Terminy wypłat**: Aktualne daty wypłat 800+, emerytur ZUS, zasiłków i innych świadczeń
- **Przejrzyste URL-e**: Kategorie dostępne pod krótkimi adresami (`/family`, `/pension`)
- **Strony szczegółowe**: Każde świadczenie ma dedykowaną stronę (`/benefit/800plus`)
- **Kategoryzacja**: Podział na kategorie (rodzinne, emerytury, zasiłki, socjalne)
- **Responsywność**: Pełne wsparcie dla urządzeń mobilnych
- **SEO**: Zoptymalizowane meta tagi i struktura dla wyszukiwarek
- **AdSense**: Gotowa integracja z Google AdSense
- **Statyczne generowanie**: Szybkie ładowanie dzięki SSG w Next.js


## �️ Struktura URL

### **Kategorie** (krótkie URL-e)
- `/family` - Świadczenia rodzinne (800+, zasiłki rodzinne)
- `/pension` - Emerytury i renty (ZUS, KRUS, 13/14 emerytura)
- `/benefits` - Zasiłki (chorobowe, macierzyńskie)
- `/social` - Świadczenia socjalne (dodatek węglowy, etc.)

### **Szczegóły świadczeń**
- `/benefit/800plus` - Szczegóły świadczenia 800+
- `/benefit/emerytura` - Szczegóły emerytury ZUS
- `/benefit/zasilek-chorobowy` - Szczegóły zasiłku chorobowego
- itd.

## �📁 Struktura projektu

```
├── data/
│   └── payments.json          # Dane o wypłatach
├── src/
│   ├── app/
│   │   ├── [category]/        # 🆕 Kategorie: /family, /pension, etc.
│   │   │   ├── page.tsx
│   │   │   └── page.scss
│   │   ├── benefit/[benefit]/ # 🆕 Szczegóły: /benefit/800plus
│   │   │   ├── page.tsx
│   │   │   └── page.scss
│   │   ├── globals.scss       # Globalne style SCSS
│   │   ├── layout.tsx         # Layout aplikacji
│   │   └── page.tsx           # Strona główna
│   ├── components/
│   │   ├── payment-card/      # Karta wypłaty (BEM) z linkami
│   │   ├── next-payment-banner/ # Banner najbliższej wypłaty
│   │   ├── category-grid/     # Siatka kategorii
│   │   └── adsense/          # Komponenty AdSense
│   └── types/
│       └── payment.ts         # Typy TypeScript
└── public/
    └── adsense.html          # Przykład integracji AdSense
```

## 🚀 Uruchomienie

### Wymagania
- Node.js 18+ 
- npm/yarn/pnpm

### Instalacja

```bash
# Zainstaluj zależności
npm install

# Uruchom serwer deweloperski
npm run dev
```

Aplikacja będzie dostępna pod adresem: http://localhost:3000

### Budowanie produkcyjne

```bash
# Zbuduj aplikację
npm run build

# Uruchom wersję produkcyjną
npm start
```

## 🎨 Stylowanie z BEM

Projekt używa metodologii BEM dla CSS:

```scss
// Blok
.payment-card { }

// Element
.payment-card__title { }
.payment-card__description { }

// Modyfikator
.payment-card--upcoming { }
.payment-card--past { }
```


## 🚀 Wdrożenie

### Vercel (Zalecane)

```bash
# Zainstaluj Vercel CLI
npm i -g vercel

# Wdróż aplikację
vercel
```

## 📄 Licencja

MIT License - możesz swobodnie wykorzystywać w projektach komercyjnych.

---

**Kiedy Wypłata** - Zawsze na bieżąco z terminami wypłat w Polsce! 🇵🇱
