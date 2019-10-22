export default {
  'languageLabel': 'English',
  'topBar': {
    'appTitle': 'MMM',
    'feedback': 'feedback',
    'info': {
      'blog': 'Blog',
      'aboutTheProject': 'About the project'
    },
    'instructions': 'instructions'
  },
  'facetBar': {
    'results': 'Results',
    'narrowDownBy': 'Narrow down by'
  },
  'tabs': {
    'table': 'table',
    'map': 'map',
    'production_places': 'production places',
    'migrations': 'migrations',
    'export': 'export'
  },
  'table': {
    'rowsPerPage': 'Rows per page',
    'of': 'of'
  },
  'perspectives': {
    'manuscripts': {
      'label': 'Manuscripts',
      'shortDescription': 'Physical manuscript objects',
      'longDescription': `
        <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
          Use this perspective to access data related to physical manuscript objects.
          The paginated tabular result view is default, including all manuscripts in
          the MMM data. One table row is equivalent to one manuscript. If two or more
          source datasets include the same manuscript and this has been
          manually verified, the information from the source datasets has been merged
          into one table row.
        </p>
        <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
          To view the production places of manuscripts on a map, choose the “Production
          Place” tab.
        </p>
      `,
      'instancePage': {
        'label': 'Manuscript',
        'description': `
          <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
            This landing page provides a human-readable summary of the data points that link
            to this Manuscript. The data included in this summary reflects only those data
            points used in the MMM interface. Click the Open in Linked Data Browser button to
            view the complete set of classes and properties linked to this record. To cite this
            record, use its url.
          </p>
          <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
            MMM’s Manuscript entity corresponds to FRBRoo’s Manifestation Singleton, defined as
            "physical objects that each carry an instance of [an Expression], and that were
            produced as unique objects…" The various types of records that describe manuscripts
            in each of the three contributing MMM datasets have been mapped to this entity.
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
        `
      },
      'properties': {
        'uri': {
          'label': 'URI',
          'description': 'Uniform Resource Identifier'
        },
        'prefLabel': {
          'label': 'Label',
          'description': 'A short label describing the manuscript.'
        },
        'author': {
          'label': 'Author',
          'description':`
            The author(s) who have contributed to the intellectual content (works)
            contained in the manuscript.
          `
        },
        'work': {
          'label': 'Work',
          'description': 'The intellectual content (works) contained in the manuscript.'
        },
        'expression': {
          'label': 'Label',
          'description': 'The linguistic versions of the works contained in the manuscript.'
        },
        'productionPlace': {
          'label': 'Production place',
          'description': `
            The location where the manuscript was written. Multiple production places
            may appear for a single manuscript due to the following reasons:  1) there
            are discrepancies in the contributing data source,  2) there are discrepancies
            between several contributing data sources, 3) the precise date is uncertain,
            4) the production indeed took place on several occasions (e.g. for composite
            manuscripts).
          `
        },
        'productionTimespan': {
          'label': 'Production date',
          'description': `
            The date when the manuscript was written. Multiple production dates may appear
            for a single manuscript due to the following reasons:  1) there are discrepancies
            in the contributing data source,  2) there are discrepancies between several
            contributing data sources, 3) the precise date is uncertain, 4) the production
            indeed took place on several occasions (e.g. for composite manuscripts).
          `
        },
        'note': {
          'label': 'Note',
          'description': `
            Other info such as distinguishing characteristics, notes on the physical structure
            of the manuscript, script types, note glosses, physical relationships among various
            texts and/or parts of a miscellany, such as multiple types of page layout.
          `
        },
        'language': {
          'label': 'Language',
          'description': `
            The language(s) in which the manuscript was written.
          `
        },
        'event': {
          'label': 'Event',
          'description': `
            Events related to the manuscript.
          `
        },
        'owner': {
          'label': 'Owner',
          'description': `
            Former or current owners (individual or institutional).
          `
        },
        'collection': {
          'label': 'Collection',
          'description': `
            The collection(s) that the manuscript has been part of at some point in time.
          `
        },
        'transferOfCustodyPlace': {
          'label': 'Transfer of Custody Place',
          'description': `
            The locations of “Transfer of Custody” events related to the manuscript.
          `
        },
        'transferOfCustodyTimespan': {
          'label': 'Transfer of Custody Date',
          'description': `
            The dates of “Transfer of Custody” events related to the manuscript.
          `
        },
        'material': {
          'label': 'Material',
          'description': `
            The physical material on which the text is written.
          `
        },
        'height': {
          'label': 'Height',
          'description': `
            The height of the manuscript in millimeters.
          `
        },
        'width': {
          'label': 'Width',
          'description': `
            The width of the manuscript in millimeters.
          `
        },
        'folios': {
          'label': 'Folios',
          'description': `
            The number of folios (leaves).
          `
        },
        'lines': {
          'label': 'Lines',
          'description': `
            The number of lines in a text block. Left blank if the number of lines
            occurring throughout the manuscript is too irregular to be a useful
            descriptor for searching.
          `
        },
        'columns': {
          'label': 'Columns',
          'description': `
            The number of columns. Left blank if the number of columns
            occurring throughout the manuscript is too irregular to be a useful
            descriptor for searching.
          `
        },
        'miniatures': {
          'label': 'Miniatures',
          'description': `
            The number of miniatures.
          `
        },
        'decoratedInitials': {
          'label': 'Decorated initials',
          'description': `
            The number of decorated initials.
          `
        },
        'historiatedInitials': {
          'label': 'Historiated initials',
          'description': `
            The number of historiated initials.
          `
        },
        'source': {
          'label': 'Source',
          'description': `
            The source dataset(s) (Bibale, Bodleian, or SDBM) contributing the
            information on the manuscript. If two or more source datasets include
            the same manuscript and this has been manually verified, the information
            from the source datasets have been merged into one manuscript (table row).
             Click on the links to view the original record on the source’s website.
          `
        },
      },
    },
    'works': {
      'label': 'Works',
      'shortDescription': 'Intellectual content carried out by manuscripts.',
      'longDescription': `
        <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
          Use this perspective to access data related to Works. The table view gives
          you a list of specific works, and the manuscripts and manuscript
          collections in which they can be found.
        </p>
      `,
      'instancePage': {
        'label': 'Work',
        'description': `
          <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
            This landing page provides a human-readable summary of the data points that
            link to this Work. The data included in this summary reflects only those data
            points used in the MMM interface. Click the Open in Linked Data Browser button
            to view the complete set of classes and properties linked to this record.
            To cite this record, use its url.
          </p>
          <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
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
          </p>
        `
      },
      'properties': {
        'uri': {
          'label': 'URI',
          'description': 'Uniform Resource Identifier'
        },
        'prefLabel': {
          'label': 'Title',
          'description': 'The name or title of the Work.'
        },
        'author': {
          'label': 'Possible author',
          'description': `
            The author(s) associated with the Work. Because of the structure of
            entries in the Schoenberg Database, the authors shown as being
            associated with a Work may actually be associated with other
            Works in the same manuscript instead.
          `
        },
        'language': {
          'label': 'Language',
          'description':  `
            The language in which a Work is written in the manuscript
            (i.e., an “Expression” of a Work). One manuscript may contain multiple languages.
          `
        },
        'manuscript': {
          'label': 'Manuscript',
          'description': `
            The specific manuscript(s) in which the Work can be found.
          `
        },
        'productionTimespan': {
          'label': 'Manuscript production date',
          'description': `
            The date(s) when the manuscript(s) in which the Work can be found were written.
            Multiple production dates may appear for a single manuscript,
            when there are discrepancies between the contributing data source
            or when the precise date is uncertain.
          `
        },
        'collection': {
          'label': 'Collection',
          'description': `
            The specific collection(s) of manuscripts in which a Work can be found.
          `
        },
        'source': {
          'label': 'Source',
          'description': `
            The source database(s) (Schoenberg, Bibale, and Bodleian) that the Work
            occurs in. Click on the result table link to view the original record on the
            source’s website.
          `
        },
      }
    },
    'events': {
      'label': 'Events',
      'shortDescription': 'Events related to manuscripts.',
      'longDescription': `
        <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
          Use this perspective to access data related to events. The table view gives you a
          list of specific events associated with the histories of manuscripts and manuscript
          collections over the centuries.
        </p>
      `,
      'instancePage': {
        'label': 'Event',
        'description': `
          <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
            This landing page provides a human-readable summary of the data points that link
            to this Event. The data included in this summary reflects only those data points
            used in the MMM interface. Click the Open in Linked Data Browser button to
            view the complete set of classes and properties linked to this record.
            To cite this record, use its url.
          </p>
        `
      },
      'properties': {
        'uri': {
          'label': 'URI',
          'description': 'Uniform Resource Identifier'
        },
        'type': {
          'label': 'Type',
          'description': `
            Distinguish between “Transfer of Custody”, “Production”, and other
            types of “Activity” events.
          `
        },
        'language': {
          'label': 'Language',
          'description':  `
            The language in which a Work is written in the manuscript
            (i.e., an “Expression” of a Work). One manuscript may contain multiple languages.
          `
        },
        'manuscript': {
          'label': 'Manuscript / Collection',
          'description': `
            The manuscript or manuscript collection associated with the event.
          `
        },
        'eventTimespan': {
          'label': 'Date',
          'description': `
            The date or time period associated with the event.
          `
        },
        'place': {
          'label': 'Place',
          'description': `
            The specific place(s) associated with the event.
          `
        },
        'surrender': {
          'label': 'Custody surrendered by',
          'description': `
            Custody surrendered by
          `
        },
        'receiver': {
          'label': 'Custody received by',
          'description': `
            Custody received by
          `
        },
        'observedOwner': {
          'label': 'Observed owner',
          'description': `
            Observed owner
          `
        },
        'source': {
          'label': 'Source',
          'description': `
            The source database (Schoenberg, Bibale, and Bodleian) that provided
            the information about the event.
          `
        },
      }
    },
    'actors': {
      'label': 'Actors',
      'shortDescription': 'People and institutions related to manuscripts and works.',
      'longDescription': `
        <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
          This perspective provides access to data related to the persons and institutions who
          impacted the production or dissemination of manuscripts and works. Actors include authors
          of works, artists and scribes who produced manuscripts, and the individual owners and
          institutions who bought or sold manuscripts.
        </p>
        <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
          The paginated tabular result view is default, including all actors in the MMM data. One
          table row is equivalent to one actor. Use the map view to visualize the connection
          between Actors and the places where they lived or were located. These links are
          indicated by the markers on the map. The markers cluster by region or nation,
          and resolve themselves into more specific locations as you zoom in on the map. Blue
          markers cannot be resolved any further: click on them to reveal links to the Actor
          records associated with that location.
        </p>
      `,
      'instancePage': {
        'label': 'Actor',
        'description': `
          <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
            This landing page provides a human-readable summary of the data points that link to this Actor.
            The data included in this summary reflects only those data points used in the MMM interface.
            Click the Open in Linked Data Browser button to view the complete set of classes and
            properties linked to this record. To cite this record, use its url.
          </p>
        `
      },
      'properties': {
        'uri': {
          'label': 'URI',
          'description': 'Uniform Resource Identifier'
        },
        'prefLabel': {
          'label': 'Name',
          'description': `
            The standardized name of the actor.
          `
        },
        'type': {
          'label': 'Type',
          'description':  `
            Indicates whether the actor is an individual (Person) or an institution,
            corporation, or family (Group)
          `
        },
        'birthDateTimespan': {
          'label': 'Birth / formation date',
          'description': `
            The date when the actor was born or established.
          `
        },
        'deathDateTimespan': {
          'label': 'Death / dissolution date',
          'description': `
            The date when the actor died or dissolved.
          `
        },
        'place': {
          'label': 'Activity location',
          'description': `
            Place(s) of activity linked to this actor.
          `
        },
        'work': {
          'label': 'Work',
          'description': `
            Work(s) linked to the actor.
          `
        },
        'manuscript': {
          'label': 'Manuscript',
          'description': `
            Manuscript(s) linked to the actor.
          `
        },
        'role': {
          'label': 'Role',
          'description': `
            Role(s)
          `
        },
        'source': {
          'label': 'Source',
          'description': `
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
    'places': {
      'label': 'Places',
      'shortDescription': 'Places related to manuscripts and works.',
      'longDescription': `
        <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
          Use this perspective to access data related to places named in the source datasets
          (Schoenberg, Bibale, and Bodleian). The places have been linked to Getty Thesaurus
          of Geographic Names when possible. Place types include everything from continents
          (North America) to countries (Canada) to regions/provinces (British Columbia)
          to cities (Vancouver). The map result view is default, showing all the places that
          have coordinates. The table result view includes all places in MMM data.
        </p>
      `,
      'instancePage': {
        'label': 'Place',
        'description': `
          <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
            This landing page provides a human-readable summary of the data points that link
            to this Place. The data included in this summary reflects only those data points
            used in the MMM interface. Click the Open in Linked Data Browser button to
            view the complete set of classes and properties linked to this record. To cite this record, use its url.
          </p>
          <p class="MuiTypography-root MuiTypography-body1 MuiTypography-paragraph">
            MMM utilizes the Getty Thesaurus of Geographic Names as its hierarchy for geographic data.
            Coordinate data is approximate for locations such as counties, regions, and nations.
          </p>
        `
      },
      'properties': {
        'uri': {
          'label': 'URI',
          'description': 'Uniform Resource Identifier'
        },
        'prefLabel': {
          'label': 'Name',
          'description': `
            The name of the place.
          `
        },
        'placeType': {
          'label': 'Place type',
          'description':  `
            The place type from Getty Thesaurus of Geographic Names.
          `
        },
        'area': {
          'label': 'Parent Place',
          'description': `
            The preferred parent place in the hierarchy used by the Getty
            Thesaurus of Geographic Names.
          `
        },
        'manuscriptProduced': {
          'label': 'Manuscripts produced',
          'description': `
            Manuscript(s) produced here.
          `
        },
        'manuscriptTransferred': {
          'label': 'Manuscripts transferred',
          'description': `
            The manuscript(s) that have a "Transfer of Custody" event located here.
          `
        },
        'manuscriptObserved': {
          'label': 'Manuscripts observed',
          'description': `
            The manuscript(s) that have a provenance event located here.
          `
        },
        'actor': {
          'label': 'Actor',
          'description': `
            The actor(s) associated with the place.
          `
        },
        'source': {
          'label': 'Source',
          'description': `
            The source dataset (Schoenberg, Bibale, and Bodleian) and the place
            authority (Getty Thesaurus of Geographic Names and GeoNames)
            contributing the information on the place.
          `
        }
      }
    }
  },
  'aboutTheProject': `


  `
};
