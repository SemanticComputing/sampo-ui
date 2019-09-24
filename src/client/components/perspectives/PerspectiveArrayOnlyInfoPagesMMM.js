import React from 'react';
import Typography from '@material-ui/core/Typography';

export const perspectiveArrOnlyInfoPages = [
  {
    id: 'collections',
    instancePageLabel: 'Collection',
    instancePageDesc:
      <React.Fragment>
        <Typography paragraph={true}>
          This landing page provides a human-readable summary of the data points
          that link to this Collection. The data included in this summary reflects
          only those data points used in the MMM interface. Click the Open in
          Linked Data Browser button to view the complete set of classes and
          properties linked to this record. To cite this record, use its url.
        </Typography>
      </React.Fragment>
    ,
    perspectiveDescHeight: 99,
    instancePageTabs: [
      {
        id: 'table',
        label: 'table',
        value: 0,
        icon: 'CalendarViewDay',
      }
    ]
  },
  {
    id: 'expressions',
    instancePageLabel: 'Expression',
    instancePageDesc:
      <React.Fragment>
        <Typography paragraph={true}>
          This landing page provides a human-readable summary of the data points
          that link to this Expression. The data included in this summary reflects
          only those data points used in the MMM interface. Click the Open in
          Linked Data Browser button to view the complete set of classes and
          properties linked to this record. To cite this record, use its url.
        </Typography>
        <Typography paragraph={true}>
          The MMM data model follows the FRBRoo definition of an Expression,
          which refers to “the intellectual or artistic realisations of works
           in the form of identifiable immaterial objects…” Expressions contain
           author, title, and language information, and represent the various
           versions of texts that appear in manuscripts.
        </Typography>
      </React.Fragment>
    ,
    perspectiveDescHeight: 99,
    instancePageTabs: [
      {
        id: 'table',
        label: 'table',
        value: 0,
        icon: 'CalendarViewDay',
      }
    ]
  },
];
