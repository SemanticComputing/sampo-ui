import {
  FETCH_FACET,
  FETCH_FACET_FAILED,
  UPDATE_FACET,
  UPDATE_FILTER,
  OPEN_FACET_DIALOG,
  CLOSE_FACET_DIALOG,
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
      containerSize: 'small',
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
      containerSize: 'large',
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
      containerSize: 'large',
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
              flatValues: action.flatValues || [],
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
