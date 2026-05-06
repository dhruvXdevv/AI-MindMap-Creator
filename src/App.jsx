import React, { useState, useRef } from 'react';
import { ReactFlow, Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { BrainCircuit, Sparkles, Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import './App.css';
import { parseTextToMap } from './parser';
import { getLayoutedElements } from './layout';
import { generateMindMapFromAI } from './ai';

// Initial dummy data for our map (we'll replace this with AI logic later)
const initialNodes = [
  { 
    id: '1', 
    position: { x: 400, y: 300 }, 
    data: { label: 'Start Brainstorming!' }, 
    type: 'input' 
  }
];

const initialEdges = [];

function App() {
  // State variables: These hold the data for our mind map and text area
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Ref to grab the ReactFlow canvas for taking a screenshot
  const mapRef = useRef(null);

  const handleDownload = () => {
    if (mapRef.current === null) return;
    
    // We specifically target the ReactFlow viewport so we get the graph
    const viewportNode = mapRef.current.querySelector('.react-flow__viewport');
    if (!viewportNode) return;
    
    toPng(viewportNode, {
      backgroundColor: '#0b0f19', // Match our dark mode background
      pixelRatio: 2 // High resolution for professional export
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'my-ai-mindmap.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Failed to export image', err);
      });
  };

  const handleGenerate = async () => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    
    try {
      // 1. Send unstructured text to Google Gemini
      const structuredDashedText = await generateMindMapFromAI(text);
      
      // 2. Pass the AI's perfect dashed text to our mathematical parser algorithm
      const { nodes: rawNodes, edges: rawEdges } = parseTextToMap(structuredDashedText);
      
      // 3. Pass the raw nodes into Dagre to get perfect auto-layout positions
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(rawNodes, rawEdges, 'LR');
      
      // Update React state to magically draw the beautifully balanced map!
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      
      {/* LEFT SIDE: The Sidebar for Input */}
      <div className="sidebar">
        <div className="header">
          <h1><BrainCircuit size={24} color="#6366f1" /> AI Mind Mapper</h1>
          <p>Type your unstructured notes below. The app will organize them into a dynamic mind map.</p>
        </div>

        <div className="input-area">
          <label>Your Notes</label>
          <textarea 
            className="editor"
            placeholder="- Write your ideas here...&#10;- They can be messy!&#10;- The generator will sort it out."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button 
            className="generate-btn" 
            onClick={handleGenerate} 
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'wait' : 'pointer' }}
          >
            <Sparkles size={18} />
            {isLoading ? 'Thinking...' : 'Generate Map'}
          </button>
        </div>
      </div>

      {/* RIGHT SIDE: The ReactFlow Canvas */}
      <div className="map-container" ref={mapRef}>
        <button className="download-btn" onClick={handleDownload}>
          <Download size={16} /> Export PNG
        </button>
        <ReactFlow nodes={nodes} edges={edges}>
          <Background color="#ffffff" gap={24} size={1} opacity={0.03} />
          <Controls />
        </ReactFlow>
      </div>

    </div>
  );
}

export default App;
