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
    ],
    instancePageTabs: [
      {
        id: 'table',
        label: 'table',
        value: 0,
        icon: 'CalendarViewDay',
      },
      // {
      //   id: 'map',
      //   label: 'map',
      //   value: 1,
      //   icon: 'AddLocation',
      // },
      {
        id: 'export',
        label: 'export',
        value: 1,
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

export const aboutTheProject =
  <React.Fragment>
    <Typography component="h1" variant="h2" gutterBottom>
        About the project
    </Typography>
    <Typography paragraph={true}>
      Mapping Manuscript Migrations (MMM) has been developed with funding from the Trans-Atlantic
      Platform under its Digging into Data Challenge (2017-2019). The partners in this project are
      the University of Oxford, the University of Pennsylvania, Aalto University,
      and the Institut de recherche et d’histoire des textes.
      Funding has been provided by the UK Economic and Social Research Council,
      the Institute of Museum and Library Services, the Academy of Finland, and the
      Agence nationale de la recherche.
    </Typography>
    <Typography paragraph={true}>
      MMM is intended to enable large-scale exploration of data relating to the history and provenance
      of (primarily) Western European medieval and early modern manuscripts.
    </Typography>
    <Typography component="h2" variant="h4" gutterBottom>
        Data
    </Typography>
    <Typography paragraph={true}>
      MMM combines data from three specialist databases:
      <ul>
        <li><a href="https://sdbm.library.upenn.edu/" target='_blank' rel='noopener noreferrer'>
          Schoenberg Database of Manuscripts
        </a></li>
        <li><a href="http://bibale.irht.cnrs.fr/" target='_blank' rel='noopener noreferrer'>
          Bibale
        </a></li>
        <li><a href="https://medieval.bodleian.ox.ac.uk/" target='_blank' rel='noopener noreferrer'>
          Medieval Manuscripts in Oxford Libraries
        </a></li>
      </ul>
    </Typography>
    <Typography paragraph={true}>
      The data have been combined using a unified Data Model based on the CIDOC-CRM and FRBRoo
      ontologies. A diagram of the Data Model can be seen <a href="https://drive.google.com/open?id=1uyTA8Prwtts5g13eor48tKHk_g63NaaG" target='_blank' rel='noopener noreferrer'>
      here</a>. The data have not been corrected or amended in any way. If you notice an error in the data,
      please report it to the custodians of the original database.
    </Typography>
    <Typography component="h2" variant="h4" gutterBottom>
        Features
    </Typography>
    <Typography paragraph={true}>
      The MMM interface enables you to browse and search through most of the data assembled by the project
      from the three source databases. If you want to inspect the full raw data for any individual
      manuscript or other entity, please click on the “Open in Linked Data browser” button on
      the “Export” tab of the landing-page for that entity.
    </Typography>
    <Typography paragraph={true}>
      The MMM interface also provides map-based visualizations for a selection of the data relating to
      Manuscripts, Actors, and Places. The data resulting from a search or a filtered browse can be
      exported in the form of a CSV file. Click on the “Export” option and then on the button
      “Open result table SPARQL query in yasgui.org”.
    </Typography>
    <Typography paragraph={true}>
      If you want to search all the underlying data using the SPARQL query language, the endpoint is
      available here: <a href="http://ldf.fi/mmm-cidoc/sparql" target='_blank' rel='noopener noreferrer'>
      http://ldf.fi/mmm-cidoc/sparql</a>.
    </Typography>
    <Typography component="h2" variant="h4" gutterBottom>
        Data Reuse
    </Typography>
    <Typography paragraph={true}>
      The MMM data are made available for reuse under a <a href="https://creativecommons.org/licenses/by-nc/4.0/"
        target='_blank' rel='noopener noreferrer'>
      CC-BY-NC 4.0 licence</a>.
    </Typography>
    <Typography paragraph={true}>
      You must give appropriate credit, provide a link to the license, and indicate if changes
      were made. You may do so in any reasonable manner, but not in any way that suggests the
      MMM project or its partner institutions endorses you or your use.
    </Typography>
    <Typography paragraph={true}>
      You may not use the data for commercial purposes.
    </Typography>
    <Typography component="h2" variant="h4" gutterBottom>
        More Information
    </Typography>
    <Typography paragraph={true}>
      The MMM project has its own  <a href="https://github.com/mapping-manuscript-migrations"
        target='_blank' rel='noopener noreferrer'>
      GitHub site</a>.
    </Typography>
    <Typography paragraph={true}>
      Here you will find documentation, scripts and programs, and samples of the raw data.
    </Typography>
  </React.Fragment>;

export const instructions =
  <React.Fragment>
    <Typography component="h1" variant="h2" gutterBottom>
        Instructions
    </Typography>
    <Typography paragraph={true}>
      The search functionality of the MMM portal is based on the <a href="https://doi.org/10.2200/S00190ED1V01Y200904ICR005" target='_blank' rel='noopener noreferrer'>
      faceted search</a> paradigm. By default each perspective displays
      all results from the corresponding class (Manuscripts, Works, Events, Actors, or Places).
      This default result set can be narrowed down by using the filters on the left.
    </Typography>
    <Typography component="h2" variant="h4" gutterBottom>
        Using a single filter
    </Typography>
    <Typography component="h3" variant="h6"gutterBottom>
        Selecting values within a filter
    </Typography>
    <Typography paragraph={true}>
      All possible values for a filter are displayed either as a list or as a hierarchical
      tree structure (if available). The number of results is shown in brackets for each value.
      Once a value is selected, the results are automatically updated. To prevent further
      selections that do not return any results, also the possible values for all
      other filters are updated at the same time.
    </Typography>
    <Typography paragraph={true}>
      Multiple values can be selected within a single filter. Selecting multiple values
      generates results that contain any of the selected values. For example, selecting
      both <i>Saint Augustine</i> and <i>Saint Jerome</i> as an Author returns results that
      include either <i>Saint Augustine</i> <strong>OR</strong> <i>Saint Jerome</i> as an Author.
    </Typography>
    <Typography paragraph={true}>
      Selected values of a filter appear in the Active filters section at the top of the list
      of filters. To deselect a filter, click the X mark next to it within the Active filters
      section. You can also deselect a filter value by unchecking the checkmark in the
      filter’s value list. The Active filters section only appears if there are filter
      values currently selected.
    </Typography>
    <Typography component="h3" variant="h6"gutterBottom>
      Searching within a filter
    </Typography>
    <Typography paragraph={true}>
      Search within a filter by using the search field at the top of each filter.
      All possible values of a filter remain visible at all times. The values of
      the filter that match the search term are indicated by a purple underline.
    </Typography>
    <Typography paragraph={true}>
      Steps for searching within filters:
    </Typography>
    <ol>
      <Typography>
        <li>
          Type search term into search field. If there are matches, a number
          will appear to the right of the search field, indicating the number
          of filter values that match the search term.
        </li>
        <li>
          Click the arrows to the right of the search field to cycle
          through the results. As you click the arrow, a different filter value
          will appear at the top of the list. Matched filters are underlined in
          purple.
        </li>
        <li>
          Click the checkmark next to a filter value to activate it. The results
          (and also other filters) are automatically updated.
        </li>
      </Typography>
    </ol>
    <Typography component="h2" variant="h4" gutterBottom>
      Using multiple filters simultaneously
    </Typography>
    <Typography paragraph={true}>
      The effectiveness of faceted search is realized when multiple filters are
      applied at the same time. As in many e-commerce sites, a logical AND is
      always used between the filters. For example selecting <i>Saint Augustine </i>
      and <i>Saint Jerome</i> as an Author and <i>Sir Thomas Phillipps</i> and
      <i> Thomas Thorpe</i> as an Owner, the results are narrowed down as follows:
    </Typography>
    <Typography>
      (Author: <i>Saint Augustine</i> <strong>OR</strong> Author: <i>Saint Jerome</i>)
    </Typography>
    <Typography>
      <strong>AND</strong>
    </Typography>
    <Typography>
      (Owner: <i>Sir Thomas Phillipps</i> <strong>OR</strong> Owner: <i>Thomas Thorpe</i>)
    </Typography>
  </React.Fragment>;
