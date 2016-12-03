import React from 'react';
import { render } from 'react-dom';
import { AppContainer as HotLoader } from 'react-hot-loader';
import MusicApp from 'app/MusicApp';

render(
  <HotLoader>
    <MusicApp />
  </HotLoader>, document.querySelector('#app'));
