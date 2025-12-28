# 🥝 Kiwi Frontend - Intelligent Voice-First RAG Interface

[![Next.js](https://img.shields.io/badge/Next.js-15.3.6-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

Kiwi Frontend is a premium, voice-first conversational AI interface designed for Retrieval-Augmented Generation (RAG) tasks. Built with Next.js 15 and React 19, it features a cinematic "Liquid Aura" aesthetic, real-time voice visualization, multi-chat management, and seamless Google Sheets integration for intelligent data analysis.

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [🏗️ Project Structure](#️-project-structure)
- [🔧 Tech Stack](#-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📦 Dependencies](#-dependencies)
- [🎨 Design System](#-design-system)
- [🔐 Authentication](#-authentication)
- [🧩 Component Architecture](#-component-architecture)
- [📝 Scripts](#-scripts)
- [🤝 Contributing](#-contributing)

---

## ✨ Features

### 🎤 Voice-First Interface
- **Real-time Audio Visualizer**: 32-bar radial waveform with dynamic state-based animations
- **Voice Input/Output**: Seamless speech-to-text and text-to-speech integration
- **State-Aware UI**: Visual feedback with color transitions (Green for listening, Teal for speaking)
- **Interactive Micro-interactions**: Framer Motion-powered hover effects and spring animations

### 💬 Multi-Chat Management
- **Tabbed Conversations**: Create, switch, and manage multiple chat sessions
- **Persistent Storage**: Automatic localStorage synchronization for session recovery
- **Real-time Updates**: Live title generation and message count tracking
- **Slide-out Sidebar**: Elegant chat history panel with smooth animations

### 📊 Google Sheets RAG Integration
- **Direct Sheet Linking**: Connect any public Google Sheet URL
- **Intelligent Analysis**: Context-aware data retrieval and insights
- **One-Click Sync**: Instant data context updates
- **Structured Data Processing**: Advanced query understanding for spreadsheet data

### 🎨 Premium UI/UX
- **Glassmorphism Design**: Modern blur effects and layered gradients
- **Dark Mode Optimized**: "Aura Dark" theme with vibrant accents
- **Responsive Layout**: Fully adaptive across mobile, tablet, and desktop
- **Accessibility**: WCAG-compliant components with keyboard navigation

---

## 🏗️ Project Structure

```
Kiwi-frontend/
├── 📁 .next/                    # Next.js build output (auto-generated)
├── 📁 node_modules/             # NPM dependencies
├── 📁 public/                   # Static assets
│   ├── file.svg                 # File icon
│   ├── globe.svg                # Globe icon
│   ├── next.svg                 # Next.js logo
│   ├── vercel.svg               # Vercel logo
│   └── window.svg               # Window icon
├── 📁 src/                      # Source code
│   ├── 📁 app/                  # Next.js App Router
│   │   ├── favicon.ico          # App favicon
│   │   ├── global-error.tsx     # Global error boundary
│   │   ├── globals.css          # Global styles & CSS variables
│   │   ├── layout.tsx           # Root layout with providers
│   │   └── page.tsx             # Home page (main app entry)
│   ├── 📁 components/           # React components
│   │   ├── AuthScreen.tsx       # Login/authentication UI
│   │   ├── ChatInput.tsx        # Message input with voice/text toggle
│   │   ├── ChatScreen.tsx       # Main chat interface
│   │   ├── ErrorReporter.tsx    # Error handling & reporting
│   │   ├── MessageBubble.tsx    # Individual message display
│   │   ├── VoiceVisualizer.tsx  # Radial audio waveform visualizer
│   │   └── 📁 ui/               # Reusable UI components (53 files)
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── alert.tsx
│   │       ├── aspect-ratio.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── breadcrumb.tsx
│   │       ├── button-group.tsx
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── card.tsx
│   │       ├── carousel.tsx
│   │       ├── chart.tsx
│   │       ├── checkbox.tsx
│   │       ├── collapsible.tsx
│   │       ├── command.tsx
│   │       ├── context-menu.tsx
│   │       ├── dialog.tsx
│   │       ├── drawer.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── empty.tsx
│   │       ├── field.tsx
│   │       ├── form.tsx
│   │       ├── hover-card.tsx
│   │       ├── input-group.tsx
│   │       ├── input-otp.tsx
│   │       ├── input.tsx
│   │       ├── item.tsx
│   │       ├── kbd.tsx
│   │       ├── label.tsx
│   │       ├── menubar.tsx
│   │       ├── navigation-menu.tsx
│   │       ├── pagination.tsx
│   │       ├── popover.tsx
│   │       ├── progress.tsx
│   │       ├── radio-group.tsx
│   │       ├── resizable.tsx
│   │       ├── scroll-area.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── sidebar.tsx
│   │       ├── skeleton.tsx
│   │       ├── slider.tsx
│   │       ├── sonner.tsx
│   │       ├── spinner.tsx
│   │       ├── switch.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       ├── toggle-group.tsx
│   │       ├── toggle.tsx
│   │       └── tooltip.tsx
│   ├── 📁 hooks/                # Custom React hooks
│   │   └── use-mobile.ts        # Mobile device detection hook
│   ├── 📁 lib/                  # Utility libraries
│   │   ├── 📁 hooks/            # Additional hooks
│   │   │   └── [hook files]
│   │   ├── hooks.ts             # Core state management (useAppState)
│   │   ├── types.ts             # TypeScript type definitions
│   │   └── utils.ts             # Utility functions (cn, etc.)
│   └── 📁 visual-edits/         # Visual editing utilities
│       ├── VisualEditsMessenger.tsx      # Visual editing messenger
│       └── component-tagger-loader.js    # Component tagging loader
├── 📄 .gitignore                # Git ignore rules
├── 📄 bun.lock                  # Bun lockfile
├── 📄 components.json           # shadcn/ui configuration
├── 📄 eslint.config.mjs         # ESLint configuration
├── 📄 next-env.d.ts             # Next.js TypeScript declarations
├── 📄 next.config.ts            # Next.js configuration
├── 📄 package-lock.json         # NPM lockfile
├── 📄 package.json              # Project dependencies & scripts
├── 📄 postcss.config.mjs        # PostCSS configuration
├── 📄 README.md                 # This file
└── 📄 tsconfig.json             # TypeScript configuration
```

---

## 🔧 Tech Stack

### Core Framework
- **[Next.js 15.3.6](https://nextjs.org/)** - React framework with App Router
- **[React 19.0.0](https://react.dev/)** - UI library
- **[TypeScript 5.x](https://www.typescriptlang.org/)** - Type-safe JavaScript

### Styling & UI
- **[Tailwind CSS 4.x](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion 12.x](https://www.framer.com/motion/)** - Animation library
- **[Radix UI](https://www.radix-ui.com/)** - Headless UI components
- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable component library
- **[Lucide React](https://lucide.dev/)** - Icon library

### State & Forms
- **[React Hook Form](https://react-hook-form.com/)** - Form validation
- **[Zod](https://zod.dev/)** - Schema validation
- **Custom Hooks** - `useAppState` for global state management

### Authentication & Database
- **[Better Auth](https://www.better-auth.com/)** - Authentication library
- **[Drizzle ORM](https://orm.drizzle.team/)** - TypeScript ORM
- **[LibSQL Client](https://github.com/tursodatabase/libsql-client-ts)** - SQLite client

### 3D & Visualization
- **[Three.js](https://threejs.org/)** - 3D graphics library
- **[@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)** - React renderer for Three.js
- **[@react-three/drei](https://github.com/pmndrs/drei)** - Three.js helpers
- **[Recharts](https://recharts.org/)** - Chart library

### Additional Libraries
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications
- **[date-fns](https://date-fns.org/)** - Date utility library
- **[clsx](https://github.com/lukeed/clsx)** - Conditional className utility
- **[Embla Carousel](https://www.embla-carousel.com/)** - Carousel library

---

## 🚀 Getting Started

### Prerequisites

Ensure you have one of the following installed:
- **Node.js** 18.x or higher
- **Bun** (recommended for faster installs)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/asif-mp3/Kiwi-frontend.git
   cd Kiwi-frontend
   ```

2. **Install dependencies**
   ```bash
   # Using Bun (recommended)
   bun install

   # Or using npm
   npm install

   # Or using yarn
   yarn install
   ```

3. **Run the development server**
   ```bash
   # Using Bun
   bun run dev

   # Or using npm
   npm run dev

   # Or using yarn
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
# Build the application
bun run build

# Start the production server
bun run start
```

---

## 📦 Dependencies

### Production Dependencies (Key Highlights)

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 15.3.6 | React framework |
| `react` | 19.0.0 | UI library |
| `react-dom` | 19.0.0 | React DOM renderer |
| `framer-motion` | 12.23.24 | Animations |
| `tailwindcss` | 4.x | Styling |
| `@radix-ui/*` | Various | Headless UI primitives |
| `lucide-react` | 0.552.0 | Icons |
| `better-auth` | 1.3.10 | Authentication |
| `drizzle-orm` | 0.44.7 | Database ORM |
| `three` | 0.178.0 | 3D graphics |
| `recharts` | 3.0.2 | Charts |
| `sonner` | 2.0.6 | Toast notifications |
| `react-hook-form` | 7.60.0 | Form handling |
| `zod` | 4.1.12 | Schema validation |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | 5.x | Type checking |
| `eslint` | 9.38.0 | Code linting |
| `@types/node` | 20.x | Node.js types |
| `@types/react` | 19.x | React types |
| `@types/three` | 0.178.0 | Three.js types |

For a complete list, see [`package.json`](./package.json).

---

## 🎨 Design System

### Color Palette
The application uses a custom "Aura Dark" theme with the following key colors:
- **Primary**: Green (`#10b981`) - Listening state
- **Secondary**: Teal (`#14b8a6`) - Speaking state
- **Background**: Dark gradients with blur effects
- **Accent**: Vibrant highlights for interactive elements

### Typography
- **Display Font**: [Outfit](https://fonts.google.com/specimen/Outfit) - Headers and prominent text
- **Body Font**: [DM Sans](https://fonts.google.com/specimen/DM+Sans) - Body text and UI elements

### Animation Principles
- **Spring Physics**: Natural, bouncy animations using Framer Motion
- **State Transitions**: Smooth color and scale transitions based on app state
- **Micro-interactions**: Hover effects, button presses, and loading states
- **Performance**: Hardware-accelerated transforms and opacity changes

---

## 🔐 Authentication

### Demo Credentials
For testing purposes, use the following credentials:

```
Username: admin
Password: admin123
```

### Authentication Flow
1. User enters credentials in `AuthScreen.tsx`
2. Credentials are validated against local storage
3. Session state is managed via `useAppState` hook
4. Authenticated state persists across page refreshes

### Security Notes
> [!WARNING]
> The current implementation uses demo authentication for development purposes. For production, integrate with a secure backend authentication service.

---

## 🧩 Component Architecture

### Core Components

#### `ChatScreen.tsx`
The main chat interface that orchestrates:
- Message display and scrolling
- Voice visualizer integration
- Chat input handling
- Multi-chat sidebar
- Settings dialog

#### `VoiceVisualizer.tsx`
Real-time audio visualization with:
- 32-bar radial waveform
- State-based color transitions
- Particle effects
- Responsive scaling

#### `ChatInput.tsx`
Dual-mode input component:
- Text input with send button
- Voice input with recording state
- Auto-focus and keyboard shortcuts

#### `MessageBubble.tsx`
Individual message display:
- User vs. Assistant styling
- Timestamp formatting
- Audio playback controls
- Copy to clipboard

#### `AuthScreen.tsx`
Login interface with:
- Form validation
- Error handling
- Animated transitions
- Remember me functionality

### UI Component Library

The `src/components/ui/` directory contains **53 reusable components** built with Radix UI primitives and styled with Tailwind CSS. These include:

- **Layout**: `card`, `separator`, `resizable`, `sidebar`
- **Forms**: `input`, `textarea`, `select`, `checkbox`, `radio-group`, `switch`, `slider`
- **Navigation**: `navigation-menu`, `menubar`, `breadcrumb`, `tabs`, `pagination`
- **Feedback**: `alert`, `alert-dialog`, `dialog`, `drawer`, `toast` (sonner), `progress`, `spinner`
- **Data Display**: `table`, `chart`, `avatar`, `badge`, `kbd`, `empty`
- **Overlays**: `popover`, `tooltip`, `hover-card`, `context-menu`, `dropdown-menu`
- **Interactive**: `button`, `toggle`, `accordion`, `collapsible`, `carousel`

### Custom Hooks

#### `useAppState` (`src/lib/hooks.ts`)
Central state management hook that provides:
- **Authentication state**: Login/logout, session persistence
- **Chat management**: Create, switch, delete chat tabs
- **Message handling**: Add messages, update chat history
- **Configuration**: Google Sheet URL management
- **Storage sync**: Automatic localStorage synchronization

#### `use-mobile` (`src/hooks/use-mobile.ts`)
Responsive design hook for detecting mobile devices

---

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server with Turbopack |
| `bun run build` | Build production bundle |
| `bun run start` | Start production server |
| `bun run lint` | Run ESLint code linting |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow TypeScript best practices
- Use ESLint configuration provided
- Maintain component modularity
- Write meaningful commit messages

---

## 📄 License

This project is part of the Kiwi RAG ecosystem.

---

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Vercel** - For deployment and hosting solutions
- **Radix UI** - For accessible component primitives
- **shadcn** - For the beautiful component library
- **Framer** - For the powerful animation library

---

## 📧 Contact

For questions or support, please open an issue on [GitHub](https://github.com/asif-mp3/Kiwi-frontend/issues).

---

**Built with ❤️ by the Kiwi Engineering Team**
