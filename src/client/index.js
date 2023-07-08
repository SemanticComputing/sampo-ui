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
import { updateLocaleToPathname } from './helpers/helpers'
import CircularProgress from '@mui/material/CircularProgress'
import './index.css'
import '@nosferatu500/react-sortable-tree/style.css'
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import portalConfig from '../configs/portalConfig.json'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

const { localeConfig, layoutConfig } = portalConfig
const store = configureStore()

// init locale
let locale
const localeFromUrl = window.location.pathname.substr(1, 2)
// check if a valid locale was given in url
if (Object.prototype.hasOwnProperty.call(availableLocales, localeFromUrl)) {
  locale = localeFromUrl
} else {
  // support urls without a locale
  locale = localeConfig.defaultLocale
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
    <Router history={history}>
      <Suspense
        fallback={
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          >
            <CircularProgress
              sx={{
                color: layoutConfig.colorPalette.primary.main
              }}
              thickness={5}
            />
          </div>
          }
      >
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
  </Provider>,
  document.getElementById('root')
)
