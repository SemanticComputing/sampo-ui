import { perspective1Config } from './perspective_configs/Perspective1Config'
import { perspective2Config } from './perspective_configs/Perspective2Config'
import { perspective3Config } from './perspective_configs/Perspective3Config'
import { findsConfig } from './perspective_configs/FindsConfig'
import { actorsConfig } from './perspective_configs/EmloActorsConfig'
import { hellerauConfig } from './perspective_configs/HellerauConfig'
import { speechesConfig } from './perspective_configs/SemparlSpeechesConfig'
import { warsaConfig } from './perspective_configs/WarsaConfig'
import {
  productionPlacesQuery,
  lastKnownLocationsQuery,
  migrationsQuery,
  migrationsDialogQuery,
  manuscriptPropertiesInstancePage,
  expressionProperties,
  collectionProperties,
  productionsByDecadeQuery,
  productionsByDecadeAndCountryQuery,
  eventsByDecadeQuery,
  manuscriptInstancePageNetworkLinksQuery,
  manuscriptFacetResultsNetworkLinksQuery,
  manuscriptNetworkNodesQuery,
  knowledgeGraphMetadataQuery,
  choroplethQuery
} from './sparql_queries/SparqlQueriesPerspective1'
import {
  workProperties
} from './sparql_queries/SparqlQueriesPerspective2'
import {
  eventProperties,
  eventPlacesQuery
} from './sparql_queries/SparqlQueriesPerspective3'
import {
  actorProperties
} from './sparql_queries/SparqlQueriesActors'
import {
  placePropertiesInstancePage,
  placePropertiesInfoWindow,
  manuscriptsProducedAt,
  lastKnownLocationsAt
} from './sparql_queries/SparqlQueriesPlaces'
import {
  findPropertiesInstancePage,
  findsPlacesQuery,
  findsTimelineQuery,
  nearbyFindsQuery
} from './sparql_queries/SparqlQueriesFinds'
import {
  emloLetterLinksQuery,
  emloNetworkNodesQuery,
  emloPeopleEventPlacesQuery,
  emloSentReceivedQuery
} from './sparql_queries/SparqlQueriesEmloActors'
import {
  emloPlacePropertiesInfoWindow,
  emloPeopleRelatedTo
} from './sparql_queries/SparqlQueriesEmloPlaces'
import { hellerauMigrationsQuery } from './sparql_queries/SparqlQueriesHellerau'
import { speechesByYearAndPartyQuery } from './sparql_queries/SparqlQueriesSpeeches'
import { federatedSearchDatasets } from './sparql_queries/SparqlQueriesFederatedSearch'
import { fullTextSearchProperties } from './sparql_queries/SparqlQueriesFullText'
import { sitemapInstancePageQuery } from '../SparqlQueriesGeneral'
import { makeObjectList } from '../SparqlObjectMapper'
import {
  mapPlaces,
  mapLineChart,
  mapMultipleLineChart,
  linearScale,
  toBarChartRaceFormat,
  toPolygonLayerFormat
} from '../Mappers'

