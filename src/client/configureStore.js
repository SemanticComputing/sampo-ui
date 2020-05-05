import { createStore, applyMiddleware, compose, bindActionCreators } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { actions as toastrActions } from 'react-redux-toastr'
import reducer from './reducers'
import rootEpic from './epics'

export default function configureStore (preloadedState) {
  const epicMiddleware = createEpicMiddleware()
  const middlewares = [epicMiddleware]

  // https://github.com/zalmoxisus/redux-devtools-extension#11-basic-store
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  const composedEnhancers = composeEnhancers(
    applyMiddleware(...middlewares)
    // other store enhancers could be added here
  )

  const store = createStore(reducer, preloadedState, composedEnhancers)

  epicMiddleware.run(rootEpic)

  bindActionCreators(toastrActions, store.dispatch)

  return store
}
