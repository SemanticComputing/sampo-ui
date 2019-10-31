export default {
  languageLabel: 'English',
  appTitle: {
    short: 'mmm',
    long: 'Mapping Manuscript Migrations'
  },
  appDescription: `
    Mapping Manuscript Migrations (MMM) is a semantic portal for finding and studying pre-modern manuscripts and
    their movements, based on linked collections of Schoenberg Institute, Bodleian Library,
    and IRHT.
  `,
  selectPerspective: 'Select a perspective to search and browse the MMM data:',
  topBar: {
    feedback: 'feedback',
    info: {
      info: 'Info',
      blog: 'Blog',
      aboutTheProject: 'About the project'
    },
    searchBarPlaceHolder: 'Search all MMM content',
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
    migrations: 'migrations',
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
    manuscripts: {
      label: 'Manuscripts',
      facetResultsType: 'manuscripts',
      shortDescription: 'Physical manuscript objects',
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
          description:`
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
        },
      },
    },
    works: {
      label: 'Works',
      facetResultsType: 'works',
      shortDescription: 'Intellectual content carried out by manuscripts.',
      longDescription: `
        <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
          Use this perspective to access data related to Works. The MMM data model follows
          the <a href='https://www.ifla.org/publications/node/11240' target='_blank' rel='noopener noreferrer'>FRBRoo</a>
          definition of a work, which refers to “distinct concepts or combinations
          of concepts identified in artistic and intellectual expressions.” If two or more source
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
          description:  `
            The language in which a Work is written in the manuscript
            (i.e., an “Expression” of a Work). One manuscript may contain multiple languages.
          `
        },
        expression: {
          label: 'Expression',
          description:  `
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
        },
      }
    },
    events: {
      label: 'Events',
      facetResultsType: 'events',
      shortDescription: 'Events related to manuscripts.',
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
          description:  `
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
        },
      }
    },
    actors: {
      label: 'Actors',
      facetResultsType: 'actors',
      shortDescription: 'People and institutions related to manuscripts and works.',
      longDescription: `
        <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
          This perspective provides access to data related to the persons and institutions
          who impacted the production or dissemination of manuscripts and works.
          Actors include authors of works, artists and scribes who produced manuscripts,
          and the individual owners and institutions who bought or sold manuscripts.
          If two or more source datasets include the same Actor and this has been verified,
          the information from the source datasets has been merged into one Actor.
          See <a href="/instructions">instructions</a> for using the filters.
          The result view can be selected using the tabs:
        </p>
        <ul class="MuiTypography-root MuiTypography-body1">
          <li>
            <strong>TABLE</STRONG> view includes all Actors in the MMM data.
          </li>
          <li>
            <strong>MAP</STRONG> view visualizes the connection between Actors
            and the places where they lived or were located.
          </li>
          <li>
            <strong>EXPORT</strong> the SPARQL query used to generate the result
            table view into YASGUI query editor.
          </li>
        </ul>
      `,
      instancePage: {
        label: 'Actor',
        description: `
          <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
            Actors are individuals or groups who influenced the production or provenance
            of a manuscript. Actor types include Person, Group, or Actor. Persons refer to
            individuals, while Groups indicate corporate or institutional bodies.
            The Actor type is used when a more specific type is unknown or not specified
            in the source dataset.
          </p>
        `
      },
      properties: {
        uri: {
          label: 'URI',
          description: 'Uniform Resource Identifier'
        },
        prefLabel: {
          label: 'Name',
          description: `
            The standardized name of the actor.
          `
        },
        type: {
          label: 'Type',
          description:  `
            Indicates whether the actor is an individual (Person) or an institution,
            corporation, or family (Group)
          `
        },
        birthDateTimespan: {
          label: 'Birth / formation date',
          description: `
            The date when the actor was born or established.
          `
        },
        deathDateTimespan: {
          label: 'Death / dissolution date',
          description: `
            The date when the actor died or dissolved.
          `
        },
        place: {
          label: 'Activity location',
          description: `
            Place(s) of activity linked to this actor.
          `
        },
        work: {
          label: 'Work',
          description: `
            Work(s) linked to the actor.
          `
        },
        manuscript: {
          label: 'Manuscript',
          description: `
            Manuscript(s) linked to the actor.
          `
        },
        role: {
          label: 'Role',
          description: `
            Role(s)
          `
        },
        source: {
          label: 'Source',
          description: `
            The source dataset(s) (Bibale, Bodleian, or SDBM) contributing the
            information on the actor. If two or more source datasets include the
            same actor and this has been manually verified, the information from
            the source datasets has been merged into one MMM actor.
            Click on the result table link(s) to view the original record on the
            source’s website.
          `
        }
      }
    },
    places: {
      label: 'Places',
      facetResultsType: 'places',
      shortDescription: 'Places related to manuscripts and works.',
      longDescription: `
        <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
          Use this perspective to access data related to places named in the source datasets
          (Schoenberg, Bibale, and Bodleian). The places have been linked to Getty Thesaurus
          of Geographic Names when possible. If two or more source datasets include the same
          Place and this has been verified, the information from the source datasets has been
          merged into one Place. See <a href="/instructions">instructions</a> for using the filters.
          The result view can be selected using the tabs:
        </p>
        <ul class="MuiTypography-root MuiTypography-body1">
          <li>
            <strong>TABLE</STRONG> view includes all Places in the MMM data.
          </li>
          <li>
            <strong>MAP</STRONG> view shows all Places that have coordinates.
          </li>
          <li>
            <strong>EXPORT</strong> the SPARQL query used to generate the result
            table view into YASGUI query editor.
          </li>
        </ul>
      `,
      instancePage: {
        label: 'Place',
        description: `
          <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
            Places refer to geographic locations that relate to Manuscripts, Events, Actors, and
            Collections. MMM uses the Getty Thesaurus of Geographic Names as its hierarchy for
            geographic data. Coordinate data is approximate for locations such as counties,
            regions, and nations.
          </p>
        `
      },
      properties: {
        uri: {
          label: 'URI',
          description: 'Uniform Resource Identifier'
        },
        prefLabel: {
          label: 'Name',
          description: `
            The name of the place.
          `
        },
        placeType: {
          label: 'Place type',
          description:  `
            The place type from Getty Thesaurus of Geographic Names.
          `
        },
        area: {
          label: 'Parent Place',
          description: `
            The preferred parent place in the hierarchy used by the Getty
            Thesaurus of Geographic Names.
          `
        },
        manuscriptProduced: {
          label: 'Manuscripts produced',
          description: `
            Manuscript(s) produced here.
          `
        },
        manuscriptTransferred: {
          label: 'Manuscripts transferred',
          description: `
            The manuscript(s) that have a "Transfer of Custody" event located here.
          `
        },
        manuscriptObserved: {
          label: 'Manuscripts observed',
          description: `
            The manuscript(s) that have a provenance event located here.
          `
        },
        actor: {
          label: 'Actor',
          description: `
            The actor(s) associated with the place.
          `
        },
        source: {
          label: 'Source',
          description: `
            The source dataset (Schoenberg, Bibale, and Bodleian) and the place
            authority (Getty Thesaurus of Geographic Names and GeoNames)
            contributing the information on the place.
          `
        }
      }
    },
    collections: {
      label: '',
      facetResultsType: '',
      shortDescription: '',
      longDescription: `
      `,
      instancePage: {
        label: 'Collection',
        description: `
          <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
            A collection refers to a group of manuscripts that were owned by the same actor,
            including individuals, institutions, or other types of groups. A manuscript can
            appear in multiple collections over time, and no explicit distinction
            is made between a manuscript’s current or former collections. Similarly,
            collections will include links to every manuscript that has ever been in
            the collection, regardless of whether all of those manuscripts were within
            the collection at the same time.
          </p>
        `
      },
      properties: {
        uri: {
          label: 'URI',
          description: 'Uniform Resource Identifier'
        },
        prefLabel: {
          label: 'Name',
          description: `
            The name or title of the Collection.
          `
        },
        manuscript: {
          label: 'Manuscript',
          description:  `
            The manuscript(s) that have been a part of the collection at some
            point in time.
          `
        },
        owner: {
          label: 'Owner',
          description: `
            Former or current owners (individual or institutional).
          `
        },
        place: {
          label: 'Place',
          description: `
            Location of the collection at some point during its existence
          `
        },
        source: {
          label: 'Source',
          description: `
            The source database (Schoenberg, Bibale, and Bodleian) that the Collection
            occurs in. Currently one Collection has always only one dataset as a source.
          `
        }
      }
    },
    expressions: {
      label: '',
      facetResultsType: '',
      shortDescription: '',
      longDescription: `
      `,
      instancePage: {
        label: 'Expression',
        description: `
          <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
            The MMM data model follows the
            <a href='https://www.ifla.org/publications/node/11240' target='_blank' rel='noopener noreferrer'>FRBRoo</a>
            definition of an Expression, which
            refers to “the intellectual or artistic realisations of works in the form
            of identifiable immaterial objects...” Expressions contain title,
            and language information, and represent the various versions of texts that
            appear in manuscripts.
          </p>
        `
      },
      properties: {
        uri: {
          label: 'URI',
          description: 'Uniform Resource Identifier'
        },
        prefLabel: {
          label: 'Name',
          description: `
            The name or title of the Expression.
          `
        },
        language: {
          label: 'Language',
          description:  `
            The language of the Expression.
          `
        },
        source: {
          label: 'Source',
          description: `
            The source database (Schoenberg, Bibale, and Bodleian) that the Expression
            occurs in. Currently one Expression has always only one dataset as a source.
          `
        }
      }
    },
  },
  aboutTheProject: `


  `
};
