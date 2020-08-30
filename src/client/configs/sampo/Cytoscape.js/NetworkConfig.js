// https://js.cytoscape.org/#style
export const cytoscapeStyle = [
  {
    selector: 'node',
    style: {
      shape: 'ellipse',
      'font-size': '12',
      'background-color': ele => ele.data('color') || '#666',
      label: ' data(prefLabel)',
      height: ele => (ele.data('size') || 16 / (ele.data('distance') + 1) || '16px'),
      width: ele => (ele.data('size') || 16 / (ele.data('distance') + 1) || '16px')
    }
  },
  {
    selector: 'edge',
    style: {
      width: ele => constrainWidth(ele.data('weight')),
      'line-color': ele => ele.data('color') || '#BBB',
      'curve-style': 'bezier',
      // content: ' data(prefLabel) ',
      'target-arrow-shape': 'triangle',
      'target-arrow-color': '#999',
      color: '#555',
      'font-size': '6',
      'text-valign': 'top',
      'text-halign': 'center',
      'edge-text-rotation': 'autorotate',
      'text-background-opacity': 1,
      'text-background-color': 'white',
      'text-background-shape': 'roundrectangle'
    }
  }
]

// https://js.cytoscape.org/#layouts
export const coseLayout = {
  name: 'cose',
  idealEdgeLength: 100,
  nodeOverlap: 20,
  refresh: 20,
  fit: true,
  padding: 30,
  randomize: false,
  componentSpacing: 100,
  nodeRepulsion: 400000,
  edgeElasticity: 100,
  nestingFactor: 5,
  gravity: 80,
  numIter: 1347,
  initialTemp: 200,
  coolingFactor: 0.95,
  minTemp: 1.0
}

const maxEdgeWidth = 8

const constrainWidth = width => {
  return (width ? (width < maxEdgeWidth ? width : maxEdgeWidth) : 1)
}
