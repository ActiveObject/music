import React from 'react';
import { render } from 'react-dom';
import { AppContainer as HotLoader } from 'react-hot-loader';
import { Provider } from 'react-redux';
import MusicApp from 'app/MusicApp';
import store from 'app/store.prod';

render(
  <HotLoader>
    <Provider store={store}>
      <MusicApp />
    </Provider>
  </HotLoader>, document.querySelector('#app'));
