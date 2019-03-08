import {
  FETCH_FACET,
  FETCH_FACET_FAILED,
  UPDATE_FACET,
  UPDATE_FILTER,
} from '../actions';
import { updateFilter } from './helpers';

export const INITIAL_STATE = {
  facets: {
    source: {
      id: 'source',
      label: 'Source',
      // predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      sortBy: 'instanceCount',
      sortDirection: 'desc',
      sortButton: false,
      isFetching: false,
      searchField: false,
      containerClass: 'three',
    },
    productionPlace: {
      id: 'productionPlace',
      label: 'Production place',
      //predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      sortBy: 'prefLabel',
      sortDirection: 'asc',
      sortButton: false,
      isFetching: false,
      searchField: true,
      containerClass: 'ten',
    },
    author: {
      id: 'author',
      label: 'Author',
      // predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      sortBy: 'prefLabel',
      sortDirection: 'asc',
      sortButton: false,
      isFetching: false,
      searchField: true,
      containerClass: 'ten',
    },
    // language: {
    //   id: 'language',
    //   label: 'Language',
    //   // predicate: defined in backend
    //   distinctValueCount: 0,
    //   values: [],
    //   sortBy: 'instanceCount',
    //   sortDirection: 'asc',
    //   isFetching: false,
    // },
  },
  filters: {
    productionPlace: new Set(),
    author: new Set(),
    source: new Set(),
    language: new Set(),
  },
  updatedFacet: null,
};

const manuscriptsFacets = (state = INITIAL_STATE, action) => {
  if (action.resultClass === 'manuscripts') {
    switch (action.type) {
      case FETCH_FACET:
        return {
          ...state,
          facets: {
            ...state.facets,
            [ action.id ]: {
              ...state.facets[action.id],
              isFetching: true
            }
          }
        };
      case FETCH_FACET_FAILED:
        return {
          ...state,
          facets: {
            ...state.facets,
            [ action.id ]: {
              ...state.facets[action.id],
              isFetching: false,
            }
          },
          filters: {
            productionPlace: new Set(),
            author: new Set(),
            source: new Set(),
            language: new Set(),
          },
          updatedFacet: '',
        };
      case UPDATE_FACET:
        return {
          ...state,
          facets: {
            ...state.facets,
            [ action.id ]: {
              ...state.facets[action.id],
              distinctValueCount: action.distinctValueCount,
              values: action.values,
              // flatValues: action.flatValues || [],
              sortBy: action.sortBy,
              sortDirection: action.sortDirection,
              isFetching: false
            }
          }
        };
      case UPDATE_FILTER:
        return updateFilter(state, action);
      default:
        return state;
    }
  } else return state;
};

export default manuscriptsFacets;
