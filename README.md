# Currency Tracker

---

## Описание проекта

**Currency Tracker** — это SPA-приложение для:
- Отслеживания курсов различных валют
- Конвертации валют в реальном времени
- Просмотра динамики курса за последние 7 дней

---

## Описание решения

### Использованные технологии

- **Фреймворк:** Vue 3 (Composition API)
- **Язык программирования:** TypeScript
- **Управление состоянием приложения:** Pinia
- **Библиотеки компонентов:** Vuetify и ECharts

API с информацией о курсах валют: [Open Exchange Rates](https://openexchangerates.org/)

---

### Компоненты

Приложение разбито на следующие компоненты:
- **CurrencyList** — список валют с возможностью поиска и сортировки
- **CurrencyConverter** — конвертер валют с историей конвертаций
- **ConversionHistoryModal** — модальное окно с сохранённой историей конвертаций (Local Storage)
- **CurrencyChart** — график динамики курса выбранной валюты за последние 7 дней (данные кэшируются)
- **SelectCurrency** — UI-компонент для выбора валюты по коду

---

### Хранилища состояний

Используются хранилища Pinia:
- **currencyStore** — загружает список валют и хранит их текущие курсы.
- **historyStore** — управляет историей конвертаций, сохраняет данные в Local Storage.
- **historicalRatesStore** — загружает и кэширует исторические данные курсов валют по дням.

---

## Инструкция по запуску

### 1. Установите необходимые зависимости

```bash
    npm install
```

### 2. Создайте и настройте .env файл

Скопируйте пример и подставьте ID своего приложения с [Open Exchange Rates](https://openexchangerates.org/):

```bash
   cp .env.example .env
```

Пример содержимого .env:
```
VITE_APP_OPEN_EXCHANGE_APP_ID=your_app_id_here
VITE_API_BASE_URL=https://openexchangerates.org/api/
```

### 3. Запустите локальный сервер с приложением

production-сервер ***(http://localhost:4173)***

```bash
    npm run preview
```

или dev-сервер ***(http://localhost:5173)***

```bash
    npm run dev
```

