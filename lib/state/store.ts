import { legacy_createStore as createStore, applyMiddleware, combineReducers, Reducer, AnyAction } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from '@redux-devtools/extension';
import gridReducer from './grid-dux';

// Root saga will be added when we create sagas
function* rootSaga() {
  // Placeholder - sagas will be added here
}

// Root reducer - combines all dux reducers
const rootReducer: Reducer = combineReducers({
  grid: gridReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Create store with middleware
export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);

// Run root saga
sagaMiddleware.run(rootSaga);
