import React from 'react';
import { render } from 'react-dom';
import { AppContainer as HotLoader } from 'react-hot-loader';
import app from 'app';
import AppHost from 'app/AppHost';
import MusicApp from 'app/MusicApp';

render(
  <HotLoader>
    <AppHost value={app}>
      <MusicApp />
    </AppHost>
  </HotLoader>, document.querySelector('#app'));
