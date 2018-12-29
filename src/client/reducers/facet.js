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
  language: [],
  sourceIsFetching: false,
  productionPlaceIsFetching: false,
  authorIsFetching: false,
  languageIsFetching: false,
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
    },
    language: {
      id: 'language',
      label: 'Language',
      // predicate: defined in backend
    }
  },
  facetFilters: {
    productionPlace: new Set(),
    author: new Set(),
    source: new Set(),
    language: new Set(),
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
  let valueSet = state.facetFilters[property];
  if (valueSet.has(value)) {
    valueSet.delete(value);
  } else {
    valueSet.add(value);
  }
  const newFacetFilters = {
    ...state.facetFilters,
    [ property ] : valueSet
  };
  return {
    ...state,
    facetFilters: newFacetFilters,
    updatedFacet: property
  };
};

export default facet;
