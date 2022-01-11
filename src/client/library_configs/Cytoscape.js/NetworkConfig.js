import { has } from 'lodash'
import { constrainValue, ValueScaler, ColorScaler } from './NetworkTools'

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

  elements.nodes.forEach(ele => {
    if (ele.data.distance === 0) {
      ele.data.size = '16px'
      ele.data.color = 'black'
      ele.data.font_size = 12.0
      // console.log('Found')
    }
  })
}

export const preprocessLetterSampo = elements => {
  const maxEdgeWidth = 8

  /**
  const rankSort = arr => {
   const arr2 = arr.map(function (o, i) { return { idx: i, obj: o } }).sort((a, b) => a.obj - b.obj)
   return arr2.map(function (o, i) { o.ord = i; return o }).sort((a, b) => a.idx - b.idx).map(o => o.ord)
  }
  */

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
  arr = elements.nodes.map(ele => Math.sqrt(ele.data.numLetters || 0))

  // TODO: adjust node sizes e.g. https://stackoverflow.com/questions/30167117/get-the-current-index-in-sort-function
  // node size
  res = (new ColorScaler('8px', '40px')).fitTransform(arr)
  elements.nodes.forEach((ele, i) => { ele.data.size = res[i] })

  // node color
  res = (new ColorScaler('rgb(0,0,0)', 'rgb(255,0,0)')).fitTransform(arr)
  elements.nodes.forEach((ele, i) => { ele.data.color = res[i] })
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

export const preprocessTie = elements => {
  const maxEdgeWidth = 8
  //  edges
  let arr = elements.edges.map(ele => ele.data.weight)

  //  edge width
  let res = (new ValueScaler(1.0, maxEdgeWidth)).fitTransform(arr)
  elements.edges.forEach((ele, i) => { ele.data.weight = res[i] })

  //  edge color
  res = (new ColorScaler('hsl(30, 64%, 85%)', 'hsl(30, 64%, 35%)')).fitTransform(arr)
  elements.edges.forEach((ele, i) => { ele.data.color = res[i] })

  // nodes
  arr = elements.nodes.map(ele => ele.data.pagerank)

  // node size
  res = (new ColorScaler('8px', '20px')).fitTransform(arr)
  elements.nodes.forEach((ele, i) => { ele.data.size = res[i] })

  // node color
  res = (new ColorScaler('rgb(0,0,0)', 'rgb(255,0,0)')).fitTransform(arr)
  elements.nodes.forEach((ele, i) => { ele.data.color = res[i] })
}

export const preprocessRelationNetwork = elements => {
  preprocessPagerank(elements)

  // nodes
  const arr = elements.nodes.map(ele => ele.data.distance)

  // node size
  let res = (new ColorScaler('24px', '6px')).fitTransform(arr)
  elements.nodes.forEach((ele, i) => { ele.data.size = res[i] })

  // node label font size
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

  // node label font size
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
  const maxEdgeWidth = 8

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
  const maxEdgeWidth = 8

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
  elements.edges.forEach(edge => {
    edge.data.weight = constrainValue({ value: edge.data.weight, maxValue: maxEdgeWidth })
  })
}

export const preprocessParliamentSampoPeopleNetwork = elements => {
  preprocessPagerank(elements)

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
