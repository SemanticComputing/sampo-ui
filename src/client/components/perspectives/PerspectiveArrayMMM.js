export const perspectiveArr = [
  {
    id: 'manuscripts',
    label: 'Manuscripts',
    desc: 'Physical manuscript objects.',
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
    desc: 'Intellectual content carried out by manuscripts.',
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
    desc: 'Events related to manuscripts.',
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
    desc: 'People and institutions related to manuscripts and works.',
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
    desc: 'Places related to manuscripts and works.',
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
