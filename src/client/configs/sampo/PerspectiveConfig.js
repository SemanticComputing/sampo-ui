import React from 'react'
import CalendarViewDayIcon from '@material-ui/icons/CalendarViewDay'
import AddLocationIcon from '@material-ui/icons/AddLocation'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import RedoIcon from '@material-ui/icons/Redo'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import manuscriptsImage from '../../img/main_page/manuscripts-452x262.jpg'
import worksImage from '../../img/main_page/works-452x262_2.jpg'
import eventsImage from '../../img/main_page/events-452x262.jpg'

export const perspectiveConfig = [
  {
    id: 'perspective1',
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
        id: 'production_places_heatmap',
        value: 2,
        icon: <AddLocationIcon />
      },
      {
        id: 'last_known_locations',
        value: 3,
        icon: <LocationOnIcon />
      },
      {
        id: 'migrations',
        value: 4,
        icon: <RedoIcon />
      },
      {
        id: 'network',
        value: 5,
        icon: <RedoIcon />
      },
      {
        id: 'export',
        value: 6,
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
    id: 'perspective2',
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
    id: 'perspective3',
    frontPageImage: eventsImage,
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
