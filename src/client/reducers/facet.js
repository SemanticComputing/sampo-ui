import {
  FETCH_FACET,
  UPDATE_FACET,
  UPDATE_FILTER,
  OPEN_FACET_DIALOG,
  CLOSE_FACET_DIALOG,
} from '../actions';

export const INITIAL_STATE = {
  source: [],
  productionPlace: [],
  author: [],
  sourceIsFetching: false,
  productionPlaceIsFetching: false,
  authorIsFetching: false,
  facetOptions : {
    productionPlace: {
      id: 'productionPlace',
      label: 'Production place',
      //predicate: defined in backend
    },
    author: {
      id: 'author',
      label: 'Author',
      // predicate: defined in backend
    },
    source: {
      id: 'source',
      label: 'Source',
      // predicate: defined in backend
    }
  },
  facetFilters: {
    productionPlace: new Set(),
    author: new Set(),
    source: new Set(),
  },
  updatedFacet: ''
};

const facet = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case OPEN_FACET_DIALOG:
      return {
        ...state,
        facetDialogOpen: true,
        activeFacet: action.property
      };
    case CLOSE_FACET_DIALOG:
      return { ...state, facetDialogOpen: false };
    case FETCH_FACET:
      return {
        ...state,
        [ `${action.id}IsFetching` ]: true
      };
    case UPDATE_FACET:
      console.log(action.facetValues)
      return {
        ...state,
        [ action.id ]: action.facetValues,
        [ `${action.id}IsFetching` ]: false
      };
    case UPDATE_FILTER:
      return updateFilter(state, action);
    default:
      return state;
  }
};

const updateFilter = (state, action) => {
  const { property, value } = action.filter;
  let nSet = state.facetFilters[property];
  if (nSet.has(value)) {
    nSet.delete(value);
  } else {
    nSet.add(value);
  }
  const newFilter = updateObject(state.filters, {
    [property]: nSet,
  });
  return updateObject(state, {
    facetFilters: newFilter,
    updatedFacet: property
  });
};

const updateObject = (oldObject, newValues) => {
  // Encapsulate the idea of passing a new object as the first parameter
  // to Object.assign to ensure we correctly copy data instead of mutating
  //console.log(Object.assign({}, oldObject, newValues));
  return Object.assign({}, oldObject, newValues);
};

export default facet;
