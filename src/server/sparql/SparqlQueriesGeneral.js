export const endpoint = 'http://ldf.fi/mmm-cidoc/sparql';
// export const endpoint = 'http://localhost:3050/ds/sparql';

export const countQuery = `
  SELECT (COUNT(DISTINCT ?id) as ?count)
  WHERE {
    <FILTER>
    ?id a <RDF_TYPE> .
  }
`;

export const jenaQuery = `
  SELECT ?id ?prefLabel ?dataProviderUrl ?source__id ?source__prefLabel ?type__id ?type__prefLabel
  WHERE {
    <QUERY>
    ?id skos:prefLabel ?prefLabel .
    ?id a ?type__id .
    ?type__id rdfs:label|skos:prefLabel ?type__prefLabel_ .
    BIND(STR(?type__prefLabel_) AS ?type__prefLabel)  # ignore language tags
    OPTIONAL {
      ?id dct:source ?source__id .
      OPTIONAL { ?source__id skos:prefLabel ?source__prefLabel_ }
      BIND(COALESCE(?source__prefLabel_, ?source__id) as ?source__prefLabel)
    }
    OPTIONAL {
      ?id mmm-schema:data_provider_url ?dataProviderUrl
    }
    FILTER(?type__id != frbroo:F27_Work_Conception)
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
  SELECT DISTINCT ?id ?prefLabel ?selected ?parent ?instanceCount {
    {
      {
        SELECT DISTINCT (count(DISTINCT ?instance) as ?instanceCount) ?id ?selected ?parent {
          {
            <FILTER>
            ?instance <PREDICATE> ?id .
            ?instance a <RDF_TYPE> .
            <SELECTED_VALUES>
            BIND(COALESCE(?selected_, false) as ?selected)
            OPTIONAL { ?id gvp:broaderPreferred ?parent_ . }
            BIND(COALESCE(?parent_, '0') as ?parent)
          }
          <PARENTS>
        }
        GROUP BY ?id ?selected ?source ?parent
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
      BIND(false as ?selected)
    }

  }
  <ORDER_BY>
`;
