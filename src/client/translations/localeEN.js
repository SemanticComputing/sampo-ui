export default {
  'label': 'English',
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
      'tableColumns': {
        'uri': {
          'label': 'URI',
          'description': 'Uniform Resource Identifier'
        },
        'prefLabel': {
          'label': 'Label',
          'description': 'A short label describing the manuscript.'
        }
      },
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
      }
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
        'label': 'Work',
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
      }
    }
  },
  'aboutTheProject': `


  `
};
