import dagre from 'dagre';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// Standard dimensions for our nodes (so the algorithm knows how much space to allocate)
const nodeWidth = 200;
const nodeHeight = 60;

export const getLayoutedElements = (nodes, edges, direction = 'LR') => {
  // Determine layout direction: 'LR' = left to right, 'TB' = top to bottom
  dagreGraph.setGraph({ rankdir: direction });

  // 1. Tell Dagre about every node and its physical size
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // 2. Tell Dagre about every connection between nodes
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // 3. RUN THE ENGINE! Dagre does the heavy lifting math here.
  dagre.layout(dagreGraph);

  // 4. Update our nodes with their newly calculated, collision-free coordinates
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    
    return {
      ...node,
      position: {
        // Dagre returns the "center" point, but ReactFlow draws from the "top-left", 
        // so we shift it slightly by half the width/height to make it perfect.
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};
