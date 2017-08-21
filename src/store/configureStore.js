// @flow

import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { createLogger } from 'redux-logger';
import createSagaMiddleware, { END } from 'redux-saga';

import rootReducer from '../reducers';

export default function configureStore(initialState: {}) {
  const sagaMiddleware = createSagaMiddleware();
  const middlewareList = [sagaMiddleware];

  // TODO: use local storage to store dev/prod env
  const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
  if (IS_DEVELOPMENT) {
    middlewareList.push(createLogger());
  }
  const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(
      applyMiddleware(...middlewareList)
    )
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      store.replaceReducer(rootReducer);
    });
  }
  store.runSaga = sagaMiddleware.run;
  store.close = () => store.dispatch(END);
  return store;
}
