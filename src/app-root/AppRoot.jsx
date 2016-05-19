import React from 'react';
import Router from 'react-router/lib/Router';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';
import browserHistory from 'react-router/lib/browserHistory';

import Authenticated from 'app/auth/Authenticated';
import GroupPage from 'app/group/GroupPage';
import MainPage from 'app/main/MainPage';
import LibraryPage from 'app/library/LibraryPage';

import Layer from 'app/shared/Layer';
import Soundmanager from 'app/shared/soundmanager/Soundmanager';
import VkAudioSync from './VkAudioSync';
import VkGroupSync from './VkGroupSync';
import VkDriver from './VkDriver';
import PlayerSync from './PlayerSync';
import KeyboardDriver from './KeyboardDriver';

import './styles/base.css';
import './styles/theme.css';

let App = ({ children }) =>
  <Authenticated>
    <Layer>
      {children}
      <VkAudioSync />
      <VkGroupSync />
      <VkDriver />
      <Soundmanager />
      <PlayerSync />
      <KeyboardDriver />
    </Layer>
  </Authenticated>

let AppRoot = () =>
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={MainPage} />
      <Route path="groups/:id" component={GroupPage} />
      <Route path="library" component={LibraryPage} />
    </Route>
  </Router>

export default AppRoot;
