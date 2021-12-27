const maxEdgeWidth = 8

const constrainWidth = width => {
  return (width ? (width < maxEdgeWidth ? width : maxEdgeWidth) : 1)
}

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

//  preprocess by pagerank
export const preprocess = elements => {
  //  edges
  let arr = elements.edges.map(ele => ele.data.weight)

  //  edge width
  let res = (new ValueScaler(1.0, maxEdgeWidth)).fitTransform(arr)
  elements.edges.forEach((ele, i) => { ele.data.weight = res[i] })

  // console.log(elements.nodes)
  // nodes
  arr = elements.nodes.map(ele => ele.data.pagerank)

  // node size
  res = (new ColorScaler('6px', '24px')).fitTransform(arr)
  elements.nodes.forEach((ele, i) => { ele.data.size = res[i] })

  //  label size
  res = (new ValueScaler(8, 12)).fitTransform(arr)
  elements.nodes.forEach((ele, i) => { ele.data.font_size = res[i] })

  elements.nodes.forEach(ele => {
    if (ele.data.distance === 0) {
      ele.data.size = '16px'
      ele.data.color = 'black'
      ele.data.font_size = 12.0
      // console.log('Found')
    }
  })
}

//  preprocessRelationNetwork
export const preprocessRelationNetwork = elements => {
  preprocess(elements)

  // nodes
  const arr = elements.nodes.map(ele => ele.data.distance)

  // node size
  let res = (new ColorScaler('24px', '6px')).fitTransform(arr)
  elements.nodes.forEach((ele, i) => { ele.data.size = res[i] })

  //  label size
  res = (new ValueScaler(12, 8)).fitTransform(arr)
  elements.nodes.forEach((ele, i) => { ele.data.font_size = res[i] })
}

//  preprocess for person/connections
export const preprocessConnections = elements => {
  //  edges
  let arr = elements.edges.map(ele => ele.data.weight)

  //  edge width
  let res = (new ValueScaler(1.0, 4.0)).fitTransform(arr)
  elements.edges.forEach((ele, i) => { ele.data.weight = res[i] })

  const maxlength = 60
  elements.edges.forEach(ele => {
    const st = ele.data.prefLabel
    ele.data.prefLabel = st.length > maxlength ? st.substring(0, maxlength - 3) + '...' : st
  })
  // nodes by distance to ego
  arr = elements.nodes.map(ele => ele.data.distance)

  // node size
  res = (new ColorScaler('24px', '6px')).fitTransform(arr)
  elements.nodes.forEach((ele, i) => { ele.data.size = res[i] })

  // label size
  res = (new ValueScaler(12, 8)).fitTransform(arr)
  elements.nodes.forEach((ele, i) => { ele.data.font_size = res[i] })

  elements.nodes.forEach(ele => { ele.data.color = (ele.data.distance < 1) ? 'red' : 'blue' })

  elements.nodes.forEach(ele => {
    if (ele.data.distance === 0) {
      ele.data.size = '16px'
      ele.data.color = 'black'
      ele.data.font_size = 12.0
      // console.log('Found')
    }
  })
}

//  preprocess by ego node distance
export const preprocessDistance = elements => {
  //  edges
  let arr = elements.edges.map(ele => ele.data.weight)

  //  edge width
  let res = (new ValueScaler(1.0, maxEdgeWidth)).fitTransform(arr)
  elements.edges.forEach((ele, i) => { ele.data.weight = res[i] })

  // console.log(elements.nodes)
  // nodes
  arr = elements.nodes.map(ele => ele.data.distance)

  // node size
  res = (new ColorScaler('24px', '6px')).fitTransform(arr)
  elements.nodes.forEach((ele, i) => { ele.data.size = res[i] })

  //  label size
  res = (new ValueScaler(16, 8)).fitTransform(arr)
  elements.nodes.forEach((ele, i) => { ele.data.font_size = res[i] })
}

export const preprocessPointCloud = elements => {
  const nodes = elements.nodes.map(ob => {
    return {
      data: ob.data,
      position: {
        x: 360 * parseFloat(ob.data.x),
        y: 360 * parseFloat(ob.data.y)
      }
    }
  })
  elements.nodes = nodes
  elements.edges = []
}

export const preprocessFamilytree = elements => {
  // console.log(elements.nodes)
  const nodes = elements.nodes.map(ob => {
    if (ob.data.distance === 0) {
      ob.data.size = '24px'
      ob.data.color = 'black'
      // console.log('Found')
    }
    return {
      data: ob.data,
      position: {
        x: 800 * parseFloat(ob.data.x),
        y: 600 * parseFloat(ob.data.y)
      }
    }
  })
  elements.nodes = nodes
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
