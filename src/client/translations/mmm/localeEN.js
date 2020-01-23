export default {
  languageLabel: 'English',
  appTitle: {
    short: 'sampo',
    long: 'Sampo Semantic Portal',
    subheading: `
      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
      doloremque laudantium unde
    `
  },
  appDescription: `
    Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, 
    nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea 
    voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo 
    voluptas nulla pariatur.
  `,
  selectPerspective: 'Select a perspective to search and browse the data:',
  mainPageImageLicence: 'Image licene text',
  topBar: {
    feedback: 'feedback',
    info: {
      info: 'Info',
      blog: 'Project blog',
      blogUrl: 'https://seco.cs.aalto.fi',
      aboutThePortal: 'About the Portal'
    },
    searchBarPlaceHolder: 'Search all content',
    searchBarPlaceHolderShort: 'Search',
    instructions: 'instructions'
  },
  facetBar: {
    results: 'Results',
    narrowDownBy: 'Narrow down by'
  },
  tabs: {
    table: 'table',
    map: 'map',
    production_places: 'production places',
    last_known_locations: 'last known locations',
    migrations: 'migrations',
    network: 'network',
    export: 'export',
    'by-period': 'by period'
  },
  table: {
    rowsPerPage: 'Rows per page',
    of: 'of'
  },
  instancePageGeneral: {
    introduction: `
      <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
        This landing page provides a human-readable summary of the data points that link
        to this {entity}. The data included in this summary reflect only those data points
        used in the MMM Portal. Click the Open in Linked Data Browser on button on the
        Export tab to view the complete set of classes and properties linked to this record.
      </p>
      <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
        To cite this record, use its url. You can use also use the url to return directly
        to the record at any time.
      </p>
    `,
    repetition: `
      <h6 class="MuiTypography-root MuiTypography-h6">
        Repetition of data
      </h6>
      <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
        The same or similar data may appear within a single data field multiple times.
        This repetition occurs due to the merging of multiple records from different datasets
        to create the MMM record.
      </p>
    `
  },
  perspectives: {
    perspective1: {
      label: 'Perspective 1',
      facetResultsType: 'manuscripts',
      shortDescription: 'Short description',
      longDescription: `
        <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
          At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium 
          voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati 
          cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id 
          est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam 
          libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod 
          maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
        </p>
      `,
      instancePage: {
        label: 'Manuscript',
        description: `
          <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium 
            voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati 
            cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id 
            est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam 
            libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod 
            maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
        </p
        `
      },
      properties: {
        uri: {
          label: 'URI',
          description: 'Uniform Resource Identifier'
        },
        prefLabel: {
          label: 'Label',
          description: 'A short label describing the manuscript.'
        }
      }
    },
    perspective2: {
      label: 'Perspective 2',
      facetResultsType: 'manuscripts',
      shortDescription: 'Short description',
      longDescription: `
          <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium 
            voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati 
            cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id 
            est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam 
            libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod 
            maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
          </p>
        `,
      instancePage: {
        label: 'Manuscript',
        description: `
            <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
              At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium 
              voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati 
              cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id 
              est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam 
              libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod 
              maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
          </p
          `
      },
      properties: {
        uri: {
          label: 'URI',
          description: 'Uniform Resource Identifier'
        },
        prefLabel: {
          label: 'Label',
          description: 'A short label describing the manuscript.'
        }
      }
    },
    perspective3: {
      label: 'Perspective 3',
      facetResultsType: 'manuscripts',
      shortDescription: 'Short description',
      longDescription: `
          <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium 
            voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati 
            cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id 
            est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam 
            libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod 
            maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
          </p>
        `,
      instancePage: {
        label: 'Manuscript',
        description: `
            <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
              At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium 
              voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati 
              cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id 
              est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam 
              libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod 
              maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
          </p
          `
      },
      properties: {
        uri: {
          label: 'URI',
          description: 'Uniform Resource Identifier'
        },
        prefLabel: {
          label: 'Label',
          description: 'A short label describing the manuscript.'
        }
      }
    }
  },
  aboutThePortal: `
    <h1 class="MuiTypography-root MuiTypography-h2 MuiTypography-gutterBottom">
      About the Portal
    </h1>
    <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
      Mapping Manuscript Migrations (MMM) Portal has been developed with funding from the Trans-Atlantic
      Platform under its Digging into Data Challenge (2017-2019). The partners in this project are
      the University of Oxford, the University of Pennsylvania, Aalto University,
      and the Institut de recherche et d’histoire des textes.
      Funding has been provided by the UK Economic and Social Research Council,
      the Institute of Museum and Library Services, the Academy of Finland, and the
      Agence nationale de la recherche.
    </p>
    <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
      MMM Portal is intended to enable large-scale exploration of data relating to the history and provenance
      of (primarily) Western European medieval and early modern manuscripts.
    </p>
    <h2 class="MuiTypography-root MuiTypography-h4 MuiTypography-gutterBottom">
      Data
    </h2>
    <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
      MMM Portal combines data from three specialist databases:
    </p>
    <ul class="MuiTypography-root MuiTypography-body1 MuiTypography-gutterBottom">
      <li>
        <a href="https://sdbm.library.upenn.edu/"
          target='_blank' rel='noopener noreferrer'
        >
          Schoenberg Database of Manuscripts
        </a>
      </li>
      <li>
        <a href="http://bibale.irht.cnrs.fr/"
          target='_blank' rel='noopener noreferrer'
        >
          Bibale
        </a>
      </li>
      <li>
        <a href="https://medieval.bodleian.ox.ac.uk/"
          target='_blank' rel='noopener noreferrer'
        >
          Medieval Manuscripts in Oxford Libraries
        </a>
      </li>
    </ul>
    <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
      The data have been combined using a unified Data Model based on the CIDOC-CRM
      and FRBRoo ontologies. A diagram of the Data Model can be seen
      <a href="https://drive.google.com/open?id=1uyTA8Prwtts5g13eor48tKHk_g63NaaG" target='_blank' rel='noopener noreferrer'>
      here</a>. The data have not been corrected or amended in any way. If you notice an error in the data,
      please report it to the custodians of the original database.
    </p>
    <h2 class="MuiTypography-root MuiTypography-h4 MuiTypography-gutterBottom">
      Features
    </h2>
    <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
      The MMM Portal enables you to browse and search through most of the data assembled by the MMM project
      from the three source databases. If you want to inspect the full raw data for any individual
      manuscript or other entity, please click on the “Open in Linked Data browser” button on
      the “Export” tab of the landing-page for that entity.
    </p>
    <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
      The MMM Portal also provides map-based visualizations for a selection of the data relating to
      Manuscripts, Actors, and Places. The data resulting from a search or a filtered browse can be
      exported in the form of a CSV file. Click on the “Export” tab and then on the button
      “Open SPARQL query in yasgui.org”.
    </p>
    <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
      If you want to search all the underlying data using the SPARQL query language, the endpoint is
      available here: <a href="http://ldf.fi/mmm-cidoc/sparql" target='_blank' rel='noopener noreferrer'>
      http://ldf.fi/mmm-cidoc/sparql</a>.
    </p>
    <h2 class="MuiTypography-root MuiTypography-h4 MuiTypography-gutterBottom">
      Data Reuse
    </h2>
    <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
      The MMM data are made available for reuse under a
      <a href="https://creativecommons.org/licenses/by-nc/4.0/" target='_blank' rel='noopener noreferrer'>CC-BY-NC 4.0 licence</a>.
    </p>
    <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
      You must give appropriate credit, provide a link to the license, and indicate if changes
      were made. You may do so in any reasonable manner, but not in any way that suggests the
      MMM project or its partner institutions endorses you or your use.
    </p>
    <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
      You may not use the data for commercial purposes.
    </p>
    <h2 class="MuiTypography-root MuiTypography-h4 MuiTypography-gutterBottom">
      More Information
    </h2>
    <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
      The MMM project has its own
      <a href="https://github.com/mapping-manuscript-migrations" target='_blank' rel='noopener noreferrer'>GitHub site</a>.
    </p>
    <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
      Here you will find documentation, scripts and programs, and samples of the raw data.
    </p>
  `,
  instructions: `
    <h1 class="MuiTypography-root MuiTypography-h2 MuiTypography-gutterBottom">
      Instructions
    </h1>
    <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
      The search functionality of the MMM portal is based on the
      <a href="https://doi.org/10.2200/S00190ED1V01Y200904ICR005" target='_blank' rel='noopener noreferrer'>
      faceted search</a> paradigm. By default each perspective displays
      all results from the corresponding class (Manuscripts, Works, Events, Actors, or Places).
      This default result set can be narrowed down by using the filters on the left.
    </p>

    <h2 class="MuiTypography-root MuiTypography-h4 MuiTypography-gutterBottom">
      Using a single filter
    </h2>

    <h3 class="MuiTypography-root MuiTypography-h6 MuiTypography-gutterBottom">
      Selecting values within a filter
    </h3>
    <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
      All possible values for a filter are displayed either as a list or as a hierarchical
      tree structure (if available). The number of results is shown in brackets for each value.
      Once a value is selected, the results are automatically updated. To prevent further
      selections that do not return any results, also the possible values for all
      other filters are updated at the same time.
    </p>
    <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
      Multiple values can be selected within a single filter. Selecting multiple values
      generates results that contain any of the selected values. For example, selecting
      both <i>Saint Augustine</i> and <i>Saint Jerome</i> as an Author returns results that
      include either <i>Saint Augustine</i> <strong>OR</strong> <i>Saint Jerome</i> as an Author.
    </p>
    <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
      Selected values of a filter appear in the Active filters section at the top of the list
      of filters. To deselect a filter, click the X mark next to it within the Active filters
      section. You can also deselect a filter value by unchecking the checkmark in the
      filter’s value list. The Active filters section only appears if there are filter
      values currently selected.
    </p>

    <h3 class="MuiTypography-root MuiTypography-h6 MuiTypography-gutterBottom">
      Searching within a filter
    </h3>
    <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
      Search within a filter by using the search field at the top of each filter.
      All possible values of a filter remain visible at all times. The values of
      the filter that match the search term are indicated by a purple underline.
    </p>
    <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
      Steps for searching within filters:
    </p>
    <ol class="MuiTypography-root MuiTypography-body1 MuiTypography-gutterBottom">
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
    </ol>

    <h2 class="MuiTypography-root MuiTypography-h4 MuiTypography-gutterBottom">
      Using multiple filters simultaneously
    </h2>
    <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
      The effectiveness of faceted search is realized when multiple filters are
      applied at the same time. As in many e-commerce sites, a logical AND is
      always used between the filters. For example selecting <i>Saint Augustine </i>
      and <i>Saint Jerome</i> as an Author and <i>Sir Thomas Phillipps</i> and
      <i> Thomas Thorpe</i> as an Owner, the results are narrowed down as follows:
    </p>
    <p class="MuiTypography-root MuiTypography-body1">
      (Author: <i>Saint Augustine</i> <strong>OR</strong> Author: <i>Saint Jerome</i>)
    </p>
    <p class="MuiTypography-root MuiTypography-body1">
        <strong>AND</strong>
    </p>
    <p class="MuiTypography-root MuiTypography-body1">
      (Owner: <i>Sir Thomas Phillipps</i> <strong>OR</strong> Owner: <i>Thomas Thorpe</i>)
    </p>
  `,
  feedback: `
    <h1 class="MuiTypography-root MuiTypography-h2 MuiTypography-gutterBottom">
      Feedback
    </h1>
    <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
      This semantic portal has been developed by the research project “Mapping Manuscript Migrations”.
    </p>
    <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
      We are interested in your feedback on the functionality, coverage, and usefulness of the portal and its data.
    </p>
    <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
      Please complete our
      <a href="https://tinyurl.com/uph7xkj" target='_blank' rel='noopener noreferrer'>Feedback Survey Form.</a>
    </p>
    <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
    You can also contact us via email:
    <a href="mailto:mappingmanuscriptmigrations@gmail.com">mappingmanuscriptmigrations@gmail.com</a>
    or DM us on Twitter: @MSMigrations
    </p>
    <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
      Please be aware that this portal’s response times may be affected by the size and complexity
      of the dataset, especially in areas like the map visualizations, the date filters, and the Events perspective.
    </p>
    `
}
