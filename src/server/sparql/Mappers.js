import { has, cloneDeep } from 'lodash'
import { getTreeFromFlatData } from '@nosferatu500/react-sortable-tree'

export const mapPlaces = sparqlBindings => {
  const results = sparqlBindings.map(b => {
    return {
      id: b.id.value,
      lat: b.lat.value,
      long: b.long.value,
      ...(Object.prototype.hasOwnProperty.call(b, 'instanceCount') && { instanceCount: b.instanceCount.value })
    }
  })
  return results
}

export const mapCoordinates = sparqlBindings => {
  const results = sparqlBindings.map(b => {
    return {
      lat: b.lat.value,
      long: b.long.value
    }
  })
  return results
}

export const mapCount = sparqlBindings => {
  return sparqlBindings[0].count.value
}

export const mapFacet = (sparqlBindings, previousSelections) => {
  let results = []
  if (sparqlBindings.length > 0) {
    results = mapFacetValues(sparqlBindings)
  }
  return results
}

export const mapHierarchicalFacet = (sparqlBindings, previousSelections) => {
  const results = mapFacetValues(sparqlBindings)
  let treeData = getTreeFromFlatData({
    flatData: results,
    getKey: node => node.id, // resolve a node's key
    getParentKey: node => node.parent, // resolve node's parent's key
    rootKey: '0' // The value of the parent key when there is no parent (i.e., at root level)
  })
  treeData = recursiveSortAndSelectChildren(treeData)
  return ({
    treeData,
    flatData: results
  })
}

export const mapTimespanFacet = sparqlBindings => {
  const b = sparqlBindings[0]
  return {
    min: b.min.value,
    max: b.max.value
  }
}

export const mapNameSampoResults = sparqlBindings => {
  const results = sparqlBindings.map(b => {
    return {
      id: b.id.value,
      prefLabel: b.prefLabel.value.charAt(0).toUpperCase() + b.prefLabel.value.slice(1), // capitalize
      modifier: has(b, 'modifier') ? b.modifier.value : '-',
      basicElement: has(b, 'basicElement') ? b.basicElement.value : '-',
      typeLabel: has(b, 'typeLabel') ? b.typeLabel.value : '-',
      broaderTypeLabel: has(b, 'broaderTypeLabel') ? b.broaderTypeLabel.value : '-',
      collector: has(b, 'collector') ? b.collector.value : '-',
      broaderAreaLabel: has(b, 'broaderAreaLabel') ? b.broaderAreaLabel.value : '-',
      collectionYear: has(b, 'collectionYear') ? b.collectionYear.value : '-',
      source: has(b, 'source') ? b.source.value : '-',
      markerColor: has(b, 'markerColor') ? b.markerColor.value : '-',
      namesArchiveLink: has(b, 'namesArchiveLink') ? b.namesArchiveLink.value : '-',
      positioningAccuracy: has(b, 'positioningAccuracy') ? b.positioningAccuracy.value : '-',
      ...(Object.prototype.hasOwnProperty.call(b, 'lat') && { lat: b.lat.value }),
      ...(Object.prototype.hasOwnProperty.call(b, 'long') && { long: b.long.value })
    }
  })
  return results
}

export const mapLineChart = ({ sparqlBindings, config }) => {
  const seriesData = []
  const categoriesData = []
  const sparqlBindingsLength = sparqlBindings.length
  sparqlBindings.forEach((b, index, bindings) => {
    const currentCategory = parseInt(b.category.value)
    const currentValue = parseInt(b.count.value)
    seriesData.push(currentValue)
    categoriesData.push(
      config && config.xAxisConverter
        ? config.xAxisConverter(currentCategory)
        : currentCategory
    )
    if (config && config.fillEmptyValues && index + 1 < sparqlBindingsLength) {
      let categoryIter = currentCategory
      const nextNonZeroCategory = parseInt(bindings[index + 1].category.value)
      // add zeros until we reach the next category with a non zero value
      while (categoryIter < nextNonZeroCategory - 1) {
        categoryIter += 1
        seriesData.push(0)
        categoriesData.push(
          config && config.xAxisConverter
            ? config.xAxisConverter(categoryIter)
            : categoryIter
        )
      }
    }
  })
  return {
    seriesData,
    categoriesData
  }
}

export const mapMultipleLineChart = ({ sparqlBindings, config }) => {
  const res = {}
  sparqlBindings.forEach(b => {
    for (const p in b) {
      if (p !== 'category') {
        res[p] = []
      }
    }
  })
  const category = sparqlBindings.map(p => parseFloat(p.category.value))

  if (config && config.fillEmptyValues) {
    //  fill the missing years with zeroes
    const valmax = Math.max(...category)
    for (let i = Math.min(...category); i <= valmax; i++) {
      for (const p in res) {
        if (p !== 'category') {
          res[p][i] = 0
        }
      }
    }
  }

  //  read the known years into the data object
  sparqlBindings.forEach(b => {
    for (const p in b) {
      if (p !== 'category') {
        res[p][parseFloat(b.category.value)] = parseFloat(b[p].value)
      }
    }
  })

  // sort by year and remove empty sequence at start and end
  for (const p in res) {
    const arr = Object.entries(res[p])
      .map(p => [parseFloat(p[0]), p[1]])
      .sort((a, b) => ((a[0] < b[0]) ? -1 : ((a[0] > b[0]) ? 1 : 0)))
    res[p] = trimResult(arr)
  }
  return res
}

