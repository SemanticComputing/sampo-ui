import React from 'react'
import CalendarViewDayIcon from '@material-ui/icons/CalendarViewDay'
import TripOriginIcon from '@material-ui/icons/TripOrigin'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import AddLocationIcon from '@material-ui/icons/AddLocation'
import SettingsBrightnessIcon from '@material-ui/icons/SettingsBrightness'
import RedoIcon from '@material-ui/icons/Redo'
import PieChartIcon from '@material-ui/icons/PieChart'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import manuscriptsImage from '../../img/main_page/manuscripts-452x262.jpg'
import worksImage from '../../img/main_page/works-452x262.jpg'
import eventsImage from '../../img/main_page/events-452x262.jpg'
import placesImage from '../../img/main_page/places-452x262.jpg'

export const perspectiveConfig = [
  {
    id: 'perspective1',
    frontPageImage: manuscriptsImage,
    perspectiveDescHeight: 160,
    defaultActiveFacets: new Set(['prefLabel', 'productionPlace']),
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
        id: 'export',
        value: 5,
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
  },
  {
    id: 'clientFSPlaces',
    frontPageImage: placesImage,
    defaultActiveFacets: new Set(['datasetSelector', 'prefLabel']),
    tabs: [
      {
        id: 'table',
        value: 0,
        icon: <CalendarViewDayIcon />
      },
      {
        id: 'map_clusters',
        value: 1,
        icon: <TripOriginIcon />
      },
      {
        id: 'map_markers',
        value: 2,
        icon: <LocationOnIcon />
      },
      {
        id: 'heatmap',
        value: 3,
        icon: <SettingsBrightnessIcon />
      },
      {
        id: 'statistics',
        value: 4,
        icon: <PieChartIcon />
      },
      {
        id: 'download',
        value: 5,
        icon: <CloudDownloadIcon />
      }
    ]
  }
]
