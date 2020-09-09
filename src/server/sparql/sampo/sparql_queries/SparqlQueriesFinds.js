const perspectiveID = 'finds'

export const findPropertiesInstancePage =
`   {
      ?id skos:prefLabel ?prefLabel__id .
      BIND(?prefLabel__id as ?prefLabel__prefLabel)
      BIND(?id as ?uri__id)
      BIND(?id as ?uri__dataProviderUrl)
      BIND(?id as ?uri__prefLabel)
    }
    UNION
    {
      ?id :type ?type .
    }
    UNION
    {
      ?id :sub_category ?subCategory .
    }
    UNION
    {
      ?id :material_literal ?materialLiteral .
    }
    UNION
    {
      ?id :material ?material__id .
      ?material__id skos:prefLabel ?material__prefLabel .
    }
    UNION
    {
      ?id :period ?period .
    }
    UNION
    {
      ?id :municipality_literal ?municipalityLiteral .
    }
    UNION
    {
      ?id :municipality ?municipality__id .
      ?municipality__id skos:prefLabel ?municipality__prefLabel .
    }
    UNION
    {
      ?id :image_url ?image__id .
      ?id :find_name ?image__title .
      BIND(?image__id as ?image__url)
      BIND(CONCAT("Sample description text for image ", ?image__id) as ?image__description) 
    }
`

export const findPropertiesFacetResults =
`   {
      ?id skos:prefLabel ?prefLabel__id .
      BIND (?prefLabel__id as ?prefLabel__prefLabel)
      BIND(CONCAT("/${perspectiveID}/page/", REPLACE(STR(?id), "^.*\\\\/(.+)", "$1")) AS ?prefLabel__dataProviderUrl)
    }
    UNION
    {
      ?id :specification ?specification .
    }
    UNION
    {
      ?id :type ?type .
    }
    UNION
    {
      ?id :sub_category ?subCategory .
    }
    UNION
    {
      ?id :object_type ?objectType__id.
      ?objectType__id skos:prefLabel ?objectType__prefLabel .
    }
    UNION
    {
      ?id :material_literal ?materialLiteral .
    }
    UNION
    {
      ?id :material ?material__id .
      ?material__id skos:prefLabel ?material__prefLabel .
    }
    UNION
    {
      ?id :period ?period .
    }
    UNION
    {
      ?id :start_year ?startYearLiteral .
    }
    UNION
    {
      ?id :end_year ?endYearLiteral .
    }
    UNION
    {
      ?id :municipality_literal ?municipalityLiteral .
    }
    UNION
    {
      ?id :municipality ?municipality__id .
      ?municipality__id skos:prefLabel ?municipality__prefLabel .
    }
    UNION
    {
      ?id :province_literal ?provinceLiteral .
    }
    UNION
    {
      ?id :province ?province__id .
      ?province__id skos:prefLabel ?province__prefLabel .
    }
    UNION
    {
      ?id crm:P4_has_time_span/crm:P82a_begin_of_the_begin ?earliestStart .
      BIND (YEAR(?earliestStart) as ?startYear) .
    }
    UNION
    {
      ?id crm:P4_has_time_span/crm:P82b_end_of_the_end ?latestEnd .
      BIND (YEAR(?latestEnd) as ?endYear) .
    }
    UNION
    {
      ?id :image_url ?image__id .
      ?id :find_name ?image__title .
      BIND(?image__id as ?image__url)
      BIND(CONCAT("Sample description text for image ", ?image__id) as ?image__description) 
    }
  `

export const findsPlacesQuery = `
  SELECT ?id ?lat ?long
  WHERE {
    <FILTER>
    ?id wgs84:lat ?lat ;
        wgs84:long ?long .
  }
`

export const findsTimelineQuery = `
  SELECT ?id ?group ?data__id ?data__uri ?data__label
  ?data__data__id ?data__data__label ?data__data__val ?data__data__timeRange
  WHERE {

    <FILTER> # a placeholder for facet filters

    ?find :material/skos:prefLabel ?id  . # ?id = first hierarchy level
    BIND (?id as ?group)
    #?find :find_name ?data__id . # ?data__id = second hierarchy level

     ?find :find_name ?lable_temp .
    BIND( STRAFTER(STR(?find),'http://ldf.fi/findsampo/finds/' ) AS ?find_num ).
    BIND (CONCAT(str(?lable_temp), str(?find_num)) as ?data__id) .
    BIND (?data__id as ?data__label)
    BIND (?find_num as ?data__data__id) # ?data__data__id = third hierarchy level
    BIND (?data__id as ?data__data__label)
    BIND (?data__id as ?data__data__val)

    # make sure that the selected finds have both 'start_year' and 'end_year'
    #?find :start_year [] .
    #?find :end_year [] .
    ?find crm:P4_has_time_span/crm:P82a_begin_of_the_begin [] .
    ?find crm:P4_has_time_span/crm:P82b_end_of_the_end [] .

    # Combine 'start_year' and 'end_year' into same variable,
    # so that the result mapper creates an array from these.
    #?find :start_year|:end_year ?data__data__timeRange .

    #?find crm:P4_has_time_span/crm:P82a_begin_of_the_begin|crm:P4_has_time_span/crm:P82b_end_of_the_end ?date .
    #BIND(CONCAT(str(?date), 'T00:00:00+00:00') AS ?date_wth_ending) .
    #BIND(STRDT(STR(?date_wth_ending), xsd:dateTime) AS ?data__data__timeRange)

    ?find crm:P4_has_time_span/crm:P82a_begin_of_the_begin|crm:P4_has_time_span/crm:P82b_end_of_the_end ?date .

    # Ignore missing values in the first hierarchy level
    FILTER (?id != "-")

    # fill two extra digits with zeros for BCE dates
    BIND (STRAFTER(str(?date), '-') AS ?after)
    BIND (IF (STRSTARTS(str(?date), '-'), CONCAT('-00', ?after), str(?date)) AS ?new_date) .
    BIND(STRDT(STR(?new_date), xsd:dateTime) AS ?data__data__timeRange) .
  }
`
