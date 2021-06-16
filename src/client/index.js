import React, { Suspense } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import ReduxToastr from 'react-redux-toastr'
import { Router } from 'react-router-dom'
import history from './History'
import configureStore from './configureStore'
import App from './components/App'
import { availableLocales } from './epics/index.js'
import { loadLocales } from './actions'
import { defaultLocale } from './configs/sampo/GeneralConfig'
import { updateLocaleToPathname } from './helpers/helpers'

import './index.css'
import 'react-sortable-tree/style.css'
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css'
import 'mapbox-gl/dist/mapbox-gl.css'

const store = configureStore()

// init locale
const localeFromUrl = window.location.pathname.substr(1, 2)
let locale
// check if a valid locale was given in url
if (Object.prototype.hasOwnProperty.call(availableLocales, localeFromUrl)) {
  locale = localeFromUrl
} else {
  // support urls without a locale
  locale = defaultLocale
  const { pathname, hash } = window.location
  const newPathname = updateLocaleToPathname({
    pathname,
    locale,
    replaceOld: false
  })
  history.push({
    pathname: newPathname,
    hash
  })
}
store.dispatch(loadLocales(locale))

render(
  <Provider store={store}>
    <div id='app'>
      <Router history={history}>
        <Suspense fallback={<div>Loading...</div>}>
          <App />
        </Suspense>
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
