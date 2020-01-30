export const endpoint = 'http://ldf.fi/mmm/sparql'
// export const endpoint = 'http://localhost:3050/ds/sparql';

export const instanceQuery = `
  SELECT * {
    BIND(<ID> as ?id)
    <PROPERTIES>
    <RELATED_INSTANCES>
  }
`

export const countQuery = `
  SELECT (COUNT(DISTINCT ?id) as ?count)
  WHERE {
    <FILTER>
    VALUES ?facetClass { <FACET_CLASS> }
    ?id a ?facetClass .
  }
`

export const jenaQuery = `
  SELECT *
  WHERE {
    <QUERY>
    {
      ?id a ?type__id .
      ?type__id rdfs:label|skos:prefLabel ?type__prefLabel_ .
      BIND(STR(?type__prefLabel_) AS ?type__prefLabel)  # ignore language tags
    }
    UNION
    {
      ?id dct:source ?source__id .
      ?source__id skos:prefLabel ?source__prefLabel .
      ?source__id mmm-schema:data_provider_url ?source__dataProviderUrl .
    }
    UNION
    {
      ?id mmm-schema:data_provider_url ?source__id .
      BIND(?source__id as ?source__dataProviderUrl)
      BIND(?source__id as ?source__prefLabel)
    }
    UNION
    {
      ?id a frbroo:F4_Manifestation_Singleton .
      ?id skos:prefLabel ?prefLabel__id .
      BIND(?prefLabel__id as ?prefLabel__prefLabel)
      BIND(CONCAT("/manuscripts/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
    }
    UNION
    {
      ?id a frbroo:F1_Work .
      ?id skos:prefLabel ?prefLabel__id .
      BIND(?prefLabel__id as ?prefLabel__prefLabel)
      BIND(CONCAT("/works/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
    }
    UNION
    {
      VALUES ?eventClass { crm:E10_Transfer_of_Custody crm:E12_Production crm:E7_Activity crm:E67_Birth crm:E69_Death }
      ?id a ?eventClass .
      OPTIONAL { ?id skos:prefLabel ?prefLabel__id_ }
      BIND(COALESCE(?prefLabel__id_, ?id) as ?prefLabel__id)
      BIND(?prefLabel__id as ?prefLabel__prefLabel)
      BIND(CONCAT("/events/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
    }
    UNION
    {
      VALUES ?actorClass { crm:E21_Person crm:E74_Group crm:E39_Actor }
      ?id a ?actorClass .
      ?id skos:prefLabel ?prefLabel__id .
      BIND(?prefLabel__id as ?prefLabel__prefLabel)
      BIND(CONCAT("/actors/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
    }
    UNION
    {
      ?id a crm:E53_Place .
      ?id skos:prefLabel ?prefLabel__id .
      BIND(?prefLabel__id as ?prefLabel__prefLabel)
      BIND(CONCAT("/places/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
    }
    UNION
    {
      ?id a crm:E78_Collection .
      ?id skos:prefLabel ?prefLabel__id .
      BIND(?prefLabel__id as ?prefLabel__prefLabel)
      BIND(CONCAT("/collections/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
    }
    UNION
    {
      ?id a frbroo:F2_Expression .
      ?id skos:prefLabel ?prefLabel__id .
      BIND(?prefLabel__id as ?prefLabel__prefLabel)
      BIND(CONCAT("/expressions/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
    }
  }
`

export const facetResultSetQuery = `
  SELECT *
  WHERE {
    {
      SELECT DISTINCT ?id {
        <FILTER>
        VALUES ?facetClass { <FACET_CLASS> }
        ?id a ?facetClass .
        <ORDER_BY_TRIPLE>
      }
      <ORDER_BY>
      <PAGE>
    }
    FILTER(BOUND(?id))
    <RESULT_SET_PROPERTIES>
  }
`

export const facetValuesQuery = `
  SELECT DISTINCT ?id ?prefLabel ?selected ?parent ?instanceCount {
    {
      {
        SELECT DISTINCT (count(DISTINCT ?instance) as ?instanceCount) ?id ?selected {
          # facet values that return results
          {
            <FILTER>
            ?instance <PREDICATE> ?id .
            VALUES ?facetClass { <FACET_CLASS> }
            ?instance a ?facetClass .
            <SELECTED_VALUES>
          }
          <SELECTED_VALUES_NO_HITS>
          <PARENTS>
          BIND(COALESCE(?selected_, false) as ?selected)
        }
        GROUP BY ?id ?selected
      }
      FILTER(BOUND(?id))
      <FACET_VALUE_FILTER>
      OPTIONAL {
        ?id skos:prefLabel|rdfs:label ?prefLabel_
        <FACET_LABEL_FILTER>
      }
      <PARENTS_FOR_FACET_VALUES>
      BIND(COALESCE(STR(?prefLabel_), STR(?id)) AS ?prefLabel)
    }
    UNION
    {
      # 'Unknown' facet value for results with no predicate path
      {
        SELECT DISTINCT (count(DISTINCT ?instance) as ?instanceCount) {
          <FILTER>
          VALUES ?facetClass { <FACET_CLASS> }
          ?instance a ?facetClass .
          FILTER NOT EXISTS {
            ?instance <PREDICATE> [] .
          }
        }
      }
      FILTER(?instanceCount > 0)
      BIND(IRI("http://ldf.fi/MISSING_VALUE") AS ?id)
      BIND("Unknown" AS ?prefLabel)
      BIND('0' as ?parent)
      BIND(false as ?selected)
    }
  }
  <ORDER_BY>
`

export const facetValuesQueryTimespan = `
  # ignore selections from other facets
  SELECT ?min ?max {
    {
      SELECT (MIN(?start) AS ?min) {
        ?instance <PREDICATE> ?timespan .
        VALUES ?facetClass { <FACET_CLASS> }
        ?instance a ?facetClass .
        ?timespan <START_PROPERTY> ?start .
        <FACET_VALUE_FILTER>
      }
    }
    {
      SELECT (MAX(?end) AS ?max) {
        ?instance <PREDICATE> ?timespan .
        VALUES ?facetClass { <FACET_CLASS> }
        ?instance a ?facetClass .
        ?timespan <END_PROPERTY> ?end .
        <FACET_VALUE_FILTER>
      }
    }
  }
`

export const facetValuesRange = `
  # ignore selections from other facets
  SELECT (MIN(?value) AS ?min) (MAX(?value) AS ?max) {
    ?instance <PREDICATE> ?value .
    VALUES ?facetClass { <FACET_CLASS> }
    ?instance a ?facetClass .
    <FACET_VALUE_FILTER>
  }
`
