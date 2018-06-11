import { updateSuggestions } from '../reducers/suggestions';

describe('suggestions', () => {

  describe('updateSuggestions', () => {

    test('Adds short titles', () => {

      const results = [
        {
          'label': 'Viipuri',
          'datasets': [
            {
              datasetId: 'warsa_karelian_places',
              count: {
                type:	'literal',
                datatype:	'http://www.w3.org/2001/XMLSchema#integer',
                value:	'1'
              }
            },
            {
              datasetId: 'warsa_municipalities',
              count: {
                type:	'literal',
                datatype:	'http://www.w3.org/2001/XMLSchema#integer',
                value:	'1'
              }
            },
          ],
        },
        {
          'label': 'Viipurinlahti',
          'datasets': [
            {
              datasetId: 'warsa_karelian_places',
              count: {
                type:	'literal',
                datatype:	'http://www.w3.org/2001/XMLSchema#integer',
                value:	'2'
              }
            },
          ],
        },
      ];

      const expected =  [
        {
          'label': 'Viipuri',
          'datasets': [
            {
              datasetId: 'warsa_karelian_places',
              shortTitle: 'wkp',
              count: {
                type:	'literal',
                datatype:	'http://www.w3.org/2001/XMLSchema#integer',
                value:	'1'
              }
            },
            {
              datasetId: 'warsa_municipalities',
              shortTitle: 'wm',
              count: {
                type:	'literal',
                datatype:	'http://www.w3.org/2001/XMLSchema#integer',
                value:	'1'
              }
            },
          ],
        },
        {
          'label': 'Viipurinlahti',
          'datasets': [
            {
              datasetId: 'warsa_karelian_places',
              shortTitle: 'wkp',
              count: {
                type:	'literal',
                datatype:	'http://www.w3.org/2001/XMLSchema#integer',
                value:	'2'
              }
            },
          ],
        },
      ];

      expect(updateSuggestions({ results })).toEqual(expected);

    });

  });

});
