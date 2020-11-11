import { has } from 'lodash'
import { getTreeFromFlatData } from 'react-sortable-tree'
// import { makeObjectList } from './SparqlObjectMapper';

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
  // console.log(sparqlBindings);
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
  treeData = recursiveSort(treeData)
  treeData.forEach(node => sumUpAndSelectChildren(node))
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

export const mapLineChart = sparqlBindings => {
  const seriesData = []
  const categoriesData = []
  sparqlBindings.map(b => {
    seriesData.push(b.count.value)
    categoriesData.push(b.category.value)
  })
  return {
    seriesData,
    categoriesData
  }
}

export const mapLineChartFillEmptyValues = sparqlBindings => {
  const seriesData = []
  const categoriesData = []
  const sparqlBindingsLength = sparqlBindings.length
  sparqlBindings.map((b, index, bindings) => {
    const currentCategory = b.category.value
    const currentValue = b.count.value
    seriesData.push(currentValue)
    categoriesData.push(currentCategory)
    if (index + 1 < sparqlBindingsLength) {
      let currentCategoryInt = parseInt(currentCategory)
      const nextCategoryInt = parseInt(bindings[index + 1].category.value)
      while (currentCategoryInt < nextCategoryInt) {
        currentCategoryInt += 1
        seriesData.push(0)
        categoriesData.push(currentCategoryInt)
      }
    }
  })
  return {
    seriesData,
    categoriesData
  }
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

export const mapMultipleLineChart = sparqlBindings => {
  const res = {}
  sparqlBindings.forEach(b => {
    for (const p in b) {
      if (p !== 'category') {
        res[p] = []
      }
    }
  })
  const category = sparqlBindings.map(p => parseFloat(p.category.value))
  sparqlBindings.forEach((b, i) => {
    for (const p in b) {
      if (p !== 'category') {
        res[p].push([category[i], parseFloat(b[p].value)])
      }
    }
  })
  for (const p in res) {
    res[p] = trimResult(res[p])
  }
  return res
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
        prefLabel: b.prefLabel.value,
        selected: b.selected.value,
        parent: b.parent ? b.parent.value : null,
        instanceCount: b.instanceCount.value
      }
    } catch (err) {
      console.log(err)
    }
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

const sumUpAndSelectChildren = node => {
  node.totalInstanceCount = parseInt(node.instanceCount)
  if (has(node, 'children')) {
    for (const child of node.children) {
      if (node.selected === 'true') {
        child.selected = 'true'
        child.disabled = 'true'
      }
      node.totalInstanceCount += sumUpAndSelectChildren(child)
    }
  }
  return node.totalInstanceCount
}

const recursiveSort = nodes => {
  nodes.sort(comparator)
  nodes.forEach(node => {
    if (has(node, 'children')) {
      recursiveSort(node.children)
    }
  })
  return nodes
}
