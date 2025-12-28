# 🥝 Kiwi RAG - Premium Voice AI Assistant

Kiwi RAG is a state-of-the-art Retrieval-Augmented Generation (RAG) platform reimagined with a high-fidelity, interactive interface. Transitioning from a basic Streamlit setup to a production-ready Next.js architecture, Kiwi offers a tactile, voice-first experience for interacting with personal knowledge bases.

![Kiwi UI](https://images.unsplash.com/photo-1614741480605-802515d0b63f?q=80&w=2070&auto=format&fit=crop)

## ✨ Features

- **🔋 Premium "Liquid Aura" Visualizer**: A 32-bar radial waveform system that reacts to voice states (idle, recording, speaking) with organic animations and glowing particles.
- **📊 Google Sheets Integration**: Seamlessly load and sync knowledge from Google Sheets URLs to power the RAG engine.
- **💬 "Your Chats" Sidebar**: A slide-out panel for session management, allowing users to browse history, create new chats, and delete previous threads.
- **🎨 Realistic UI Components**: Built with Radix UI and Framer Motion for high-impact micro-interactions, spring-physics animations, and glassmorphism.
- **🌑 Cinematic Dark Theme**: A deep black palette (#09090b) enhanced with animated green-teal background auras.
- **🔐 Secure Access**: Built-in authentication system for protected knowledge retrieval.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Styling**: Tailwind CSS 4 & CSS Variables
- **Animations**: Framer Motion & Lucide Icons
- **Typography**: DM Sans & Outfit
- **UI Components**: Radix UI (Shadcn/ui base)
- **Data Integration**: RAG-ready architecture for Google Sheets

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Bun or npm/pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/asif-mp3/kiwi-rag.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

### Login Credentials
- **Username**: `admin`
- **Password**: `admin123`

## 📖 Usage

1. **Connect Knowledge**: Click the Table icon in the header to input your Google Sheets URL.
2. **Voice Interaction**: Click the central Kiwi Mic button to start recording. The visualizer will expand and pulse.
3. **Manage Chats**: Use the "Chat" button in the header or the "Your Chats" sidebar to switch between conversations.

## 📱 UI Evolution
- **Old**: Static Streamlit UI.
- **New**: Fully interactive, animated Next.js application with a focus on aesthetics (14/100 -> 100/100).

---

Built with ❤️ for the Kiwi Community.
