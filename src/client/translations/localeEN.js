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
            “physical objects that each carry an instance of [an Expression], and that were
            produced as unique objects…” The various types of records that describe manuscripts
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
      'shortDescription': 'Physical manuscript objects',
    },
    'events': {
      'label': 'Events',
      'shortDescription': 'Physical manuscript objects',
    },
    'actors': {
      'label': 'Actors',
      'shortDescription': 'Physical manuscript objects',
    },
    'places': {
      'label': 'Places',
      'shortDescription': 'Physical manuscript objects',
    }
  }
};