export const backendSearchConfig = {
  perspective1: perspective1Config,
  perspective2: perspective2Config,
  perspective3: perspective3Config,
  finds: findsConfig,
  emloActors: actorsConfig,
  hellerau: hellerauConfig,
  semparlSpeeches: speechesConfig,
  warsa: warsaConfig,
  manuscripts: {
    perspectiveID: 'perspective1', // get rest of the config from 'perspective1'
    instance: {
      properties: manuscriptPropertiesInstancePage,
      relatedInstances: ''
    }
  },
  works: {
    perspectiveID: 'perspective1',
    rdfType: 'frbroo:F1_Work',
    includeInSitemap: true,
    instance: {
      properties: workProperties,
      relatedInstances: ''
    }
  },
  events: {
    perspectiveID: 'perspective1',
    instance: {
      properties: eventProperties,
      relatedInstances: ''
    }
  },
  actors: {
    perspectiveID: 'perspective1',
    instance: {
      properties: actorProperties,
      relatedInstances: ''
    }
  },
  places: {
    perspectiveID: 'perspective1',
    instance: {
      properties: placePropertiesInstancePage,
      relatedInstances: ''
    }
  },
  expressions: {
    perspectiveID: 'perspective1',
    instance: {
      properties: expressionProperties,
      relatedInstances: ''
    }
  },
  collections: {
    perspectiveID: 'perspective1',
    instance: {
      properties: collectionProperties,
      relatedInstances: ''
    }
  },
  placesMsProduced: {
    perspectiveID: 'perspective1',
    q: productionPlacesQuery,
    filterTarget: 'manuscripts',
    resultMapper: mapPlaces,
    instance: {
      properties: placePropertiesInfoWindow,
      relatedInstances: manuscriptsProducedAt
    }
  },
  placesMsProducedHeatmap: {
    perspectiveID: 'perspective1',
    q: productionPlacesQuery,
    filterTarget: 'manuscripts',
    resultMapper: mapPlaces
  },
  lastKnownLocations: {
    perspectiveID: 'perspective1',
    q: lastKnownLocationsQuery,
    filterTarget: 'manuscripts',
    resultMapper: mapPlaces,
    instance: {
      properties: placePropertiesInfoWindow,
      relatedInstances: lastKnownLocationsAt
    }
  },
  placesMsMigrations: {
    perspectiveID: 'perspective1',
    q: migrationsQuery,
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
  casualtiesByMunicipality: {
    perspectiveID: 'warsa',
    q: choroplethQuery,
    resultMapper: makeObjectList,
    postprocess: {
      func: toPolygonLayerFormat,
      config: {
        variable: 'death'
      }
    }
  },
  placesMsMigrationsDialog: {
    perspectiveID: 'perspective1',
    q: migrationsDialogQuery,
    filterTarget: 'id',
    resultMapper: makeObjectList
  },
  placesEvents: {
    perspectiveID: 'perspective3',
    q: eventPlacesQuery,
    filterTarget: 'event',
    resultMapper: mapPlaces,
    instance: {
      properties: placePropertiesInfoWindow,
      relatedInstances: ''
    }
  },
  productionTimespanLineChart: {
    perspectiveID: 'perspective1',
    q: productionsByDecadeQuery,
    filterTarget: 'instance',
    resultMapper: mapLineChart,
    resultMapperConfig: {
      fillEmptyValues: false
    }
  },
  productionsByDecadeAndCountry: {
    perspectiveID: 'perspective1',
    q: productionsByDecadeAndCountryQuery,
    filterTarget: 'manuscript',
    resultMapper: makeObjectList,
    postprocess: {
      func: toBarChartRaceFormat,
      config: {
        step: 10
      }
    }
  },
  speechesByYearAndParty: {
    perspectiveID: 'semparlSpeeches',
    q: speechesByYearAndPartyQuery,
    filterTarget: 'speech',
    resultMapper: makeObjectList,
    postprocess: {
      func: toBarChartRaceFormat,
      config: {
        step: 1
      }
    }
  },
  eventLineChart: {
    perspectiveID: 'perspective1',
    q: eventsByDecadeQuery,
    filterTarget: 'manuscript',
    resultMapper: mapMultipleLineChart,
    resultMapperConfig: {
      fillEmptyValues: false
    }
  },
  manuscriptInstancePageNetwork: {
    perspectiveID: 'perspective1',
    q: manuscriptInstancePageNetworkLinksQuery,
    nodes: manuscriptNetworkNodesQuery,
    useNetworkAPI: true
  },
  manuscriptFacetResultsNetwork: {
    perspectiveID: 'perspective1',
    q: manuscriptFacetResultsNetworkLinksQuery,
    nodes: manuscriptNetworkNodesQuery,
    filterTarget: 'manuscript',
    useNetworkAPI: true
  },
  findsPlaces: {
    perspectiveID: 'finds', // use endpoint config from finds
    q: findsPlacesQuery,
    filterTarget: 'id',
    resultMapper: mapPlaces,
    instance: {
      properties: findPropertiesInstancePage,
      relatedInstances: ''
    }
  },
  findsTimeline: {
    perspectiveID: 'finds', // use endpoint config from finds
    q: findsTimelineQuery,
    filterTarget: 'find',
    resultMapper: makeObjectList
  },
  nearbyFinds: {
    perspectiveID: 'finds', // use endpoint config from finds
    q: nearbyFindsQuery,
    resultMapper: makeObjectList,
    instance: {
      properties: findPropertiesInstancePage,
      relatedInstances: ''
    }
  },
  emloPlacesActors: {
    perspectiveID: 'emloActors',
    q: emloPeopleEventPlacesQuery,
    filterTarget: 'person',
    resultMapper: mapPlaces,
    instance: {
      properties: emloPlacePropertiesInfoWindow,
      relatedInstances: emloPeopleRelatedTo
    }
  },
  emloLetterNetwork: {
    perspectiveID: 'emloActors',
    q: emloLetterLinksQuery,
    nodes: emloNetworkNodesQuery,
    useNetworkAPI: true
  },
  emloSentReceived: {
    perspectiveID: 'emloActors',
    q: emloSentReceivedQuery,
    // filterTarget: 'id',
    resultMapper: mapMultipleLineChart,
    resultMapperConfig: {
      fillEmptyValues: false
    }
  },
  hellerauMigrations: {
    perspectiveID: 'hellerau',
    q: hellerauMigrationsQuery,
    filterTarget: 'person__id',
    resultMapper: makeObjectList
  },
  perspective1KnowledgeGraphMetadata: {
    perspectiveID: 'perspective1',
    q: knowledgeGraphMetadataQuery,
    resultMapper: makeObjectList
  },
  jenaText: {
    perspectiveID: 'perspective1',
    properties: fullTextSearchProperties
  },
  federatedSearch: {
    datasets: federatedSearchDatasets
  },
  sitemapConfig: {
    baseUrl: 'https://sampo-ui.demo.seco.cs.aalto.fi',
    langPrimary: 'en',
    langSecondary: 'fi',
    outputDir: './src/server/sitemap_generator',
    sitemapUrl: 'https://sampo-ui.demo.seco.cs.aalto.fi/sitemap',
    sitemapInstancePageQuery
  }
}
