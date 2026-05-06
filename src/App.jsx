import React, { useState } from 'react';
import { ReactFlow, Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { BrainCircuit, Sparkles } from 'lucide-react';
import './App.css';
import { parseTextToMap } from './parser';
import { getLayoutedElements } from './layout';

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

  const handleGenerate = () => {
    if (!text.trim()) return;
    
    // Pass the text to our mathematical parser algorithm
    const { nodes: rawNodes, edges: rawEdges } = parseTextToMap(text);
    
    // Pass the raw nodes into Dagre to get perfect auto-layout positions
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(rawNodes, rawEdges, 'LR');
    
    // Update React state to magically draw the beautifully balanced map!
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
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
          <button className="generate-btn" onClick={handleGenerate}>
            <Sparkles size={18} />
            Generate Map
          </button>
        </div>
      </div>

      {/* RIGHT SIDE: The ReactFlow Canvas */}
      <div className="map-container">
        <ReactFlow nodes={nodes} edges={edges}>
          <Background color="#ffffff" gap={24} size={1} opacity={0.03} />
          <Controls />
        </ReactFlow>
      </div>

    </div>
  );
}

export default App;
