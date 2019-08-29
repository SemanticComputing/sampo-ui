export const perspectiveArr = [
  {
    id: 'manuscripts',
    label: 'Manuscripts',
    mainPageDesc: 'Physical manuscript objects',
    perspectiveDesc: `
      Use this perspective to access data related to physical manuscript objects.
      The paginated tabular result view is default, including all manuscripts in
      the MMM data. One table row is equivalent to one manuscript.

      If two or more source datasets include the same manuscript and this has been
      manually verified, the information from the source datasets has been merged
      into one table row.

      To view the production places of manuscripts on a map, choose the “Production
      Place” tab.
    `,
    perspectiveDescHeight: 99,
    defaultActiveFacets: new Set(['prefLabel']),
    tabs: [
      {
        id: 'table',
        label: 'table',
        value: 0,
        icon: 'CalendarViewDay',
      },
      {
        id: 'production_places',
        label: 'production places',
        value: 1,
        icon: 'AddLocation',
      },
      {
        id: 'migrations',
        label: 'migrations',
        value: 2,
        icon: 'Redo',
      },
      {
        id: 'export',
        label: 'export',
        value: 3,
        icon: 'Download',
      }
    ]
  },
  {
    id: 'works',
    label: 'Works',
    mainPageDesc: 'Intellectual content carried out by manuscripts.',
    perspectiveDesc: `
      Use this perspective to access data related to Works. The table view gives
      you a list of specific works, and the manuscripts and manuscript
      collections in which they can be found.
    `,
    perspectiveDescHeight: 99,
    defaultActiveFacets: new Set(['prefLabel']),
    tabs: [
      {
        id: 'table',
        label: 'table',
        value: 0,
        icon: 'CalendarViewDay',
      }
    ]
  },
  {
    id: 'events',
    label: 'Events',
    mainPageDesc: 'Events related to manuscripts.',
    perspectiveDesc: `
      Use this perspective to access data related to events. The table view gives you a
      list of specific events associated with the histories of manuscripts and manuscript
      collections over the centuries.
    `,
    perspectiveDescHeight: 99,
    defaultActiveFacets: new Set(['type']),
    tabs: [
      {
        id: 'table',
        label: 'table',
        value: 0,
        icon: 'CalendarViewDay',
      }
    ]
  },
  {
    id: 'actors',
    label: 'Actors',
    mainPageDesc: 'People and institutions related to manuscripts and works.',
    perspectiveDesc: `
      This perspective provides access to data related to the persons and institutions who
      impacted the production or dissemination of manuscripts and works. Actors include authors
      of works, artists and scribes who produced manuscripts, and the individual owners and
      institutions who bought or sold manuscripts.

      The paginated tabular result view is default, including all actors in the MMM data. One
      table row is equivalent to one actor. Use the map view to visualize the connection
      between Actors and the places where they lived or were located. These links are
      indicated by the markers on the map. The markers cluster by region or nation,
      and resolve themselves into more specific locations as you zoom in on the map. Blue
      markers cannot be resolved any further: click on them to reveal links to the Actor
      records associated with that location.
    `,
    perspectiveDescHeight: 99,
    defaultActiveFacets: new Set(['prefLabel']),
    tabs: [
      {
        id: 'table',
        label: 'table',
        value: 0,
        icon: 'CalendarViewDay',
      },
      {
        id: 'map',
        label: 'map',
        value: 1,
        icon: 'AddLocation',
      },
    ]
  },
  {
    id: 'places',
    label: 'Places',
    mainPageDesc: 'Places related to manuscripts and works.',
    perspectiveDesc: `
      Use this perspective to access data related to places. The map is default,
      showing clusters of places named in the datasets. This includes everything
      from continents ("North America") to countries ("Canada") to
      regions/provinces ("British Columbia") to cities ("Vancouver").
      The table view will give you a list of the same places.
    `,
    perspectiveDescHeight: 99,
    defaultActiveFacets: new Set(['prefLabel']),
    tabs: [
      {
        id: 'table',
        label: 'table',
        value: 0,
        icon: 'CalendarViewDay',
      },
      {
        id: 'map',
        label: 'map',
        value: 1,
        icon: 'AddLocation',
      },
    ]
  },
];
