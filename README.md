# 🧠 AI-Powered Dynamic Mind-Map Generator

**[🚀 Try the Live App Here!](https://ai-mind-map-creator.vercel.app)**

![AI Mind Mapper Banner](https://via.placeholder.com/1200x600/0b0f19/6366f1?text=AI+Mind+Mapper)

An intelligent, interactive mind-mapping tool that uses **Google Gemini AI** to instantly convert unstructured, messy notes into beautifully organized, draggable node-graphs. Built for students, engineers, and researchers to visualize complex ideas instantly.

## ✨ Features

- **🤖 AI-Powered Parsing:** Uses Google's Gemini 2.5 Flash to understand natural language and strictly extract hierarchical data structures from unstructured paragraphs.
- **📐 Mathematical Auto-Layout:** Integrates the `dagre` directed-graph layout engine to automatically calculate perfect X/Y coordinates, preventing node overlap and ensuring a perfectly balanced tree structure.
- **🖱️ Interactive Canvas:** Powered by `ReactFlow`, allowing users to drag, pan, zoom, and explore their mind maps fluidly.
- **📸 Export to PNG:** High-resolution image exporting using `html-to-image`, enabling users to download their maps for presentations or study guides.
- **🌑 Premium UI/UX:** Built from scratch with Vanilla CSS featuring a glassmorphism sidebar, sleek dark mode, and micro-animations.

## 🛠️ Tech Stack

- **Frontend Core:** React 18, Vite
- **Graph Engine:** ReactFlow (`@xyflow/react`)
- **Layout Algorithms:** Dagre Graphlib
- **Artificial Intelligence:** Google Generative AI SDK (`@google/generative-ai`)
- **Icons:** Lucide React
- **Styling:** Vanilla CSS (CSS Variables, Flexbox, Backdrop-Filter)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A free Google Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dhruvXdevv/AI-MindMap-Creator.git
   cd AI-MindMap-Creator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your API key:
   ```env
   VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🧠 How the Architecture Works

1. **Input:** User pastes raw text into the sidebar.
2. **AI Processing:** The text is wrapped in a strict System Prompt and sent to Gemini, which returns a perfectly formatted dashed list (`-`, `--`).
3. **Data Parsing:** A custom algorithm reads the dashes to calculate depth and determines Parent/Child relationships using a Stack data structure.
4. **Layout Calculation:** The raw nodes are piped through the `dagre` engine, which applies graph theory to assign non-colliding `x` and `y` positions.
5. **Rendering:** ReactFlow takes the finalized nodes and edges and draws them onto the WebGL-accelerated canvas.

## 📄 License
This project is open-source and available under the MIT License.
