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

//  preprocessRelationNetwork
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
