import {
  FETCH_FACET,
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
    area: {
      id: 'area',
      label: 'Area',
      // predicate: defined in backend
      distinctValueCount: 0,
      values: [],
      flatValues: [],
      sortBy: 'prefLabel',
      sortDirection: 'asc',
      sortButton: false,
      isFetching: false,
      searchField: false,
      containerSize: 'large',
    },
    // type: {
    //   id: 'type',
    //   label: 'Type',
    //   // predicate: defined in backend
    //   distinctValueCount: 0,
    //   values: [],
    //   flatValues: [],
    //   sortBy: 'instanceCount',
    //   sortDirection: 'desc',
    //   sortButton: false,
    //   isFetching: false,
    //   searchField: false,
    //   containerSize: 'large',
    //} ,
  },
  filters: {
    source: new Set(),
    area: new Set(),
    type: new Set(),
  },
  updatedFacet: '',
  fetching: false
};

const placesFacets = (state = INITIAL_STATE, action) => {
  if (action.resultClass === 'places') {
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
          fetching: true,
          facets: {
            ...state.facets,
            [ action.id ]: {
              ...state.facets[action.id],
              distinctValueCount: 0,
              values: [],
              flatValues: [],
              sortBy: action.sortBy,
              sortDirection: action.sortDirection,
              isFetching: true
            }
          }
        };
      case UPDATE_FACET:
        return {
          ...state,
          fetching: false,
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

export default placesFacets;
