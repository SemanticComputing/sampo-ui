import React from 'react'
import CalendarViewDayIcon from '@material-ui/icons/CalendarViewDay'
import AddLocationIcon from '@material-ui/icons/AddLocation'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import RedoIcon from '@material-ui/icons/Redo'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import manuscriptsImage from '../../img/manuscripts-214x124.jpg'
import worksImage from '../../img/works-214x124.jpg'
import eventsImage from '../../img/events-214x124.jpg'
import actorsImage from '../../img/actors-214x124.jpg'
import placesImage from '../../img/places-214x124.jpg'

export const perspectiveConfig = [
  {
    id: 'manuscripts',
    frontPageImage: manuscriptsImage,
    perspectiveDescHeight: 160,
    defaultActiveFacets: new Set(['prefLabel']),
    tabs: [
      {
        id: 'table',
        value: 0,
        icon: <CalendarViewDayIcon />
      },
      {
        id: 'production_places',
        value: 1,
        icon: <AddLocationIcon />
      },
      {
        id: 'last_known_locations',
        value: 2,
        icon: <LocationOnIcon />
      },
      {
        id: 'migrations',
        value: 3,
        icon: <RedoIcon />
      },
      {
        id: 'export',
        value: 4,
        icon: <CloudDownloadIcon />
      }
    ],
    instancePageTabs: [
      {
        id: 'table',
        value: 0,
        icon: <CalendarViewDayIcon />
      },

      {
        id: 'export',
        value: 1,
        icon: <CloudDownloadIcon />
      }
    ]
  },
  {
    id: 'works',
    frontPageImage: worksImage,
    perspectiveDescHeight: 160,
    defaultActiveFacets: new Set(['prefLabel']),
    tabs: [
      {
        id: 'table',
        value: 0,
        icon: <CalendarViewDayIcon />
      },
      {
        id: 'export',
        value: 1,
        icon: <CloudDownloadIcon />
      }
    ],
    instancePageTabs: [
      {
        id: 'table',
        value: 0,
        icon: <CalendarViewDayIcon />
      },
      {
        id: 'export',
        value: 1,
        icon: <CloudDownloadIcon />
      }
    ]
  },
  {
    id: 'events',
    frontPageImage: eventsImage,
    perspectiveDescHeight: 160,
    defaultActiveFacets: new Set(['type']),
    tabs: [
      {
        id: 'table',
        value: 0,
        icon: <CalendarViewDayIcon />
      },
      {
        id: 'map',
        value: 1,
        icon: <AddLocationIcon />
      },
      // {
      //   id: 'by-period',
      //   value: 2,
      //   icon: <AddLocationIcon />,
      // },
      {
        id: 'export',
        label: 'export',
        value: 3,
        icon: <CloudDownloadIcon />
      }
    ],
    instancePageTabs: [
      {
        id: 'table',
        value: 0,
        icon: <CalendarViewDayIcon />
      },
      {
        id: 'export',
        value: 1,
        icon: <CloudDownloadIcon />
      }
    ]
  },
  {
    id: 'actors',
    frontPageImage: actorsImage,
    perspectiveDescHeight: 160,
    defaultActiveFacets: new Set(['prefLabel']),
    tabs: [
      {
        id: 'table',
        value: 0,
        icon: <CalendarViewDayIcon />
      },
      {
        id: 'map',
        value: 1,
        icon: <AddLocationIcon />
      },
      {
        id: 'export',
        value: 2,
        icon: <CloudDownloadIcon />
      }
    ],
    instancePageTabs: [
      {
        id: 'table',
        value: 0,
        icon: <CalendarViewDayIcon />
      },
      {
        id: 'export',
        value: 1,
        icon: <CloudDownloadIcon />
      }
    ]
  },
  {
    id: 'places',
    frontPageImage: placesImage,
    perspectiveDescHeight: 160,
    defaultActiveFacets: new Set(['prefLabel']),
    tabs: [
      {
        id: 'table',
        value: 0,
        icon: <CalendarViewDayIcon />
      },
      {
        id: 'map',
        value: 1,
        icon: <AddLocationIcon />
      },
      {
        id: 'export',
        value: 2,
        icon: <CloudDownloadIcon />
      }
    ],
    instancePageTabs: [
      {
        id: 'table',
        value: 0,
        icon: <CalendarViewDayIcon />
      },
      {
        id: 'export',
        value: 1,
        icon: <CloudDownloadIcon />
      }
    ]
  }
]
