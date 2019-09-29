import React from 'react';
import Typography from '@material-ui/core/Typography';

export const perspectiveArr = [
  {
    id: 'manuscripts',
    label: 'Manuscripts',
    instancePageLabel: 'Manuscript',
    mainPageDesc: 'Physical manuscript objects',
    perspectiveDesc:
      <React.Fragment>
        <Typography paragraph={true}>
          Use this perspective to access data related to physical manuscript objects.
          The paginated tabular result view is default, including all manuscripts in
          the MMM data. One table row is equivalent to one manuscript. If two or more
          source datasets include the same manuscript and this has been
          manually verified, the information from the source datasets has been merged
          into one table row.
        </Typography>
        <Typography paragraph={true}>
          To view the production places of manuscripts on a map, choose the “Production
          Place” tab.
        </Typography>
      </React.Fragment>
    ,
    instancePageDesc:
      <React.Fragment>
        <Typography paragraph={true}>
          This landing page provides a human-readable summary of the data points that link
          to this Manuscript. The data included in this summary reflects only those data
          points used in the MMM interface. Click the Open in Linked Data Browser button to
          view the complete set of classes and properties linked to this record. To cite this
          record, use its url.
        </Typography>
        <Typography paragraph={true}>
          MMM’s Manuscript entity corresponds to FRBRoo’s Manifestation Singleton, defined as
          “physical objects that each carry an instance of [an Expression], and that were
          produced as unique objects…” The various types of records that describe manuscripts
          in each of the three contributing MMM datasets have been mapped to this entity.
        </Typography>
        <Typography variant='h6'>Manuscript labels</Typography>
        <Typography paragraph={true}>
          If the Bibale or Oxford databases reference a shelf mark for the manuscript,
          that information will appear as its label. Otherwise, an SDBM ID number will serve
          as its label. SDBM ID numbers contain prefixes that indicate different things about
          the type of record they contain:
        </Typography>
        <ul>
          <li><Typography>
            SDBM_MS: SDBM Manuscript Record, which aggregates the data of two or more SDBM
            Entries. Each Entry represents a different observation of a manuscript at a different
            point in time, derived from various sources.
          </Typography></li>
          <li><Typography>
            SDBM_MS_orphan: a single Entry in the SDBM, meaning it has not been linked to any
            other Entries and therefore has no SDBM Manuscript Record.
          </Typography></li>
          <li><Typography>
            SDBM_MS_part: a record identified as a fragment of a larger manuscript.
          </Typography></li>
        </ul>
      </React.Fragment>
    ,
    perspectiveDescHeight: 99,
    defaultActiveFacets: new Set(['prefLabel', 'height']),
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
    ],
    instancePageTabs: [
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
      {
        id: 'export',
        label: 'export',
        value: 2,
        icon: 'Download',
      },
    ]
  },
  {
    id: 'works',
    label: 'Works',
    instancePageLabel: 'Work',
    mainPageDesc: 'Intellectual content carried out by manuscripts.',
    perspectiveDesc:
      <React.Fragment>
        <Typography paragraph={true}>
        Use this perspective to access data related to Works. The table view gives
        you a list of specific works, and the manuscripts and manuscript
        collections in which they can be found.
        </Typography>
      </React.Fragment>
    ,
    instancePageDesc:
      <React.Fragment>
        <Typography paragraph={true}>
          This landing page provides a human-readable summary of the data points that
          link to this Work. The data included in this summary reflects only those data
          points used in the MMM interface. Click the Open in Linked Data Browser button
          to view the complete set of classes and properties linked to this record.
          To cite this record, use its url.
        </Typography>
        <Typography paragraph={true}>
          The MMM data model follows the &nbsp;
          <a href='https://www.ifla.org/publications/node/11240' target='_blank' rel='noopener noreferrer'>FRBRoo</a>
          &nbsp; definition of a work, which refers to
          “distinct concepts or combinations of concepts identified in artistic and
          intellectual expressions.” Works contain title and author information.
          This definition is not shared by the Bibale or Oxford Libraries’ conception
          of the term, which both define their internal “work” concept more closely to
          the FRBRoo conception of an Expression. The SDBM does not have a work concept
          at all, recording only the titles of the texts as given in its various sources,
          without normalizing that data or linking it directly to author information.
          Works were generated within the MMM dataset by manually creating links across
          the three datasets’ various conceptions of the relationship between authors
          and their creations. This process was not able to reconcile every work
          contained within the combined dataset.
        </Typography>
      </React.Fragment>
    ,
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
        id: 'export',
        label: 'export',
        value: 1,
        icon: 'Download',
      }
    ],
    instancePageTabs: [
      {
        id: 'table',
        label: 'table',
        value: 0,
        icon: 'CalendarViewDay',
      },
      {
        id: 'export',
        label: 'export',
        value: 1,
        icon: 'Download',
      },
    ]
  },
  {
    id: 'events',
    label: 'Events',
    instancePageLabel: 'Event',
    mainPageDesc: 'Events related to manuscripts.',
    perspectiveDesc:
      <React.Fragment>
        <Typography paragraph={true}>
        Use this perspective to access data related to events. The table view gives you a
        list of specific events associated with the histories of manuscripts and manuscript
        collections over the centuries.
        </Typography>
      </React.Fragment>
    ,
    instancePageDesc:
      <React.Fragment>
        <Typography paragraph={true}>
          This landing page provides a human-readable summary of the data points that link
          to this Event. The data included in this summary reflects only those data points
          used in the MMM interface. Click the Open in Linked Data Browser button to
          view the complete set of classes and properties linked to this record.
          To cite this record, use its url.
        </Typography>
      </React.Fragment>
    ,
    perspectiveDescHeight: 99,
    defaultActiveFacets: new Set(['type']),
    tabs: [
      {
        id: 'table',
        label: 'table',
        value: 0,
        icon: 'CalendarViewDay',
      },
      {
        id: 'export',
        label: 'export',
        value: 1,
        icon: 'Download',
      }
    ],
    instancePageTabs: [
      {
        id: 'table',
        label: 'table',
        value: 0,
        icon: 'CalendarViewDay',
      },
      {
        id: 'export',
        label: 'export',
        value: 1,
        icon: 'Download',
      },
    ]
  },
  {
    id: 'actors',
    label: 'Actors',
    instancePageLabel: 'Actor',
    mainPageDesc: 'People and institutions related to manuscripts and works.',
    perspectiveDesc:
      <React.Fragment>
        <Typography paragraph={true}>
          This perspective provides access to data related to the persons and institutions who
          impacted the production or dissemination of manuscripts and works. Actors include authors
          of works, artists and scribes who produced manuscripts, and the individual owners and
          institutions who bought or sold manuscripts.
        </Typography>
        <Typography paragraph={true}>
          The paginated tabular result view is default, including all actors in the MMM data. One
          table row is equivalent to one actor. Use the map view to visualize the connection
          between Actors and the places where they lived or were located. These links are
          indicated by the markers on the map. The markers cluster by region or nation,
          and resolve themselves into more specific locations as you zoom in on the map. Blue
          markers cannot be resolved any further: click on them to reveal links to the Actor
          records associated with that location.
        </Typography>
      </React.Fragment>
    ,
    instancePageDesc:
      <React.Fragment>
        <Typography paragraph={true}>
          This landing page provides a human-readable summary of the data points that link to this Actor.
          The data included in this summary reflects only those data points used in the MMM interface.
          Click the Open in Linked Data Browser button to view the complete set of classes and
          properties linked to this record. To cite this record, use its url.
        </Typography>
      </React.Fragment>
    ,
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
      {
        id: 'export',
        label: 'export',
        value: 2,
        icon: 'Download',
      }
    ],
    instancePageTabs: [
      {
        id: 'table',
        label: 'table',
        value: 0,
        icon: 'CalendarViewDay',
      },
      {
        id: 'export',
        label: 'export',
        value: 1,
        icon: 'Download',
      },
    ]
  },
  {
    id: 'places',
    label: 'Places',
    instancePageLabel: 'Place',
    mainPageDesc: 'Places related to manuscripts and works.',
    perspectiveDesc:
      <React.Fragment>
        <Typography paragraph={true}>
          Use this perspective to access data related to places named in the source datasets
          (Schoenberg, Bibale, and Bodleian). The places have been linked to Getty Thesaurus
          of Geographic Names when possible. Place types include everything from continents
          (North America) to countries (Canada) to regions/provinces (British Columbia)
          to cities (Vancouver). The map result view is default, showing all the places that
          have coordinates. The table result view includes all places in MMM data.
        </Typography>
      </React.Fragment>
    ,
    instancePageDesc:
      <React.Fragment>
        <Typography paragraph={true}>
          This landing page provides a human-readable summary of the data points that link
          to this Place. The data included in this summary reflects only those data points
          used in the MMM interface. Click the Open in Linked Data Browser button to
          view the complete set of classes and properties linked to this record. To cite this record, use its url.
        </Typography>
        <Typography paragraph={true}>
          MMM utilizes the Getty Thesaurus of Geographic Names as its hierarchy for geographic data.
          Coordinate data is approximate for locations such as counties, regions, and nations.
        </Typography>
      </React.Fragment>
    ,
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
      {
        id: 'export',
        label: 'export',
        value: 2,
        icon: 'Download',
      }
    ],
    instancePageTabs: [
      {
        id: 'table',
        label: 'table',
        value: 0,
        icon: 'CalendarViewDay',
      },
      {
        id: 'export',
        label: 'export',
        value: 1,
        icon: 'Download',
      },
    ]
  },
];
