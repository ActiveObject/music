import React from 'react';
import Router from 'react-router/BrowserRouter';
import Match from 'react-router/Match';
import { connect } from 'react-redux';

import Auth from 'app/Auth';
import Group from 'app/Group';
import Home from 'app/Home';
import Library from 'app/Library';

import PlayBtnCtrl from 'app/shared/PlayBtn/PlayBtnCtrl';
import UserProfileCtrl from 'app/shared/UserProfile/UserProfileCtrl';

import Soundmanager from 'app/shared/Soundmanager';
import VkAudioSync from './VkAudioSync';
import VkGroupSync from './VkGroupSync';
import VkDriver from './VkDriver';
import PlayerSync from './PlayerSync';
import KeyboardDriver from './KeyboardDriver';
import Player from 'app/shared/PlayerView';

import { authenticate } from 'app/redux';

import './styles/base.css';
import './styles/theme.css';

let MusicApp = ({ isAuthenticated, activeTrack, isPlaying, onAuth }) =>
  <Router>
    <Auth isAuthenticated={isAuthenticated} onAuth={onAuth}>
      <div>
        <Match exactly pattern='/' component={UserProfileCtrl} />
        <Match pattern='/library' component={UserProfileCtrl} />

        <Match exactly pattern='/' component={Home} />
        <Match pattern='/groups/:id' render={({ params }) => <Group id={params.id} />}/>
        <Match pattern='/library' component={Library} />

        <Soundmanager>
          <Player track={activeTrack} isPlaying={isPlaying} />
        </Soundmanager>

        <VkAudioSync />
        <VkGroupSync />
        <VkDriver />
        <PlayerSync />
        <KeyboardDriver />
      </div>
    </Auth>
  </Router>

function mapStateToProps(state) {
  return {
    isAuthenticated: state[':app/isAuthenticated'],
    activeTrack: state[':player/track'],
    isPlaying: state[':player/isPlaying']
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onAuth: (userId, accessToken) => dispatch(authenticate(userId, accessToken))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MusicApp);
