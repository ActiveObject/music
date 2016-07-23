import React from 'react';
import { render } from 'react-dom';
import { AppContainer as HotLoader } from 'react-hot-loader';
import { Provider } from 'react-redux';
import app from 'app';
import AppHost from 'app/AppHost';
import MusicApp from 'app/MusicApp';
import store from 'app/store.prod';

render(
  <HotLoader>
    <Provider store={store}>
      <AppHost value={app}>
        <MusicApp />
      </AppHost>
    </Provider>
  </HotLoader>, document.querySelector('#app'));
