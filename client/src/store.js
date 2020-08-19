import { createStore, applyMiddleware, compose } from 'redux';
import mainReducer from './reducers/index';
import thunk from 'redux-thunk';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(mainReducer, composeEnhancers(
    applyMiddleware(thunk)))


export default store;