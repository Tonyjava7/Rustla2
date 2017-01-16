import process from 'process';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import reducer from './reducers';
import INITIAL_STATE from './INITIAL_STATE';


const store = createStore(
  reducer,
  INITIAL_STATE,
  compose(
    applyMiddleware(
      thunk,
      createLogger({
        duration: true,
        predicate: () => process.env.NODE_ENV !== 'production',
        actionTransformer: action => ({
          ...action,
          type: String(action.type),
        }),
      }),
    ),
  ),
);

export default store;
