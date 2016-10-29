import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { AppContainer as HotLoader } from 'react-hot-loader';
import MusicApp from 'app/MusicApp';
import rootReducer from 'app/shared/redux';

render(
  <HotLoader>
    <Provider store={createStore(rootReducer)}>
      <MusicApp />
    </Provider>
  </HotLoader>, document.querySelector('#app'));
