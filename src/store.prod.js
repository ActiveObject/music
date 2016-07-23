import { createStore } from 'redux';
import reducers from 'app/reducers';
import { createPlayer } from 'app/shared/Player';

export default createStore(reducers, createPlayer());
