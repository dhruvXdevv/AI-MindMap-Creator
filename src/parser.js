/**
 * parser.js
 * This algorithm takes raw text and converts it into Nodes and Edges for ReactFlow.
 */

export function parseTextToMap(text) {
  // Split the text into an array of lines, ignoring empty lines
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  const nodes = [];
  const edges = [];
  
  // We use this array like a 'Stack' to keep track of parent nodes
  const parentStack = []; 

  lines.forEach((line, index) => {
    // 1. Calculate depth by counting leading dashes
    // This regex looks for dashes at the start of the line, followed by the text
    const match = line.match(/^(-*)\s*(.*)/);
    if (!match) return;
    
    const dashes = match[1];
    const content = match[2];
    const depth = dashes.length;
    
    const nodeId = `node-${index}`;
    
    // 2. Mathematically calculate position
    // X moves right based on depth. Y moves down based on line index.
    const xPos = depth * 280;
    const yPos = index * 80;
    
    // 3. Create the Node object expected by ReactFlow
    nodes.push({
      id: nodeId,
      position: { x: xPos, y: yPos },
      data: { label: content },
      type: 'default',
      style: {
        background: 'rgba(255, 255, 255, 0.05)',
        color: '#e2e8f0',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '8px',
        padding: '10px 20px',
        width: 180,
      }
    });
    
    // 4. Figure out the parent to draw a connecting Edge
    if (depth > 0) {
      // Look backwards through the stack to find the nearest parent
      let parentId = null;
      for (let i = parentStack.length - 1; i >= 0; i--) {
        if (parentStack[i].depth < depth) {
          parentId = parentStack[i].id;
          break;
        }
      }
      
      if (parentId) {
        // Create an Edge connecting the parent to this node
        edges.push({
          id: `edge-${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          animated: true, // This adds a cool flowing animation to the line!
          style: { stroke: '#6366f1', strokeWidth: 2 }
        });
      }
    }
    
    // Save this node to the stack so future lines know it exists
    parentStack.push({ id: nodeId, depth: depth });
  });
  
  return { nodes, edges };
}