export const mapPieChart = sparqlBindings => {
  const results = sparqlBindings.map(b => {
    return {
      category: b.category.value,
      prefLabel: b.prefLabel.value,
      instanceCount: b.instanceCount.value
    }
  })
  return results
}

export const linearScale = ({ data, config }) => {
  const { variable, minAllowed, maxAllowed } = config
  const length = data.length
  const min = Number(data[length - 1][variable])
  const max = Number(data[0][variable])
  data.forEach(item => {
    if (item[variable]) {
      const unscaledNum = Number(item[variable])
      // https://stackoverflow.com/a/31687097
      const scaled = (maxAllowed - minAllowed) * (unscaledNum - min) / (max - min) + minAllowed
      item[`${variable}Scaled`] = parseFloat(scaled.toFixed(2))
    }
  })
  return data
}

/* Data processing as in:
*  https://github.com/apexcharts/apexcharts.js/blob/master/samples/vue/area/timeseries-with-irregular-data.html
*  Trim zero values from array start and end
*/
const trimResult = arr => {
  //  trim start of array
  let i = 0
  while (i < arr.length && arr[i][1] === 0) i++

  //  end of array
  let j = arr.length - 1
  while (i < j && arr[j][1] === 0) j--

  return arr.slice(i, j + 1)
}

const mapFacetValues = sparqlBindings => {
  const results = sparqlBindings.map(b => {
    try {
      return {
        id: b.id.value,
        prefLabel: b.prefLabel
          ? b.prefLabel.value
          : '0', // temporary prefLabel for <http://ldf.fi/MISSING_VALUE> to support sorting
        selected: b.selected.value,
        parent: b.parent ? b.parent.value : null,
        instanceCount: b.instanceCount.value
      }
    } catch (err) {
      console.log(err)
    }
    return null
  })
  return results
}

const comparator = (a, b) => {
  if (Array.isArray(a.prefLabel)) {
    a.prefLabel = a.prefLabel[0]
  }
  if (Array.isArray(b.prefLabel)) {
    b.prefLabel = b.prefLabel[0]
  }
  return a.prefLabel.localeCompare(b.prefLabel)
}

const recursiveSortAndSelectChildren = nodes => {
  nodes.sort(comparator)
  nodes.forEach(node => {
    if (has(node, 'children')) {
      for (const child of node.children) {
        if (node.selected === 'true') {
          child.selected = 'true'
          child.disabled = 'true'
        }
      }
      recursiveSortAndSelectChildren(node.children)
    }
  })
  return nodes
}

export const toBarChartRaceFormat = ({ data, config }) => {
  const { step } = config
  const firstKey = parseInt(data[0].id)
  const lastKey = parseInt(data[data.length - 1].id)
  const resultObj = {}
  let rawDataIndex = 0
  let lastNonNullIndex = null
  for (let i = firstKey; i <= lastKey; i += step) {
    const dataItemExists = parseInt(data[rawDataIndex].id) === i
    if (dataItemExists) {
      const currentDataItem = dataItemToObject(data[rawDataIndex].dataItem)
      if (i === firstKey) {
        resultObj[i] = currentDataItem
      } else {
        resultObj[i] = mergeDataItems(resultObj[lastNonNullIndex], currentDataItem)
      }
      lastNonNullIndex = i
      rawDataIndex++
    } else {
      resultObj[i] = null
    }
  }
  return resultObj
}

const dataItemToObject = dataItem => {
  if (Array.isArray(dataItem)) {
    return dataItem.reduce((obj, item) => {
      return {
        ...obj,
        [item.id]: {
          prefLabel: item.prefLabel,
          value: parseInt(item.value)
        }
      }
    }, {})
  } else {
    return {
      [dataItem.id]: {
        prefLabel: dataItem.prefLabel,
        value: parseInt(dataItem.value)
      }
    }
  }
}

const mergeDataItems = (itemA, itemB) => {
  const merged = cloneDeep(itemA)
  const keys = Object.keys(itemB)
  for (let i = 0; i < keys.length; i++) {
    const itemBkey = keys[i]
    if (Object.prototype.hasOwnProperty.call(itemA, itemBkey)) {
      merged[itemBkey].value += itemB[itemBkey].value
    } else {
      merged[itemBkey] = itemB[itemBkey]
    }
  }
  return merged
}

export const toPolygonLayerFormat = ({ data, config }) => {
  const scaledData = linearScale({ data, config })
  scaledData.forEach(item => {
    const pointArray = item.polygon.split(' ')
    const deckGlArray = pointArray.map(point => {
      const latLng = point.split(',')
      return [
        parseFloat(parseFloat(latLng[0]).toFixed(4)),
        parseFloat(parseFloat(latLng[1]).toFixed(4))
      ]
    })
    item.polygon = deckGlArray
  })
  // const example = scaledData[0].polygon[0][0]
  // console.log(typeof example)
  // console.log(example)
  return scaledData
}
