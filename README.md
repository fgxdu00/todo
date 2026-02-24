# Taska ✦

A clean, minimal to-do list app built with vanilla HTML, CSS, and JavaScript.

## Features

- **Add tasks** with a title and priority level (Low / Medium / High)
- **Complete tasks** by checking them off
- **Edit tasks** via an inline modal dialog
- **Delete tasks** individually or clear all completed at once
- **Filter tasks** — All, Active, or Completed
- Responsive layout for mobile and desktop
- Fully accessible keyboard navigation

## Tech Stack

| Layer | Technology |
|-------|------------|
| Markup | HTML5 (semantic elements) |
| Styles | CSS3 (custom properties, flexbox, animations) |
| Logic | Vanilla JavaScript (ES6+) |
| Storage | `localStorage` |

No frameworks. No build tools. No dependencies.

## Getting Started

Just open `index.html` in a browser — that's it.

```bash
git clone https://github.com/your-username/taska.git
cd taska
open index.html
```

## Project Structure

```
taska/
├── index.html   # App markup and structure
├── style.css    # All styles and animations
├── app.js       # Business logic and DOM manipulation
└── README.md
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Submit new task |
| `Esc` | Close edit modal |
| `Ctrl + Enter` | Save edited task |