import React from 'react'
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
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { faMinus, faPlus, faExpand } from '@fortawesome/free-solid-svg-icons'

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
  const newPathname = updateLocaleToPathname({
    pathname: window.location.pathname,
    locale,
    replaceOld: false
  })
  history.push({ pathname: newPathname })
}
store.dispatch(loadLocales(locale))

// https://www.pullrequest.com/blog/webpack-fontawesome-guide/
library.add(faMinus, faPlus, faExpand)
dom.watch()

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
