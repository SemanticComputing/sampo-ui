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

export const preprocess = elements => {
  const vals = elements.edges.map(ele => ele.data.weight)
  const valmax = Math.max(...vals)
  const valmin = Math.min(...vals)
  const wmax = 6.0
  const wmin = 1.0
  const a = (wmax - wmin) / (valmax - valmin)
  const b = wmin - valmin * (wmax - wmin) / (valmax - valmin)
  elements.edges.forEach((ele, i) => { ele.data.weight = vals[i] * a + b })
}

export const preprocessPeopleNetwork = elements => {
  preprocess(elements)

  // nodes
  const arr = elements.nodes.map(ele => ele.data.distance)

  // node size
  let res = (new ColorScaler('26px', '12px')).fitTransform(arr)
  elements.nodes.forEach((ele, i) => { ele.data.size = res[i] })

  //  label size
  res = (new ValueScaler(12, 8)).fitTransform(arr)
  elements.nodes.forEach((ele, i) => { ele.data.font_size = res[i] })

  // node color
  // res = (new ColorScaler('rgb(255, 0, 0)', 'rgb(0, 0, 255)')).fitTransform(arr)
  // elements.nodes.forEach((ele, i) => { ele.data.color = res[i] })
}

const maxEdgeWidth = 8

const constrainWidth = width => {
  return (width ? (width < maxEdgeWidth ? width : maxEdgeWidth) : 1)
}

class ValueScaler {
  a;
  b;
  constructor (low, high) {
    this.low = low
    this.high = high
  }

  fit (vals) {
    const valmin = Math.min(...vals)
    const valmax = Math.max(...vals)
    if (valmax === valmin) {
      this.a = 0.0
    } else {
      this.a = (this.high - this.low) / (valmax - valmin)
    }
    this.b = this.low - valmin * this.a
  }

  transform (vals) {
    return vals.map(x => { return x * this.a + this.b })
  }

  fitTransform (vals) {
    this.fit(vals)
    return this.transform(vals)
  }
}

class ColorScaler extends ValueScaler {
  col1;
  col2;
  constructor (low, high) {
    super(0.0, 1.0)
    this.col1 = low
    this.col2 = high
  }

  // super.fit(vals)

  _process (s0, s1, r) {
    const x0 = parseInt(s0)
    const x1 = parseInt(s1)
    if (isNaN(x0) || isNaN(x1)) return s0
    return Math.floor(x0 + (x1 - x0) * r)
  }

  transform (vals) {
    const s1 = this.col1.split(/(\d+)/)
    const s2 = this.col2.split(/(\d+)/)
    const _vals01 = vals.map(x => { return x * this.a + this.b })

    return _vals01.map(v => s1.map((s, i) => this._process(s, s2[i], v)).join(''))
  }
}
