import { eventsByTimePeriodQuery, eventsByTimePeriodQuery2 } from './SparqlQueriesEvents';

export const generateEventsByPeriodQuery =  ({
  startYear,
  endYear,
  periodLength
}) => {
  const timePeriodTemplate = `
    {
      ?event crm:P4_has_time-span ?timespan .
      ?event a ?type__id .
      ?type__id skos:prefLabel|rdfs:label ?type__prefLabel .
      ?timespan crm:P82a_begin_of_the_begin ?begin .
      ?timespan crm:P82b_end_of_the_end ?end .
      BIND(<PERIOD_LABEL> as ?id)
      # both start and end within the decade
      FILTER(?begin >= "<PERIOD_BEGIN>"^^xsd:date)
      FILTER(?end <= "<PERIOD_END>"^^xsd:date)
    }
  `;
  const timePeriodTemplate2 = `
    {
      SELECT ?id ?prefLabel ?period
      (COUNT(DISTINCT ?event) as ?instanceCount) {
        ?event crm:P4_has_time-span ?timespan .
        ?event a ?id .
        ?id skos:prefLabel|rdfs:label ?prefLabel .
        ?timespan crm:P82a_begin_of_the_begin ?begin .
        ?timespan crm:P82b_end_of_the_end ?end .
        BIND(<PERIOD_LABEL> as ?period)
        # both start and end within the decade
        FILTER(?begin >= "<PERIOD_BEGIN>"^^xsd:date)
        FILTER(?end <= "<PERIOD_END>"^^xsd:date)
      }
      GROUP BY ?id ?prefLabel ?period
    }
  `;
  let timePeriods = ``;
  for (let year = startYear; year < endYear; year += periodLength) {
    let timePeriod = timePeriodTemplate.replace('<PERIOD_LABEL>', parseInt(year));
    timePeriod = timePeriod.replace('<PERIOD_BEGIN>', `${year}-01-01`);
    timePeriod = timePeriod.replace('<PERIOD_END>', `${year + periodLength - 1}-12-31`);
    timePeriods += timePeriod;
    if (year + periodLength < endYear) {
      timePeriods += '  UNION';
    }
  }
  return eventsByTimePeriodQuery.replace('<TIME_PERIODS>', timePeriods);
};
