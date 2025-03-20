import React from 'react'
import DateFacet, { DateFacetComponent } from './DateFacet'
import Center from '../../../../.storybook/Center'
import PaperContainer from '../../../../.storybook/PaperContainer'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import 'moment/locale/fi'
// import 'moment/locale/en'

const facet = {
  id: 'birthTimespan',
  // predicate: defined in backend
  distinctValueCount: 0,
  values: [],
  flatValues: [],
  sortBy: null,
  sortDirection: null,
  sortButton: false,
  spatialFilterButton: false,
  isFetching: false,
  searchField: false,
  containerClass: 'three',
  filterType: 'dateFilter',
  min: '1800-01-01',
  max: '1922-12-31',
  timespanFilter: null,
  type: 'date'
}

export default {
  component: DateFacetComponent,
  title: 'Sampo-UI/facet_bar/DateFacet',
  decorators: [storyFn =>
    <Center><PaperContainer>{storyFn()}</PaperContainer></Center>
  ]
}

export const basic = props => {
  const facetID = 'productionTimespan'
  return (
    <div style={{ width: 400, height: 150 }}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DateFacet
          facetID={facetID}
          facet={facet}
          facetClass='perspective1'
          resultClass='perspective1'
          facetUpdateID={0}
          fetchFacet={() => null}
          someFacetIsFetching={false}
          updateFacetOption={() => null}
        />
      </LocalizationProvider>
    </div>
  )
}
