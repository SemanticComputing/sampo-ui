import { perspective1Config } from './perspective_configs/Perspective1Config'
import { perspective2Config } from './perspective_configs/Perspective2Config'
import { perspective3Config } from './perspective_configs/Perspective3Config'
// import { federatedSearchDatasets } from './sparql_queries/SparqlQueriesFederatedSearch'
// import { fullTextSearchProperties } from './sparql_queries/SparqlQueriesFullText'
// import { sitemapInstancePageQuery } from '../SparqlQueriesGeneral'
import { makeObjectList } from '../SparqlObjectMapper'
import {
  mapPlaces,
  mapLineChart,
  mapMultipleLineChart,
  linearScale,
  toBarChartRaceFormat
  // toPolygonLayerFormat
} from '../Mappers'

export const backendSearchConfig = {
  perspective1: perspective1Config,
  perspective2: perspective2Config,
  perspective3: perspective3Config,
  placesMsProduced: {
    perspectiveID: 'perspective1',
    q: 'productionPlacesQuery',
    filterTarget: 'manuscripts',
    resultMapper: mapPlaces,
    instance: {
      properties: 'placePropertiesInfoWindow',
      relatedInstances: 'manuscriptsProducedAt'
    }
  },
  placesMsProducedHeatmap: {
    perspectiveID: 'perspective1',
    q: 'productionPlacesQuery',
    filterTarget: 'manuscripts',
    resultMapper: mapPlaces
  },
  lastKnownLocations: {
    perspectiveID: 'perspective1',
    q: 'lastKnownLocationsQuery',
    filterTarget: 'manuscripts',
    resultMapper: mapPlaces,
    instance: {
      properties: 'placePropertiesInfoWindow',
      relatedInstances: 'lastKnownLocationsAt'
    }
  },
  placesMsMigrations: {
    perspectiveID: 'perspective1',
    q: 'migrationsQuery',
    filterTarget: 'manuscript',
    resultMapper: makeObjectList,
    postprocess: {
      func: linearScale,
      config: {
        variable: 'instanceCount',
        minAllowed: 3,
        maxAllowed: 30
      }
    }
  },
  placesMsMigrationsDialog: {
    perspectiveID: 'perspective1',
    q: 'migrationsDialogQuery',
    filterTarget: 'id',
    resultMapper: makeObjectList
  },
  placesEvents: {
    perspectiveID: 'perspective3',
    q: 'eventPlacesQuery',
    filterTarget: 'event',
    resultMapper: mapPlaces,
    instance: {
      properties: 'placePropertiesInfoWindow'
    }
  },
  productionTimespanLineChart: {
    perspectiveID: 'perspective1',
    q: 'productionsByDecadeQuery',
    filterTarget: 'instance',
    resultMapper: mapLineChart,
    resultMapperConfig: {
      fillEmptyValues: false
    }
  },
  productionsByDecadeAndCountry: {
    perspectiveID: 'perspective1',
    q: 'productionsByDecadeAndCountryQuery',
    filterTarget: 'manuscript',
    resultMapper: makeObjectList,
    postprocess: {
      func: toBarChartRaceFormat,
      config: {
        step: 10
      }
    }
  },
  eventLineChart: {
    perspectiveID: 'perspective1',
    q: 'eventsByDecadeQuery',
    filterTarget: 'manuscript',
    resultMapper: mapMultipleLineChart,
    resultMapperConfig: {
      fillEmptyValues: false
    }
  },
  manuscriptInstancePageNetwork: {
    perspectiveID: 'perspective1',
    q: 'manuscriptInstancePageNetworkLinksQuery',
    nodes: 'manuscriptNetworkNodesQuery',
    useNetworkAPI: true
  },
  manuscriptFacetResultsNetwork: {
    perspectiveID: 'perspective1',
    q: 'manuscriptFacetResultsNetworkLinksQuery',
    nodes: 'manuscriptNetworkNodesQuery',
    filterTarget: 'manuscript',
    useNetworkAPI: true
  },
  perspective1KnowledgeGraphMetadata: {
    perspectiveID: 'perspective1',
    q: 'knowledgeGraphMetadataQuery',
    resultMapper: makeObjectList
  },
  jenaText: {
    perspectiveID: 'perspective1',
    properties: 'fullTextSearchProperties'
  }
}
