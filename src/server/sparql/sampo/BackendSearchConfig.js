import { perspective1Config } from './Perspective1Config'
import { perspective2Config } from './Perspective2Config'
import { perspective3Config } from './Perspective3Config'
import {
  productionPlacesQuery,
  lastKnownLocationsQuery,
  migrationsQuery
} from './SparqlQueriesPerspective1'
import { /* eventProperties, */ eventPlacesQuery } from './SparqlQueriesPerspective3'
import {
  placePropertiesInfoWindow,
  manuscriptsProducedAt,
  lastKnownLocationsAt
} from './SparqlQueriesPlaces'
import { federatedSearchDatasets } from './SparqlQueriesFederatedSearch'
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
