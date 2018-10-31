import _ from 'lodash';

/**
* @param {Array} objects A list of objects as SPARQL results.
* @returns {Array} The mapped object list.
* @description
* Map the SPARQL results as objects, and return a list where result rows with the same
* id are merged into one object.
*/
export const makeObjectList = (objects) => {
  // console.log(objects)
  let objList = _.transform(objects, function(result, obj) {
    if (!obj.id) {
      return null;
    }
    //let orig = obj;
    obj = makeObject(obj);
    //obj = reviseObject(obj, orig);
    mergeValueToList(result, obj);
  });
  return objList;
  //return self.postProcess(objList);
};

export const makeDict = (objects) => {
  return arrayToObject(objects, 'id');
};

/**
* @param {Object} obj A single SPARQL result row object.
* @returns {Object} The mapped object.
* @description
* Flatten the result object. Discard everything except values.
* Assume that each property of the obj has a value property with
* the actual value.
*/
const makeObject = (obj) => {
  let o = new Object;
  _.forIn(obj, function(value, key) {
    // If the variable name contains "__", an object
    // will be created as the value
    // E.g. { place__id: '1' } -> { place: { id: '1' } }
    _.set(o, key.replace(/__/g, '.'), value.value);
  });
  return o;
};

/**
* @param {Array} valueList A list to which the value should be added.
* @param {Object} value The value to add to the list.
* @returns {Array} The merged list.
* @description
* Add the given value to the given list, merging an object value to and
* object in the list if both have the same id attribute.
* A value already present in valueList is discarded.
*/
const mergeValueToList = (valueList, value) => {
  let old;
  if (_.isObject(value) && value.id) {
    // Check if this object has been constructed earlier
    old = _.findLast(valueList, function(e) {
      return e.id === value.id;
    });
    if (old) {
      // Merge this object to the object constructed earlier
      mergeObjects(old, value);
    }
  } else {
    // Check if this value is present in the list
    old = _.findLast(valueList, function(e) {
      return _.isEqual(e, value);
    });
  }
  if (!old) {
    // This is a distinct value
    valueList.push(value);
  }
  return valueList;
};

/**
* @param {Object} first An object as returned by makeObject.
* @param {Object} second The object to merge with the first.
* @returns {Object} The merged object.
* @description
* Merges two objects.
*/
const mergeObjects = (first, second) => {
  // Merge two objects into one object.
  return _.mergeWith(first, second, merger);
};

const merger = (a, b) => {
  if (_.isEqual(a, b)) {
    return a;
  }
  if (a && !b) {
    return a;
  }
  if (b && !a) {
    return b;
  }
  if (_.isArray(a)) {
    if (_.isArray(b)) {
      b.forEach(function(bVal) {
        return mergeValueToList(a, bVal);
      });
      return a;
    }
    return mergeValueToList(a, b);
  }
  if (_.isArray(b)) {
    return mergeValueToList(b, a);
  }
  if (!(_.isObject(a) && _.isObject(b) && a.id === b.id)) {
    return [a, b];
  }
  return mergeObjects(a, b);
};

const arrayToObject = (array, keyField) =>
  array.reduce((obj, item) => {
    let newItem = {};
    Object.entries(item).forEach(([key, value]) => {
      if (key !== keyField) {
        if (key === 'manuscript') {
          newItem[key] = value.value.split(',');
        } else {
          newItem[key] = value.value;
        }
      }
    });
    obj[item[keyField].value] = newItem;
    return obj;
  }, {});
