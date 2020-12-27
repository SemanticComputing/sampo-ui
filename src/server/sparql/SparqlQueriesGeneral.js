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
    <RESULT_SET_PROPERTIES>
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
        ?id <FACET_LABEL_PREDICATE> ?prefLabel_
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
            ?instance <MISSING_PREDICATE> [] .
          }
        }
      }
      FILTER(?instanceCount > 0)
      BIND(IRI("http://ldf.fi/MISSING_VALUE") AS ?id)
      # prefLabel for <http://ldf.fi/MISSING_VALUE> is given in client/translations
      BIND('0' as ?parent)
      BIND(<UNKNOWN_SELECTED> as ?selected)
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

export const sitemapQuery = `
  SELECT ?url 
  WHERE {
    VALUES ?resultClass { <RESULT_CLASS> }
    ?uri a ?resultClass .
    BIND(CONCAT("/<PERSPECTIVE>/page/", REPLACE(STR(?uri), "^.*\\\\/(.+)", "$1")) AS ?url)
  }
  LIMIT 100
`
