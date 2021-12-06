export const perspectiveConfig = [
  {
    id: 'perspective1',
    frontPageImage: 'main_page/manuscripts-452x262.jpg',
    defaultActiveFacets: [],
    defaultTab: 'table',
    defaultInstancePageTab: 'table',
    tabs: [
      {
        id: 'table',
        value: 0,
        icon: 'CalendarViewDay'
      },
      {
        id: 'production_places',
        value: 1,
        icon: 'AddLocation'
      },
      {
        id: 'production_places_heatmap',
        value: 2,
        icon: 'AddLocation'
      },
      {
        id: 'production_dates',
        value: 3,
        icon: 'ShowChart'
      },
      {
        id: 'event_dates',
        value: 4,
        icon: 'ShowChart'
      },
      {
        id: 'last_known_locations',
        value: 5,
        icon: 'LocationOn'
      },
      {
        id: 'migrations',
        value: 6,
        icon: 'Redo'
      },
      {
        id: 'network',
        value: 7,
        icon: 'BubbleChart'
      },
      {
        id: 'export',
        value: 8,
        icon: 'CloudDownload'
      }
    ],
    instancePageTabs: [
      {
        id: 'table',
        value: 0,
        icon: 'CalendarViewDay'
      },
      {
        id: 'network',
        value: 1,
        icon: 'BubbleChart'
      },
      {
        id: 'export',
        value: 2,
        icon: 'CloudDownload'
      }
    ]
  },
  {
    id: 'perspective2',
    frontPageImage: 'main_page/works-452x262.jpg',
    defaultActiveFacets: ['prefLabel'],
    tabs: [
      {
        id: 'table',
        value: 0,
        icon: 'CalendarViewDay'
      },
      {
        id: 'export',
        value: 1,
        icon: 'CloudDownload'
      }
    ],
    instancePageTabs: [
      {
        id: 'table',
        value: 0,
        icon: 'CalendarViewDay'
      },
      {
        id: 'export',
        value: 1,
        icon: 'CloudDownload'
      }
    ]
  },
  {
    id: 'perspective3',
    frontPageImage: 'main_page/events-452x262.jpg',
    defaultActiveFacets: new Set(['prefLabel']),
    tabs: [
      {
        id: 'table',
        value: 0,
        icon: 'CalendarViewDay'
      },
      {
        id: 'map',
        value: 1,
        icon: 'AddLocation'
      },

      {
        id: 'export',
        value: 2,
        icon: 'CloudDownload'
      }
    ],
    instancePageTabs: [
      {
        id: 'table',
        value: 0,
        icon: 'CalendarViewDay'
      },

      {
        id: 'export',
        value: 1,
        icon: 'CloudDownload'
      }
    ]
  },
  {
    id: 'finds',
    isHidden: true,
    frontPageImage: null,
    defaultActiveFacets: new Set(['prefLabel']),
    tabs: [
      {
        id: 'table',
        value: 0,
        icon: 'CalendarViewDay'
      },
      {
        id: 'map',
        value: 1,
        icon: 'AddLocation'
      },
      {
        id: 'export',
        value: 2,
        icon: 'CloudDownload'
      }
    ],
    instancePageTabs: [
      {
        id: 'table',
        value: 0,
        icon: 'CalendarViewDay'
      },
      {
        id: 'recommendations',
        value: 1,
        icon: 'Star'
      },
      {
        id: 'export',
        value: 2,
        icon: 'CloudDownload'
      }
    ]
  },
  {
    id: 'fullTextSearch',
    isHidden: true,
    searchMode: 'full-text-search'
  },
  {
    id: 'clientFSPlaces',
    frontPageImage: 'main_page/places-452x262.jpg',
    defaultActiveFacets: ['datasetSelector'],
    searchMode: 'federated-search',
    tabs: [
      {
        id: 'table',
        value: 0,
        icon: 'CalendarViewDay'
      },
      {
        id: 'map_clusters',
        value: 1,
        icon: 'TripOrigin'
      },
      {
        id: 'map_markers',
        value: 2,
        icon: 'LocationOn'
      },
      {
        id: 'statistics',
        value: 3,
        icon: 'PieChart'
      },
      {
        id: 'download',
        value: 4,
        icon: 'CloudDownload'
      }
    ]
  }
]

// console.log(JSON.stringify(perspectiveConfig))
