import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose, bindActionCreators } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { Provider } from 'react-redux'
import ReduxToastr, { actions as toastrActions } from 'react-redux-toastr'
import { Router } from 'react-router-dom'
import history from './History'
import reducer from './reducers'
import rootEpic from './epics'
import App from './components/App'
import { availableLocales } from './epics/index.js'
import { loadLocales } from './actions'
import { defaultLocale } from './configs/sampo/GeneralConfig'
import { updateLocaleToPathname } from './helpers/helpers'

import './index.css'
import 'react-sortable-tree/style.css'
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css'
import 'mapbox-gl/dist/mapbox-gl.css'

const epicMiddleware = createEpicMiddleware()

const middleware = applyMiddleware(epicMiddleware)

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  reducer,
  compose(
    composeEnhancers(middleware)
  )
)

epicMiddleware.run(rootEpic)

bindActionCreators(toastrActions, store.dispatch)

// init locale
const localeFromUrl = window.location.pathname.substr(1, 2)
let locale
// check if a valid locale was given in url
if (Object.prototype.hasOwnProperty.call(availableLocales, localeFromUrl)) {
  locale = localeFromUrl
} else {
  // support urls without a locale
  locale = defaultLocale
  const newPathname = updateLocaleToPathname({
    pathname: window.location.pathname,
    locale,
    replaceOld: false
  })
  history.push({ pathname: newPathname })
}
store.dispatch(loadLocales(locale))

render(
  <Provider store={store}>
    <div id='app'>
      <Router history={history}>
        <App />
      </Router>
      <ReduxToastr
        timeOut={0}
        newestOnTop={false}
        preventDuplicates
        position='top-center'
        transitionIn='fadeIn'
        transitionOut='fadeOut'
      />
    </div>
  </Provider>,
  document.getElementById('root')
)
