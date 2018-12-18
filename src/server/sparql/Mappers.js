import { has } from 'lodash';
import { getTreeFromFlatData } from 'react-sortable-tree';
import { makeObjectList } from './SparqlObjectMapper';

export const mapPlaces = (sparqlBindings) => {
  //console.log(sparqlBindings);
  const results = sparqlBindings.map(b => {
    return {
      id: b.id.value,
      label: b.label.value,
      lat: has(b, 'lat',) ? b.lat.value : 'Undefined',
      long: has(b, 'long',) ? b.long.value : 'Undefined',
      source: has(b, 'source',) ? b.source.value : 'Undefined',
      manuscript: has(b, 'manuscript',) ? b.manuscript.value.split(',') : 'Undefined',
      manuscriptCount: has(b, 'manuscriptCount',) ? b.manuscriptCount.value : 'Undefined',
    };
  });
  return results;
};

export const mapCount = (sparqlBindings) => {
  return {
    count: sparqlBindings[0].count.value
  };
};

export const mapHierarchicalFacet = sparqlBindings => {
  const results = makeObjectList(sparqlBindings);
  let treeData = getTreeFromFlatData({
    flatData: results,
    getKey: node => node.id, // resolve a node's key
    getParentKey: node => node.parent, // resolve node's parent's key
    rootKey: 0, // The value of the parent key when there is no parent (i.e., at root level)
  });
  treeData = recursiveSort(treeData);
  treeData.forEach(node => sumUp(node));
  return treeData;
};

const comparator = (a, b) => a.prefLabel.localeCompare(b.prefLabel);

const sumUp = node => {
  node.totalInstanceCount = parseInt(node.instanceCount);
  if (has(node, 'children')) {
    for (let child of node.children) {
      node.totalInstanceCount += sumUp(child);
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
