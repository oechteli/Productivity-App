# 🎯 FocusFlow - Die letzte Produktivitäts-App, die du jemals brauchen wirst

Eine moderne, intuitive To-Do App für Overwhelmed Professionals, die Einfachheit ohne Funktionsverlust wollen.

## ✨ Features

- **🎯 Einfache Bedienung:** Intuitive UI ohne Lernkurve
- **📅 Intelligente Kalenderintegration:** Drag & Drop zwischen Todos und Kalender
- **🏷️ Kategorisierung:** Farbige Kategorien für bessere Organisation
- **⚡ Natural Language Processing:** "Call mom tomorrow at 3pm #personal !high"
- **🔄 Real-time Sync:** Sofortige Synchronisation zwischen allen Geräten
- **📊 Gentle Analytics:** Produktivitäts-Insights ohne Overwhelm
- **🌙 Dark/Light Mode:** Automatische Theme-Anpassung
- **📱 Mobile-First:** Optimiert für alle Geräte

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS + HeadlessUI + Framer Motion
- **UI Components:** shadcn/ui
- **State Management:** Zustand
- **Form Handling:** React Hook Form + Zod validation
- **Date/Time:** date-fns
- **Icons:** Lucide React
- **Drag & Drop:** @dnd-kit/core

### Backend & Database
- **Database:** Supabase (PostgreSQL + Real-time + Auth)
- **API:** Next.js API Routes + Server Actions
- **File Storage:** Supabase Storage
- **Real-time:** Supabase Realtime subscriptions

### Development Tools
- **TypeScript:** Vollständig typisiert
- **ESLint + Prettier:** Code formatting
- **Husky:** Git hooks
- **Commitizen:** Conventional commits

### Deployment
- **Hosting:** Vercel
- **Analytics:** Vercel Analytics

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm oder yarn
- Git

### Installation

1. **Repository klonen:**
```bash
git clone <repository-url>
cd focusflow-todo-app
```

2. **Dependencies installieren:**
```bash
npm install
```

3. **Environment Variables setup:**
```bash
cp .env.example .env.local
```
Fülle die Supabase-Konfiguration in `.env.local` aus.

4. **Development Server starten:**
```bash
npm run dev
```

5. **Browser öffnen:**
```
http://localhost:3000
```

## 📁 Project Structure

```
focusflow-todo-app/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Main app pages
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/             # Reusable components
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components
│   ├── todo/              # Todo-specific components
│   └── calendar/          # Calendar components
├── lib/                   # Utilities and configurations
│   ├── supabase/          # Supabase client
│   ├── utils/             # Helper functions
│   └── validations/       # Zod schemas
├── types/                 # TypeScript type definitions
├── hooks/                 # Custom React hooks
├── store/                 # Zustand stores
└── public/                # Static assets
```

## 🎨 Design System

### Farbpalette
- **Primary:** #4F80FF (Warmes Blau)
- **Secondary:** #00D084 (Erfolgs-Grün)
- **Accent:** #F3F4F6 (Light Gray)
- **Warning:** #FFB800 (Deadline-Gelb)
- **Error:** #EF4444 (Fehler-Rot)

### Typography
- **Headlines:** Inter (Google Fonts)
- **Body:** System fonts
- **Playful:** Hand-drawn style für CTAs

## 📱 App-Architektur

### Core Pages
- **Landing Page:** Marketing und Onboarding
- **Authentication:** Login/Signup mit Social Auth
- **Dashboard:** Haupt-App mit 3-Column Layout
- **Todo List:** Haupt-Todo-Interface
- **Calendar:** Kalender-Integration
- **Settings:** Benutzereinstellungen
- **Analytics:** Produktivitäts-Insights (Premium)

### Features
- **Quick Add:** Natural language processing
- **Categories:** Farbige Kategorisierung
- **Priorities:** 4-Level Prioritätssystem
- **Subtasks:** Hierarchische Todo-Struktur
- **Due Dates:** Intelligente Datumsverarbeitung
- **Real-time Sync:** Sofortige Synchronisation
- **Drag & Drop:** Intuitive Interaktionen

## 💰 Pricing Tiers

### Free Tier
- 100 active todos
- 3 categories
- Basic calendar
- 1 device sync

### Premium (€4.99/Monat)
- Unlimited todos
- Unlimited categories
- Advanced calendar
- AI suggestions
- Multi-device sync
- File attachments
- Analytics

### Pro (€9.99/Monat)
- Team collaboration
- Advanced analytics
- API access
- Priority support
- White-label options

## 🧪 Development

### Available Scripts
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint check
npm run type-check   # TypeScript check
npm run test         # Run tests
```

### Code Style
- **TypeScript:** Strikt typisiert, keine any types
- **Components:** Functional components mit hooks
- **Naming:** kebab-case für files, PascalCase für components
- **Styling:** Tailwind utility-first
- **State:** Zustand für global state, useState für local

## 🤝 Contributing

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit deine Änderungen (`git commit -m 'feat: add amazing feature'`)
4. Push zum Branch (`git push origin feature/amazing-feature`)
5. Öffne einen Pull Request

## 📄 License

Dieses Projekt ist unter der MIT License lizenziert - siehe [LICENSE](LICENSE) für Details.

## 🙏 Acknowledgments

- Inspiriert von Jasper, Crisp, und Buffer
- Built mit Next.js und Supabase
- UI Components von shadcn/ui
- Icons von Lucide React

---

**Entwickelt mit ❤️ für Overwhelmed Professionals** 