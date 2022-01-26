import { has } from 'lodash'

export const constrainValue = ({ value, maxValue, defaultValue = 1 }) => {
  return (value ? (value < maxValue ? value : maxValue) : defaultValue)
}

export class ValueScaler {
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

export class ColorScaler extends ValueScaler {
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

//  preprocess by pagerank
export const preprocessPagerank = elements => {
  const maxEdgeWidth = 8

  //  edges
  let arr = elements.edges.map(ele => ele.data.weight)

  //  edge width
  let res = (new ValueScaler(1.0, maxEdgeWidth)).fitTransform(arr)
  elements.edges.forEach((ele, i) => { ele.data.weight = res[i] })

  // nodes
  arr = elements.nodes.map(ele => ele.data.pagerank)

  // node size
  res = (new ColorScaler('6px', '24px')).fitTransform(arr)
  elements.nodes.forEach((ele, i) => { ele.data.size = res[i] })

  // node label font size
  res = (new ValueScaler(8, 12)).fitTransform(arr)
  elements.nodes.forEach((ele, i) => { ele.data.font_size = res[i] })

  // highlight main node
  elements.nodes.forEach(ele => {
    if (ele.data.distance === 0) {
      ele.data.size = '16px'
      ele.data.color = 'black'
      ele.data.font_size = 12.0
    }
  })
}

export const preprocessEgo = elements => {
  const maxEdgeWidth = 8

  //  edges
  let arr = elements.edges.map(ele => ele.data.weight || 1)

  //  edge width
  let res = (new ValueScaler(1.0, maxEdgeWidth)).fitTransform(arr)
  elements.edges.forEach((ele, i) => { ele.data.weight = res[i] })

  //  edge color
  // https://www.w3schools.com/colors/colors_hsl.asp
  res = (new ColorScaler('hsl(30, 64%, 85%)', 'hsl(30, 64%, 35%)')).fitTransform(arr)
  elements.edges.forEach((ele, i) => { ele.data.color = res[i] })

  // nodes
  arr = elements.nodes.map(ele => has(ele.data, 'distance') ? ele.data.distance : 3)

  // node size
  res = (new ColorScaler('20px', '8px')).fitTransform(arr)
  elements.nodes.forEach((ele, i) => { ele.data.size = res[i] })

  // node color
  res = (new ColorScaler('rgb(255,0,0)', 'rgb(0,0,0)')).fitTransform(arr)
  elements.nodes.forEach((ele, i) => { ele.data.color = res[i] })
}

//  preprocess by ego node distance
export const preprocessDistance = elements => {
  const maxEdgeWidth = 8

  //  edges
  let arr = elements.edges.map(ele => ele.data.weight)

  //  edge width
  let res = (new ValueScaler(1.0, maxEdgeWidth)).fitTransform(arr)
  elements.edges.forEach((ele, i) => { ele.data.weight = res[i] })

  // nodes
  arr = elements.nodes.map(ele => ele.data.distance)

  // node size
  res = (new ColorScaler('24px', '6px')).fitTransform(arr)
  elements.nodes.forEach((ele, i) => { ele.data.size = res[i] })

  //  label size
  res = (new ValueScaler(16, 8)).fitTransform(arr)
  elements.nodes.forEach((ele, i) => { ele.data.font_size = res[i] })
}
