import React from 'react';
import ReactDOM from 'react-dom';
import IntegrationAutosuggest from '../components/IntegrationAutosuggest';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import { INITIAL_STATE } from '../reducers/search';

describe('IntegrationAutosuggest', () => {
  let updateQuery, fetchSuggestions, clearSuggestions;

  beforeEach(() => {
    updateQuery = jest.fn();
    fetchSuggestions = jest.fn();
    clearSuggestions = jest.fn();
  });

  test('Renders with initial state without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <IntegrationAutosuggest search={INITIAL_STATE} updateQuery={updateQuery}
        fetchSuggestions={fetchSuggestions} clearSuggestions={clearSuggestions} />,
      div
    );
  });

  test('Displays query string', () => {
    const newState = { ...INITIAL_STATE, query: 'kivennapa' };
    const component = renderer.create(
      <IntegrationAutosuggest search={newState} updateQuery={updateQuery}
        fetchSuggestions={fetchSuggestions} clearSuggestions={clearSuggestions} />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Calls updateQuery and fetchSuggestions when user input changes', () => {
    const component = mount(
      <IntegrationAutosuggest search={INITIAL_STATE} updateQuery={updateQuery}
        fetchSuggestions={fetchSuggestions} clearSuggestions={clearSuggestions} />,
    );
    expect(fetchSuggestions.mock.calls.length).toBe(0);
    component.find('input').simulate('change', { target: { value: 'kivennapa' } });
    expect(updateQuery.mock.calls.length).toBe(1);
    expect(updateQuery.mock.calls[0][0]).toEqual('kivennapa');
    expect(fetchSuggestions.mock.calls.length).toBe(1);
  });

});
