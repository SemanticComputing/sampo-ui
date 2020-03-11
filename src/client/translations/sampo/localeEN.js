export default {
  languageLabel: 'English',
  appTitle: {
    short: 'sampo-ui',
    long: ' &nbsp; &nbsp; Sampo-UI  &nbsp;  &nbsp;',
    subheading: `
      "Here to forge for us the Sampo, Hammer us the lid in colors"
    `
  },
  appDescription: `
    
  `,
  selectPerspective: 'Select a perspective to search and browse the data:',
  mainPageImageLicence: 'Images used under license from Shutterstock.com',
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
  exportToYasgui: 'open the result table query in yasgui sparql editor',
  openInLinkedDataBrowser: 'open in linked data browser',
  leafletMap: {
    externalLayers: {
      arkeologiset_kohteet_alue: 'Register of Archaeological Sites, areas',
      arkeologiset_kohteet_piste: 'Register of Archaeological Sites, points'
    },
    mapModeButtons: {
      markers: 'Markers',
      heatmap: 'Heatmap'
    }
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
      shortDescription: 'Perspective1 description',
      longDescription: `
        <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
          Use this perspective to access data related to physical manuscript objects.
          If two or more source datasets include the same manuscript and
          this has been verified, the information from the source datasets has been merged
          into one manuscript. See <a href="/instructions">instructions</a> for using the
          filters. The result view can be selected using the tabs:
        </p>
        <ul class="MuiTypography-root MuiTypography-body1">
          <li>
            <strong>TABLE</STRONG> view includes all manuscripts in
            the MMM data. One table row is equivalent to one manuscript.
          </li>
          <li>
            <strong>PRODUCTION PLACES</STRONG> view visualizes the connection
            between manuscripts and the places where they were produced.
          </li>
          <li>
            <strong>MIGRATIONS</strong> view visualizes the migration of a
            manuscript from place of production to its most recently observed location.
          </li>
          <li>
            <strong>EXPORT</strong> the SPARQL query used to generate the result
            table view into YASGUI query editor.
          </li>
        </ul>
      `,
      instancePage: {
        label: 'Manuscript',
        description: `
          <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
            MMM’s Manuscript entity corresponds to
            <a href='https://www.ifla.org/publications/node/11240' target='_blank' rel='noopener noreferrer'>FRBRoo’s</a>
            Manifestation Singleton, defined as "physical objects that each carry an instance of
            [an Expression], and that were produced as unique objects..." The various types
            of records that describe manuscripts in each of the three contributing MMM
            datasets have been mapped to this entity.
          </p>
          <h6 class="MuiTypography-root MuiTypography-h6">
            Manuscript labels
          </h6>
          <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
            If the Bibale or Oxford databases reference a shelf mark for the manuscript,
            that information will appear as its label. Otherwise, an SDBM ID number will serve
            as its label. SDBM ID numbers contain prefixes that indicate different things about
            the type of record they contain:
          </p>
          <ul class="MuiTypography-root MuiTypography-body1">
            <li>
              SDBM_MS: SDBM Manuscript Record, which aggregates the data of two or more SDBM
              Entries. Each Entry represents a different observation of a manuscript at a different
              point in time, derived from various sources.
            </li>
            <li>
              SDBM_MS_orphan: a single Entry in the SDBM, meaning it has not been linked to any
              other Entries and therefore has no SDBM Manuscript Record.
            </li>
            <li>
              SDBM_MS_part: a record identified as a fragment of a larger manuscript.
            </li>
          </ul>
          <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph"></p>
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
        },
        author: {
          label: 'Author',
          description: `
            The author(s) who have contributed to the intellectual content (works)
            contained in the manuscript.
          `
        },
        work: {
          label: 'Work',
          description: 'The intellectual content (works) contained in the manuscript.'
        },
        expression: {
          label: 'Expression',
          description: 'The linguistic versions of the works contained in the manuscript.'
        },
        productionPlace: {
          label: 'Production place',
          description: `
            The location where the manuscript was written. Multiple production places
            may appear for a single manuscript due to the following reasons:  1) there
            are discrepancies in the contributing data source,  2) there are discrepancies
            between several contributing data sources, 3) the precise date is uncertain,
            4) the production indeed took place on several occasions (e.g. for composite
            manuscripts).
          `
        },
        productionTimespan: {
          label: 'Production date',
          description: `
            The date when the manuscript was written. Multiple production dates may appear
            for a single manuscript due to the following reasons:  1) there are discrepancies
            in the contributing data source,  2) there are discrepancies between several
            contributing data sources, 3) the precise date is uncertain, 4) the production
            indeed took place on several occasions (e.g. for composite manuscripts).
          `
        },
        note: {
          label: 'Note',
          description: `
            Other info such as distinguishing characteristics, notes on the physical structure
            of the manuscript, script types, note glosses, physical relationships among various
            texts and/or parts of a miscellany, such as multiple types of page layout.
          `
        },
        language: {
          label: 'Language',
          description: `
            The language(s) in which the manuscript was written.
          `
        },
        event: {
          label: 'Event',
          description: `
            Events related to the manuscript.
          `
        },
        owner: {
          label: 'Owner',
          description: `
            Former or current owners (individual or institutional).
          `
        },
        collection: {
          label: 'Collection',
          description: `
            The collection(s) that the manuscript has been part of at some point in time.
          `
        },
        transferOfCustodyPlace: {
          label: 'Transfer of Custody Place',
          description: `
            The locations of “Transfer of Custody” events related to the manuscript.
          `
        },
        transferOfCustodyTimespan: {
          label: 'Transfer of Custody Date',
          description: `
            The dates of “Transfer of Custody” events related to the manuscript.
          `
        },
        lastKnownLocation: {
          label: 'Last known location',
          description: `
            Last known location
          `
        },
        material: {
          label: 'Material',
          description: `
            The physical material on which the text is written.
          `
        },
        height: {
          label: 'Height',
          description: `
            The height of the manuscript in millimeters.
          `
        },
        width: {
          label: 'Width',
          description: `
            The width of the manuscript in millimeters.
          `
        },
        folios: {
          label: 'Folios',
          description: `
            The number of folios (leaves).
          `
        },
        lines: {
          label: 'Lines',
          description: `
            The number of lines in a text block. Left blank if the number of lines
            occurring throughout the manuscript is too irregular to be a useful
            descriptor for searching.
          `
        },
        columns: {
          label: 'Columns',
          description: `
            The number of columns. Left blank if the number of columns
            occurring throughout the manuscript is too irregular to be a useful
            descriptor for searching.
          `
        },
        miniatures: {
          label: 'Miniatures',
          description: `
            The number of miniatures.
          `
        },
        decoratedInitials: {
          label: 'Decorated initials',
          description: `
            The number of decorated initials.
          `
        },
        historiatedInitials: {
          label: 'Historiated initials',
          description: `
            The number of historiated initials.
          `
        },
        source: {
          label: 'Source',
          description: `
            The source dataset(s) (Bibale, Bodleian, or SDBM) contributing the
            information on the manuscript. If two or more source datasets include
            the same manuscript and this has been manually verified, the information
            from the source datasets have been merged into one manuscript (table row).
             Click on the links to view the original record on the source’s website.
          `
        }
      }
    },
    perspective2: {
      label: 'Perspective 2',
      facetResultsType: 'works',
      shortDescription: 'Perspective 2 description',
      longDescription: `
        <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
          Use this perspective to access data related to Works. The MMM data model follows
          the <a href='https://www.ifla.org/publications/node/11240' target='_blank' rel='noopener noreferrer'>FRBRoo</a>
          definition of a work, which refers to “distinct concepts or combinations
          of concepts identified in artistic and intellectual expressions.” Works
          contain title and author information. If two or more source
          datasets include the same Work and this has been verified, the information
          from the source datasets has been merged into one Work.  See
          <a href="/instructions">instructions</a> for using the filters.
          The result view can be selected using the tabs:
        </p>
        <ul class="MuiTypography-root MuiTypography-body1">
          <li>
            <strong>TABLE</STRONG> view gives you a list of specific works, and
            the manuscripts and manuscript collections in which they can be found.
          </li>
          <li>
            <strong>EXPORT</strong> the SPARQL query used to generate the result
            table view into YASGUI query editor.
          </li>
        </ul>
      `,
      instancePage: {
        label: 'Work',
        description: `
          <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
            The MMM data model follows the
            <a href='https://www.ifla.org/publications/node/11240' target='_blank' rel='noopener noreferrer'>FRBRoo</a>
            definition of a work, which refers to
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
          </p>
        `
      },
      properties: {
        uri: {
          label: 'URI',
          description: 'Uniform Resource Identifier'
        },
        prefLabel: {
          label: 'Title',
          description: 'The name or title of the Work.'
        },
        author: {
          label: 'Possible author',
          description: `
            The author(s) associated with the Work. Because of the structure of
            entries in the Schoenberg Database, the authors shown as being
            associated with a Work may actually be associated with other
            Works in the same manuscript instead.
          `
        },
        language: {
          label: 'Language',
          description: `
            The language in which a Work is written in the manuscript
            (i.e., an “Expression” of a Work). One manuscript may contain multiple languages.
          `
        },
        expression: {
          label: 'Expression',
          description: `
            The expression(s) of the Work.
          `
        },
        manuscript: {
          label: 'Manuscript',
          description: `
            The specific manuscript(s) in which the Work can be found.
          `
        },
        productionTimespan: {
          label: 'Manuscript production date',
          description: `
            The date(s) when the manuscript(s) in which the Work can be found were written.
            Multiple production dates may appear for a single manuscript,
            when there are discrepancies between the contributing data source
            or when the precise date is uncertain.
          `
        },
        collection: {
          label: 'Collection',
          description: `
            The specific collection(s) of manuscripts in which a Work can be found.
          `
        },
        source: {
          label: 'Source',
          description: `
            The source database(s) (Schoenberg, Bibale, and Bodleian) that the Work
            occurs in. Click on the result table link to view the original record on the
            source’s website.
          `
        }
      }
    },
    perspective3: {
      label: 'Perspective 3',
      facetResultsType: 'events',
      shortDescription: 'Perspective 3 description',
      longDescription: `
        <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
          Use this perspective to access data related to events associated with the
          histories of manuscripts and manuscript collections over the centuries.
          See <a href="/instructions">instructions</a> for using the filters.
          The result view can be selected using the tabs:
        </p>
        <ul class="MuiTypography-root MuiTypography-body1">
          <li>
            <strong>TABLE</STRONG> view includes all events in the MMM data.
          </li>
          <li>
            <strong>MAP</STRONG> view visualizes the events that have location information on a map.
          </li>
          <li>
            <strong>EXPORT</strong> the SPARQL query used to generate the result
            table view into YASGUI query editor.
          </li>
        </ul>
      `,
      instancePage: {
        label: 'Event',
        description: `
          <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
            Events refer to various activities related to Manuscripts and Actors. Event
            types include Production, Transfer of Custody, and Activity events.
            Production events refer to the production of the physical manuscript.
            Transfer of Custody events indicate a change of ownership that involved
            a transaction of some kind, usually through an auction house or bookseller.
            The generic Activity event type covers all other types of events.
          </p>
        `
      },
      properties: {
        uri: {
          label: 'URI',
          description: 'Uniform Resource Identifier'
        },
        type: {
          label: 'Type',
          description: `
            Distinguish between “Transfer of Custody”, “Production”, and other
            types of “Activity” events.
          `
        },
        language: {
          label: 'Language',
          description: `
            The language in which a Work is written in the manuscript
            (i.e., an “Expression” of a Work). One manuscript may contain multiple languages.
          `
        },
        manuscript: {
          label: 'Manuscript / Collection',
          description: `
            The manuscript or manuscript collection associated with the event.
          `
        },
        eventTimespan: {
          label: 'Date',
          description: `
            The date or time period associated with the event.
          `
        },
        place: {
          label: 'Place',
          description: `
            The specific place(s) associated with the event.
          `
        },
        placeType: {
          label: 'Place type',
          description: `
            The type of the specific place(s) associated with the event.
          `
        },
        note: {
          label: 'Note',
          description: `
            Note
          `
        },
        surrender: {
          label: 'Custody surrendered by',
          description: `
            Custody surrendered by
          `
        },
        receiver: {
          label: 'Custody received by',
          description: `
            Custody received by
          `
        },
        observedOwner: {
          label: 'Observed owner',
          description: `
            Observed owner
          `
        },
        source: {
          label: 'Source',
          description: `
            The source database (Schoenberg, Bibale, and Bodleian) that provided
            the information about the event.
          `
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
