# Sparql queries config

## How queries get constructed

The sampo server constructs its queries starting from a general query structure with tags in it like ``<FILTER>``. 
Queries get constructed by replacing these tags with query sections depending on the selected perspective and facets.

General query structures can be overwritten as described in [overwriting general queries](./CustomComponents.md#overwriting-general-queries).

In version 5 of sampo we aim to replace this system with a set default profiles, each profile being a specifically made
for a particular type of sparql endpoint (Jena, Qlever, Ontop, ...). 

### Facet results queries
```sparql
SELECT *
WHERE {
  {
    # score and literal are used only for Jena full text index
    SELECT DISTINCT ?id ?score ?literal {
      <FILTER>
      VALUES ?facetClass { <FACET_CLASS> }
      ?id <FACET_CLASS_PREDICATE> ?facetClass .
      <ORDER_BY_TRIPLE>
    }
  <ORDER_BY>
  <PAGE>
}
FILTER(BOUND(?id))
<RESULT_SET_PROPERTIES>
}
```
This is the default facet results query. The inner query selects all the ids matching the class of the perspective being queried where all selected filters match. ``<RESULT_SET_PROPERTIES>`` gets replaced by the properties query block referenced
in the `propertiesQueryBlock` of the perspective config. The properties query block should query all the fields that need to be displayed starting from the `?id` which will always be bound. Different properties that can be matched indepentently should be joined using `union` statements.


#### Creating objects
By default, when doing paginated result queries sampo will use a mapper that transforms bound variables like this:
``?name__id``, ``?name__prefLabel`` into objects like this: ``"name": {"id": "value", "prefLabe": "value"}``. 
When defining properties as described [here](./PerspectiveConfig.md#properties) you can use `"valueType": "object"`. 
Using this will make the client display the `prefLabel` value and allow you to use `sortBy` for multiple values within a cell.


---

### Instance queries
```sparql
SELECT * {
  BIND(<ID> as ?id)
  <PROPERTIES>
  <RELATED_INSTANCES>
}
```
The default instance query binds the selected instance's id and then queries your defined properties block for it.

---

### Count queries
```sparql
SELECT (COUNT(DISTINCT ?id) as ?count)
WHERE {
  <FILTER>
  VALUES ?facetClass { <FACET_CLASS> }
  ?id <FACET_CLASS_PREDICATE> ?facetClass .
}
```
The default count query essentially performs a count on the inner query of the facet results query. This means it
correctly counts all the unique IDs that will be queried in the perspective.

---

### Facet values queries
```sparql
SELECT DISTINCT ?id ?prefLabel ?selected ?parent ?instanceCount {
  {
    {
      SELECT DISTINCT (count(DISTINCT ?instance) as ?instanceCount) ?id ?parent ?selected {
        # facet values that return results
        {
          <FILTER>
          ?instance <PREDICATE> ?id .
        <PARENTS>
        VALUES ?facetClass { <FACET_CLASS> }
        ?instance <FACET_CLASS_PREDICATE> ?facetClass .
        <SELECTED_VALUES>
      }
    <SELECTED_VALUES_NO_HITS>
    BIND(COALESCE(?selected_, false) as ?selected)
  }
GROUP BY ?id ?parent ?selected
}
FILTER(BOUND(?id))
<FACET_VALUE_FILTER>
<LABELS>
}
<UNKNOWN_VALUES>
}
<ORDER_BY>
```
The facet values query selects all the facet values that are still available matching the currently selected filters, and also marks which facet values have been selected.

---


### Why overwrite?
There are two common reasons to want to overwrite some of these default queries. 

The first is simply if your particular sparql endpoint has some quirks that do not align well with the default.

The second is if you require significantly more customisation for a complicated perspective.
See securities perspective of [BelHisFirm](https://github.com/GhentCDH/BelHISFirm-Frontend) for an example.
