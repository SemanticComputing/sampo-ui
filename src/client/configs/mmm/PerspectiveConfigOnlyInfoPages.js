import React from 'react';
import CalendarViewDayIcon from '@material-ui/icons/CalendarViewDay';
//import AddLocationIcon from '@material-ui/icons/AddLocation';
// import RedoIcon from '@material-ui/icons/Redo';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

export const perspectiveConfigOnlyInfoPages = [
  {
    id: 'collections',
    perspectiveDescHeight: 160,
    instancePageTabs: [
      {
        id: 'table',
        value: 0,
        icon:  <CalendarViewDayIcon />,
      },

      {
        id: 'export',
        value: 1,
        icon: <CloudDownloadIcon />,
      },
    ]
  },
  {
    id: 'expressions',
    perspectiveDescHeight: 160,
    instancePageTabs: [
      {
        id: 'table',
        value: 0,
        icon:  <CalendarViewDayIcon />,
      },

      {
        id: 'export',
        value: 1,
        icon: <CloudDownloadIcon />,
      },
    ]
  }
];
