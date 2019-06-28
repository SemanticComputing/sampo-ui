import { has } from 'lodash';
import { getTreeFromFlatData } from 'react-sortable-tree';
// import { makeObjectList } from './SparqlObjectMapper';

export const mapPlaces = sparqlBindings => {
  //console.log(sparqlBindings);
  const results = sparqlBindings.map(b => {
    return {
      id: b.id.value,
      prefLabel: b.prefLabel.value,
      lat: has(b, 'lat',) ? b.lat.value : 'Undefined',
      long: has(b, 'long',) ? b.long.value : 'Undefined',
      source: has(b, 'source',) ? b.source.value : 'Undefined',
      dataProviderUrl: has(b, 'dataProviderUrl',) ? b.dataProviderUrl.value : 'Undefined',
      instanceCount: has(b, 'instanceCount',) ? b.instanceCount.value : 'Undefined',
    };
  });
  return results;
};

export const mapCount = sparqlBindings => {
  return sparqlBindings[0].count.value;
};

export const mapFacet = sparqlBindings => {
  let results = [];
  if (sparqlBindings.length > 0) {
    results = mapFacetValues(sparqlBindings);
  }
  return results;
};

export const mapHierarchicalFacet = sparqlBindings => {
  const results = mapFacetValues(sparqlBindings);
  //const flatResults = results;
  let treeData = getTreeFromFlatData({
    flatData: results,
    getKey: node => node.id, // resolve a node's key
    getParentKey: node => node.parent, // resolve node's parent's key
    rootKey: '0', // The value of the parent key when there is no parent (i.e., at root level)
  });
  treeData = recursiveSort(treeData);
  treeData.forEach(node => sumUpAndSelectChildren(node));
  return treeData;
};

export const mapTimespanFacet = sparqlBindings => {
  const b =  sparqlBindings[0];
  return {
    min: b.min.value,
    max: b.max.value
  };
};

const mapFacetValues = sparqlBindings => {
  const results = sparqlBindings.map(b => {
    try {
      return {
        id: b.id.value,
        prefLabel: b.prefLabel.value,
        selected: b.selected.value,
        parent: b.parent.value,
        instanceCount: b.instanceCount.value
      };
    } catch(err) {
      console.log(err);
    }
  });
  return results;
};

const comparator = (a, b) => {
  if (Array.isArray(a.prefLabel)) {
    a.prefLabel = a.prefLabel[0];
  }
  if (Array.isArray(b.prefLabel)) {
    b.prefLabel = b.prefLabel[0];
  }
  return a.prefLabel.localeCompare(b.prefLabel);
};


const sumUpAndSelectChildren = node => {
  node.totalInstanceCount = parseInt(node.instanceCount);
  if (has(node, 'children')) {
    for (let child of node.children) {
      if (node.selected == 'true') {
        child.selected = 'true';
        child.disabled = 'true';
      }
      node.totalInstanceCount += sumUpAndSelectChildren(child);
    }
  }
  return node.totalInstanceCount;
};

const recursiveSort = nodes => {
  nodes.sort(comparator);
  nodes.forEach(node => {
    if (has(node, 'children')) {
      recursiveSort(node.children);
    }
  });
  return nodes;
};
