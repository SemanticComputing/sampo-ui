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

export const mapFacet = sparqlBindings => {
  const results = makeObjectList(sparqlBindings);
  if (results[results.length - 1].instanceCount == 0) {
    results.pop();
  }
  return {
    distinctValueCount: results.length,
    values: results
  };
};

export const mapHierarchicalFacet = sparqlBindings => {
  const results = makeObjectList(sparqlBindings);
  //console.log(results)
  results.push({
    id: 'http://ldf.fi/mmm/places/sdbm_not_linked',
    prefLabel: 'SDBM places not linked to TGN',
    selected: 'false',
    source: 'http://ldf.fi/mmm/schema/SDBM',
    instanceCount: '0',
    parent: '0'
  });
  results.push({
    id: 'http://ldf.fi/mmm/places/bodley_not_linked',
    prefLabel: 'Bodley places not linked to TGN',
    selected: 'false',
    source: 'http://ldf.fi/mmm/schema/Bodley',
    instanceCount: '0',
    parent: '0'
  });
  results.push({
    id: 'http://ldf.fi/mmm/places/bibale_not_linked',
    prefLabel: 'Bibale places not linked to TGN',
    selected: 'false',
    source: 'http://ldf.fi/mmm/schema/Bibale',
    instanceCount: '0',
    parent: '0'
  });
  let treeData = getTreeFromFlatData({
    flatData: results,
    getKey: node => node.id, // resolve a node's key
    getParentKey: getParentKey, // resolve node's parent's key
    rootKey: '0', // The value of the parent key when there is no parent (i.e., at root level)
  });
  treeData = recursiveSort(treeData);
  treeData.forEach(node => sumUp(node));
  return {
    distinctValueCount: results.length,
    flatValues: results,
    values: treeData
  };
};

const rootLevel = new Set([
  'http://ldf.fi/mmm/places/tgn_7029392',
  'http://ldf.fi/mmm/places/sdbm_not_linked',
  'http://ldf.fi/mmm/places/bodley_not_linked',
  'http://ldf.fi/mmm/places/bibale_not_linked'
]);

const getParentKey = node => {
  let parent = '';
  if (node.parent === '0' && !rootLevel.has(node.id)) {
    if (Array.isArray(node.source)) {
      if (node.source.indexOf('http://ldf.fi/mmm/schema/SDBM') != -1) {
        parent = 'http://ldf.fi/mmm/places/sdbm_not_linked';
      } else if (node.source.indexOf('http://ldf.fi/mmm/schema/Bodley') != -1) {
        parent = 'http://ldf.fi/mmm/places/bodley_not_linked';
      } else if (node.source.indexOf('http://ldf.fi/mmm/schema/Bibale') != -1) {
        parent = 'http://ldf.fi/mmm/places/bibale_not_linked';
      }
    } else if (node.source === 'http://ldf.fi/mmm/schema/SDBM') {
      parent = 'http://ldf.fi/mmm/places/sdbm_not_linked';
    } else if (node.source === 'http://ldf.fi/mmm/schema/Bodley') {
      parent = 'http://ldf.fi/mmm/places/bodley_not_linked';
    } else if (node.source === 'http://ldf.fi/mmm/schema/Bibale') {
      parent = 'http://ldf.fi/mmm/places/bibale_not_linked';
    }
  } else {
    parent = node.parent;
  }
  return parent;
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
