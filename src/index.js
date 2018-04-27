import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { Provider } from 'react-redux';
import reducer from './reducers';
import rootEpic from './epics';
import ReduxToastr from 'react-redux-toastr';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import { bindActionCreators } from 'redux';
import {actions as toastrActions} from 'react-redux-toastr';

import App from './components/App';

const store = createStore(
  reducer,
  // applyMiddleware() tells createStore() how to handle middleware
  applyMiddleware(createEpicMiddleware(rootEpic))
);

bindActionCreators(toastrActions, store.dispatch);

render(
  <Provider store={store}>
    <div>
      <App />
      <ReduxToastr
        timeOut={4000}
        newestOnTop={false}
        preventDuplicates
        position="top-center"
        transitionIn="fadeIn"
        transitionOut="fadeOut"
        progressBar
      />
    </div>
  </Provider>,
  document.getElementById('root')
);
