import { getLangValue, updateSuggestions } from '../reducers/suggestions';

describe('suggestions', () => {

  describe('updateSuggestions', () => {

    test('Adds preferred labels', () => {

      const results = [
        {
          'dataset': 'Karelian map names',
          'results': []
        },
        {
          'dataset': 'Finnish municipalities',
          'results': [{
            'uri': 'http://ldf.fi/warsa/places/municipalities/m_place_124',
            'label': [
              {
                'type': 'literal',
                'xml:lang': 'fi',
                'value': 'Kivijärvi'
              }
            ],
            'typeLabel': [
              {
                'type': 'literal',
                'xml:lang': 'fi',
                'value': 'Kunta'
              },
              {
                'type': 'literal',
                'xml:lang': 'en',
                'value': 'Municipality'
              }
            ],
            'broaderAreaLabel': [
              {
                'type': 'literal',
                'xml:lang': 'fi',
                'value': 'Vaasan lääni'
              }
            ]
          }]
        }
      ];

      const expected =  [
        {
          'dataset': 'Karelian map names',
          'results': []
        },
        {
          'dataset': 'Finnish municipalities',
          'results': [{
            ...results[1].results[0],
            'preferredLabel': {
              'type': 'literal',
              'xml:lang': 'fi',
              'value': 'Kivijärvi'
            },
            'preferredTypeLabel': {
              'type': 'literal',
              'xml:lang': 'fi',
              'value': 'Kunta'
            },
            'preferredBroaderAreaLabel':
              {
                'type': 'literal',
                'xml:lang': 'fi',
                'value': 'Vaasan lääni'
              }
          }]
        }
      ];

      expect(updateSuggestions({ language: 'fi', results })).toEqual(expected);

    });

  });

  describe('getLangValue', () => {

    let valueList;

    beforeEach(() => {
      valueList = [
        {
          'type': 'literal',
          'xml:lang': 'fi',
          'value': 'Kunta'
        },
        {
          'type': 'literal',
          'xml:lang': 'en',
          'value': 'Municipality'
        },
        {
          'type': 'literal',
          'value': 'Province'
        }
      ];
    });

    test('Chooses an object based on language tag', () => {

      const expectedEn = valueList[1];
      const expectedFi = valueList[0];
      expect(getLangValue('en', valueList)).toEqual(expectedEn);
      expect(getLangValue('fi', valueList)).toEqual(expectedFi);

    });

    test('Chooses the first object if the language tag is not found', () => {

      const expected = valueList[0];
      expect(getLangValue('sv', valueList)).toEqual(expected);

    });


  });
});
