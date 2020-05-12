import { perspective1Config } from './perspective_configs/Perspective1Config'
import { perspective2Config } from './perspective_configs/Perspective2Config'
import { perspective3Config } from './perspective_configs/Perspective3Config'
import {
  productionPlacesQuery,
  lastKnownLocationsQuery,
  migrationsQuery
} from './sparql_queries/SparqlQueriesPerspective1'
import { /* eventProperties, */ eventPlacesQuery } from './sparql_queries/SparqlQueriesPerspective3'
import {
  placePropertiesInfoWindow,
  manuscriptsProducedAt,
  lastKnownLocationsAt
} from './sparql_queries/SparqlQueriesPlaces'
import { federatedSearchDatasets } from './sparql_queries/SparqlQueriesFederatedSearch'
import { makeObjectList } from '../SparqlObjectMapper'
import { mapPlaces } from '../Mappers'

export const backendSearchConfig = {
  perspective1: perspective1Config,
  perspective2: perspective2Config,
  perspective3: perspective3Config,
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
    filterTarget: 'manuscript__id',
    resultMapper: makeObjectList
  },
  placesEvents: {
    perspectiveID: 'perspective3',
    q: eventPlacesQuery,
    filterTarget: 'manuscript__id',
    resultMapper: mapPlaces,
    instance: {
      properties: placePropertiesInfoWindow,
      relatedInstances: ''
    }
  },
  jenaText: {
    endpoint: {
      url: 'http://ldf.fi/mmm/sparql',
      useAuth: false
    }
  },
  federatedSearch: {
    datasets: federatedSearchDatasets
  }
}
