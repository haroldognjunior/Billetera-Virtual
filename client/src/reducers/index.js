import { combineReducers } from 'redux';
import usuario from './userReducers'

const mainReducer = combineReducers({
    usuario,

});

export default mainReducer;