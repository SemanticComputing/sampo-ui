import React, { Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import ReduxToastr from 'react-redux-toastr'
import { Router } from 'react-router-dom'
import history from './History'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import './index.css'
import '@nosferatu500/react-sortable-tree/style.css'
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { useConfigsStore } from './stores/configsStore'

const root = createRoot(document.getElementById('root'))

const FullscreenCentered = ({ children }) => (
  <div style={{
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20
  }}
  >
    {children}
  </div>
)

const renderLoading = () => {
  root.render(
    <FullscreenCentered>
      <CircularProgress sx={{ color: 'black' }} thickness={5} />
    </FullscreenCentered>
  )
}

const renderError = (error) => {
  root.render(
    <FullscreenCentered>
      <Alert severity='error'>Failed to load config: {error.message}</Alert>
    </FullscreenCentered>
  )
}

const renderApp = async () => {
  const App = lazy(() => import('./components/App'))
  const [
    { default: configureStore },
    { availableLocales },
    { loadLocales },
    { updateLocaleToPathname }
  ] = await Promise.all([
    import('./configureStore'),
    import('./epics'),
    import('./actions'),
    import('./helpers/helpers')
  ])
  const portalConfig = useConfigsStore.getState().portalConfig
  const { localeConfig, layoutConfig } = portalConfig
  const store = configureStore()

  let locale
  const localeFromUrl = window.location.pathname.substr(1, 2)
  if (Object.prototype.hasOwnProperty.call(availableLocales, localeFromUrl)) {
    locale = localeFromUrl
  } else {
    locale = localeConfig.defaultLocale
    const { pathname, hash } = window.location
    const newPathname = updateLocaleToPathname({ pathname, locale, replaceOld: false })
    history.push({ pathname: newPathname, hash })
  }
  store.dispatch(loadLocales(locale))

  root.render(
    <Provider store={store}>
      <Router history={history}>
        <Suspense fallback={
          <FullscreenCentered>
            <CircularProgress sx={{ color: layoutConfig.colorPalette.primary.main }} thickness={5} />
          </FullscreenCentered>
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
    </Provider>
  )
}

;(async () => {
  try {
    renderLoading()
    await useConfigsStore.getState().initConfigs()
    await renderApp()
  } catch (error) {
    console.error('Caught error in index.js:', error)
    renderError(error)
  }
})()
