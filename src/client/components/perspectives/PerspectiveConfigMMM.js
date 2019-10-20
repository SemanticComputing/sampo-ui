import React from 'react';
import Typography from '@material-ui/core/Typography';
import CalendarViewDayIcon from '@material-ui/icons/CalendarViewDay';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import RedoIcon from '@material-ui/icons/Redo';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

export const perspectiveConfig = [
  {
    id: 'manuscripts',
    perspectiveDescHeight: 99,
    defaultActiveFacets: new Set(['prefLabel']),
    tabs: [
      {
        id: 'table',
        value: 0,
        icon: <CalendarViewDayIcon />,
      },
      {
        id: 'production_places',
        value: 1,
        icon: <AddLocationIcon />,
      },
      {
        id: 'migrations',
        value: 2,
        icon: <RedoIcon />,
      },
      {
        id: 'export',
        value: 3,
        icon: <CloudDownloadIcon />,
      }
    ],
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
    id: 'works',
    perspectiveDescHeight: 99,
    defaultActiveFacets: new Set(['prefLabel']),
    tabs: [
      {
        id: 'table',
        value: 0,
        icon: <CalendarViewDayIcon />,
      },
      {
        id: 'export',
        value: 1,
        icon: <CloudDownloadIcon />,
      }
    ],
    instancePageTabs: [
      {
        id: 'table',
        value: 0,
        icon: <CalendarViewDayIcon />,
      },
      {
        id: 'export',
        value: 1,
        icon: <CloudDownloadIcon />,
      },
    ]
  },
  {
    id: 'events',
    perspectiveDescHeight: 99,
    defaultActiveFacets: new Set(['type']),
    tabs: [
      {
        id: 'table',
        value: 0,
        icon: <CalendarViewDayIcon />,
      },
      {
        id: 'map',
        value: 1,
        icon: <AddLocationIcon />,
      },
      {
        id: 'export',
        label: 'export',
        value: 2,
        icon: <CloudDownloadIcon />,
      }
    ],
    instancePageTabs: [
      {
        id: 'table',
        value: 0,
        icon: <CalendarViewDayIcon />,
      },
      {
        id: 'export',
        value: 1,
        icon: <CloudDownloadIcon />,
      },
    ]
  },
  {
    id: 'actors',
    perspectiveDescHeight: 99,
    defaultActiveFacets: new Set(['prefLabel']),
    tabs: [
      {
        id: 'table',
        value: 0,
        icon: <CalendarViewDayIcon />,
      },
      {
        id: 'map',
        value: 1,
        icon: <AddLocationIcon />,
      },
      {
        id: 'export',
        value: 2,
        icon: <CloudDownloadIcon />,
      }
    ],
    instancePageTabs: [
      {
        id: 'table',
        value: 0,
        icon: <CalendarViewDayIcon />,
      },
      {
        id: 'export',
        value: 1,
        icon: <CloudDownloadIcon />,
      },
    ]
  },
  {
    id: 'places',
    perspectiveDescHeight: 99,
    defaultActiveFacets: new Set(['prefLabel']),
    tabs: [
      {
        id: 'table',
        value: 0,
        icon: <CalendarViewDayIcon />,
      },
      {
        id: 'map',
        value: 1,
        icon: <AddLocationIcon />,
      },
      {
        id: 'export',
        value: 2,
        icon: <CloudDownloadIcon />,
      }
    ],
    instancePageTabs: [
      {
        id: 'table',
        value: 0,
        icon: <CalendarViewDayIcon />,
      },
      {
        id: 'export',
        value: 1,
        icon: <CloudDownloadIcon />,
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
    </Typography>
    <ul>
      <Typography>
        <li><a href="https://sdbm.library.upenn.edu/" target='_blank' rel='noopener noreferrer'>
          Schoenberg Database of Manuscripts
        </a></li>
        <li><a href="http://bibale.irht.cnrs.fr/" target='_blank' rel='noopener noreferrer'>
          Bibale
        </a></li>
        <li><a href="https://medieval.bodleian.ox.ac.uk/" target='_blank' rel='noopener noreferrer'>
          Medieval Manuscripts in Oxford Libraries
        </a></li>
      </Typography>
    </ul>
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
