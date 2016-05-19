import React from 'react';
import Router from 'react-router/lib/Router';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';
import browserHistory from 'react-router/lib/browserHistory';

import Auth from 'app/Auth';
import Group from 'app/Group';
import Home from 'app/Home';
import Library from 'app/Library';

import Layer from 'app/shared/Layer';
import Soundmanager from 'app/shared/soundmanager/Soundmanager';
import VkAudioSync from './VkAudioSync';
import VkGroupSync from './VkGroupSync';
import VkDriver from './VkDriver';
import PlayerSync from './PlayerSync';
import KeyboardDriver from './KeyboardDriver';

import './styles/base.css';
import './styles/theme.css';

let AppContainer = ({ children }) =>
  <Auth>
    <Layer>
      {children}
      <VkAudioSync />
      <VkGroupSync />
      <VkDriver />
      <Soundmanager />
      <PlayerSync />
      <KeyboardDriver />
    </Layer>
  </Auth>

let AppRoot = () =>
  <Router history={browserHistory}>
    <Route path="/" component={AppContainer}>
      <IndexRoute component={Home} />
      <Route path="groups/:id" component={Group} />
      <Route path="library" component={Library} />
    </Route>
  </Router>

export default AppRoot;
