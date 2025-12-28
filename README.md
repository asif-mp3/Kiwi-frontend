# Kiwi RAG: Intelligent Voice-First Analysis Engine

Kiwi RAG is a premium, high-fidelity conversational AI interface designed for Retrieval-Augmented Generation (RAG) tasks. It combines a cinematic "Liquid Aura" aesthetic with a robust state management system, specifically tailored for analyzing structured data from sources like Google Sheets through a voice-first interaction model.

## 🌟 Core Features

### 1. Cinematic Voice Interface
- **Radial Audio Visualizer**: A 32-bar reactive waveform that transforms dynamically based on the system state (Listening vs. Speaking).
- **Interactive Micro-interactions**: Hover scales, spring-based animations, and glowing particle effects powered by Framer Motion.
- **State-Aware UI**: The interface shifts colors (Green for listening, Teal for speaking) to provide intuitive non-verbal feedback.

### 2. Multi-Chat Management ("Your Chats")
- **Slide-out Sidebar**: A dedicated panel for managing multiple conversation threads.
- **Persistence**: Full session recovery using local storage synchronization.
- **Lifecycle Management**: Create, switch, and delete chat tabs with real-time title updates and message counts.

### 3. Google Sheets RAG Integration
- **Direct Linkage**: Connect any public Google Sheet URL via the secure configuration portal.
- **Context-Aware Analysis**: The system is designed to ingest spreadsheet data and provide intelligent insights through its internal RAG pipeline.
- **One-Tap Sync**: Instantly update the data context for the AI assistant.

---

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router) for optimized performance and routing.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a custom "Aura Dark" theme.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for fluid, hardware-accelerated transitions.
- **Icons**: [Lucide React](https://lucide.dev/) for a clean, consistent visual language.
- **Typography**: Optimized loading of **Outfit** (Display) and **DM Sans** (Body) fonts.

### State Management & Persistence
The application utilizes a custom-built hook architecture (`useAppState`) that manages:
- **Auth State**: Secure local session handling.
- **Chat Store**: A hierarchical data structure managing `ChatTab` objects, each containing an array of `Message` objects.
- **Config Store**: Global settings for RAG parameters (e.g., Google Sheet URLs).
- **Storage Middleware**: Automatic synchronization between React state and `localStorage` to ensure zero data loss on refresh.

### The "Kiwi" RAG Pipeline (Backend Logic)
The engine operates on a sophisticated (simulated for demo) RAG architecture:
1. **Data Ingestion**: When a Google Sheet is linked, the system prepares the URL for indexing.
2. **Retrieval**: User queries (voice or text) trigger a lookup against the indexed data.
3. **Augmentation**: The prompt is enriched with relevant rows from the spreadsheet.
4. **Generation**: The AI generates a contextual response, mimicking a real-time data analyst.
5. **Multilingual Support**: Built-in support for multiple languages (e.g., Tamil and English) within the response generation logic.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Bun or NPM

### Installation
```bash
# Install dependencies
bun install

# Start the development server
bun run dev
```

### Authentication
For the demo version, use the following credentials:
- **Username**: `admin`
- **Password**: `admin123`

---

## 🎨 Design Philosophy
Kiwi follows a **"Tactile Digital"** philosophy:
- **Depth**: Layered CSS gradients and blur filters create a sense of physical space.
- **Focus**: High-contrast accents (Green/Teal) guide the user's attention to primary actions.
- **Responsiveness**: Fully adaptive layouts that maintain the premium aesthetic across mobile and desktop devices.

---

**Developed with ❤️ by the Kiwi Engineering Team**
