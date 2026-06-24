# Online Web Editor

Онлайн-редактор **HTML · CSS · JavaScript** с живым предпросмотром. Неоновый интерфейс, адаптивная вёрстка, автосохранение в браузере — готов к развёртыванию на GitHub Pages без сборки.

**Live:** [html.spirzen.ru](https://html.spirzen.ru/)

![Online Web Editor](https://img.shields.io/badge/Online-Web%20Editor-00f5ff?style=for-the-badge)
![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-ff2d95?style=for-the-badge)
![License MIT](https://img.shields.io/badge/License-MIT-a855f7?style=for-the-badge)

---

## Возможности

- **Три вкладки** — HTML, CSS и JavaScript с подсветкой синтаксиса (Ace Editor)
- **Live Preview** — предпросмотр обновляется автоматически при вводе
- **Адаптивный layout** — на десктопе редактор слева, превью справа; на мобильных — вертикально
- **Изменяемые панели** — перетаскивайте разделитель или используйте клавиши ← →
- **Автосохранение** — код хранится в `localStorage` браузера
- **Экспорт** — скачайте результат одним HTML-файлом
- **Горячие клавиши**
  - `Ctrl+Enter` — обновить предпросмотр
  - `Ctrl+S` — сохранить локально

## Быстрый старт

Клонировать и открыть локально — достаточно любого статического сервера или просто двойной клик по `index.html`:

```bash
git clone https://github.com/Spirzen/WebEditor.git
cd WebEditor
```

Для локального сервера (опционально):

```bash
npx serve .
# или
python -m http.server 8080
```

Откройте `http://localhost:8080` в браузере.

## Развёртывание на GitHub Pages

Проект уже настроен для автоматического деплоя через GitHub Actions.

### 1. Включите GitHub Pages

1. Откройте **Settings → Pages** в репозитории
2. В разделе **Build and deployment** выберите **Source: GitHub Actions**

### 2. Запушьте в `main`

При каждом push в ветку `main` workflow `.github/workflows/deploy.yml` автоматически опубликует сайт.

```bash
git add .
git commit -m "feat: add Online Web Editor"
git push origin main
```

Сайт доступен по адресу:

```
https://html.spirzen.ru/
```

## Структура проекта

```
WebEditor/
├── index.html              # Главная страница редактора
├── assets/
│   ├── css/
│   │   └── app.css         # Стили интерфейса
│   └── js/
│       └── app.js          # Логика редактора и предпросмотра
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD для GitHub Pages
├── .gitignore
├── LICENSE
└── README.md
```

## Технологии

| Компонент | Технология |
|-----------|-----------|
| Редактор кода | [Ace Editor](https://ace.c9.io/) |
| Стили UI | Vanilla CSS (custom properties, neon theme) |
| Логика | Vanilla JavaScript |
| Деплой | GitHub Actions + GitHub Pages |
| Шрифты | [Outfit](https://fonts.google.com/specimen/Outfit), [JetBrains Mono](https://www.jetbrains.com/lp/mono/) |

## Лицензия

[MIT](LICENSE) © 2026 Spirzen
