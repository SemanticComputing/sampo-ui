export const endpoint = 'http://ldf.fi/mmm-cidoc/sparql';
//export const endpoint = 'http://localhost:3050/ds/sparql';

export const countQuery = `
  SELECT (COUNT(DISTINCT ?id) as ?count)
  WHERE {
    <FILTER>
    ?id a <RDF_TYPE> .
  }
`;

export const facetResultSetQuery = `
  SELECT *
  WHERE {
    {
      SELECT DISTINCT ?id {
        <FILTER>
        ?id a <RDF_TYPE> .
        ?id <ORDER_BY_PREDICATE> ?orderBy .
      }
      ORDER BY (!BOUND(?orderBy)) <SORT_DIRECTION>(?orderBy)
      <PAGE>
    }
    FILTER(BOUND(?id))
    <RESULT_SET_PROPERTIES>
  }
`;

export const facetValuesQuery = `
  SELECT DISTINCT ?id ?prefLabel ?selected ?source ?parent ?lat ?long ?instanceCount {
    {
      {
        SELECT DISTINCT (count(DISTINCT ?instance) as ?instanceCount) ?id ?selected ?source ?lat ?long ?parent {
          {
            <FILTER>
            ?instance <PREDICATE> ?id .
            ?instance a <RDF_TYPE> .
            <SELECTED_VALUES>
            BIND(COALESCE(?selected_, false) as ?selected)
            OPTIONAL { ?id dct:source ?source . }
            OPTIONAL { ?id gvp:broaderPreferred ?parent_ . }
            BIND(COALESCE(?parent_, '0') as ?parent)
          }
          <PARENTS>
        }
        GROUP BY ?id ?selected ?source ?lat ?long ?parent
      }
      FILTER(BOUND(?id))
      <FACET_VALUE_FILTER>
      OPTIONAL { ?id skos:prefLabel ?prefLabel_ }
      BIND(COALESCE(STR(?prefLabel_), STR(?id)) AS ?prefLabel)
    }
    UNION
    {
      {
        SELECT DISTINCT (count(DISTINCT ?instance) as ?instanceCount) {
          <FILTER>
          ?instance a <RDF_TYPE> .
          FILTER NOT EXISTS {
            ?instance <PREDICATE> ?value .
          }
        }
      }
      BIND(IRI("http://ldf.fi/MISSING_VALUE") AS ?id)
      BIND("Unknown" AS ?prefLabel)
      BIND('0' as ?parent)
    }

  }
  <ORDER_BY>
`;
