# Kalendarz wypłat i dni robocze (ZUS / API)

## ZUS a API

**ZUS nie udostępnia publicznego API** z harmonogramem wypłat. Terminy są ustalane regulaminowo (np. 1., 5., 6., 10., 15., 20. i 25. dzień miesiąca dla emerytur). Aplikacja:

- przechowuje **reguły** w `data/payments.json` (np. `schedule`, dni miesiąca),
- **oblicza** następną datę wypłaty na podstawie tych reguł,
- **koryguje** datę o polskie dni wolne: gdy termin wypłaty przypada na sobotę, niedzielę lub święto, ZUS wypłaca w **ostatnim dniu roboczym poprzedzającym** ten dzień.

Dane o wypłatach są więc „jak z ZUS” (zgodne z ich harmonogramem), ale **nie pochodzą z API ZUS** – są wyliczane lokalnie z uwzględnieniem dni roboczych.

## Dni wolne od pracy (Polska)

- **Źródło świąt:** [Nager.Date API](https://date.nager.at) (kraj: PL). Bez klucza API, bez limitu.
- **Plik w projekcie:** `src/data/polish-holidays.json` – lista dat świąt w formacie `YYYY-MM-DD`.
- **Aktualizacja:**  
  `npm run update-holidays`  
  Zapis do `src/data/polish-holidays.json`. Opcjonalnie: `START_YEAR=2022 END_YEAR=2030 node scripts/update-polish-holidays.mjs`

Dni uznawane za **nierobocze**:

- sobota i niedziela,
- daty z `src/data/polish-holidays.json` (święta państwowe).

## Logika w kodzie

- **`src/lib/polish-working-days.ts`**  
  - `isWorkingDay(date)` – czy dzień jest roboczy (nie weekend, nie święto),  
  - `toPreviousWorkingDay(date)` – zwraca ostatni dzień roboczy ≤ `date` (używane do korekty terminu wypłaty).

- **`src/lib/payments.ts`**  
  - `getEffectiveNextPayment(payment, refDate)` najpierw wyznacza **nominalny** następny termin (z harmonogramu), a potem zwraca **faktyczną** datę wypłaty po korekcie: `toPreviousWorkingDay(nominalDate)`.

Dzięki temu kalendarz wypłat (banner „najbliższa wypłata”, karty świadczeń, strony benefitów) pokazuje **realne terminy wypłat** z pominięciem polskich dni wolnych.

## Aktualizacja „kalendarza dochodów”

- **Aktualizacja z API ZUS:** niemożliwa – brak takiego API.
- **Aktualizacja reguł:** edycja `data/payments.json` (nowe świadczenia, zmiana harmonogramu).
- **Aktualizacja świąt:** `npm run update-holidays` (pobiera bieżące święta z Nager.Date i nadpisuje `src/data/polish-holidays.json`).

Ewentualne rozszerzenia:

- **Strona / kalendarz** z listą wypłat na kolejne miesiące: wywołać `getEffectiveNextPayment` w pętli (np. dla każdego miesiąca) i pogrupować po dacie.
- **API route** (np. `/api/next-payments`) zwracające JSON z następnymi wypłatami po dacie – z użyciem tej samej logiki i `getEffectiveNextPayment`.
