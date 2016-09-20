import React from 'react';
import Router from 'react-router/BrowserRouter';
import Match from 'react-router/Match';

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

let MusicApp = () =>
  <Router>
    <Auth>
      <Layer>
        <Match exactly pattern="/" component={Home} />
        <Match pattern="/groups/:id" component={Group} />
        <Match pattern="/library" component={Library} />

        <VkAudioSync />
        <VkGroupSync />
        <VkDriver />
        <Soundmanager />
        <PlayerSync />
        <KeyboardDriver />
      </Layer>
    </Auth>
  </Router>

export default MusicApp;
