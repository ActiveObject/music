import React from 'react';
import Router from 'react-router/BrowserRouter';
import Match from 'react-router/Match';
import Link from 'react-router/Link';
import { connect } from 'react-redux';
import cx from 'classnames';

import Auth from 'app/Auth';
import Group from 'app/Group';
import PlayBtnCtrl from 'app/shared/PlayBtn/PlayBtnCtrl';
import UserProfileCtrl from 'app/shared/UserProfile/UserProfileCtrl';
import Soundmanager from 'app/shared/Soundmanager';
import VkAudioSync from './VkAudioSync';
import VkGroupSync from './VkGroupSync';
import VkDriver from './VkDriver';
import PlayerSync from './PlayerSync';
import KeyboardDriver from './KeyboardDriver';
import Player from 'app/shared/PlayerView';
import GroupsListContainer from 'app/Home/GroupsListContainer';
import FetchLibrary from 'app/Home/FetchLibrary';
import TracklistTable from 'app/shared/tracklist/TracklistTable';
import TracklistPreview from 'app/shared/tracklist/TracklistPreview';
import StaticTracklist from 'app/shared/tracklist/StaticTracklist';
import LazyTracklist from 'app/shared/tracklist/LazyTracklist';

import { authenticate, toggleShuffle } from 'app/redux';

import './styles/base.css';
import './styles/theme.css';
import 'app/shared/ResponsiveGrid.css';
import 'app/Library/Library.css';

let MusicApp = ({
  isAuthenticated,
  activeTrack,
  isPlaying,
  library,
  groups,
  onAuth,
  onToggleShuffle
}) =>
  <Router>
    <Auth isAuthenticated={isAuthenticated} onAuth={onAuth}>
      <div>
        <Match exactly pattern='/' component={UserProfileCtrl} />
        <Match pattern='/library' component={UserProfileCtrl} />

        <Match exactly pattern='/' render={() =>
          <div className='Home'>
            <section>
              <header>
                <Link to='/library'>Library</Link>
              </header>
              <FetchLibrary library={library}>
                {tracks =>
                  <TracklistTable>
                    <TracklistPreview isActive={tracks.length === 0} numOfItems={10}>
                      <StaticTracklist tracks={tracks} limit={10} />
                    </TracklistPreview>
                  </TracklistTable>
                }
              </FetchLibrary>
            </section>

            <section className='page-section'>
              <header>Groups</header>
              <GroupsListContainer groups={groups}>
                {groups => groups.map(id => <Group key={id} id={id} shape='list-item' />)}
              </GroupsListContainer>
            </section>
          </div>
        }/>

        <Match pattern='/groups/:id' render={({ params }) => <Group id={params.id} />}/>

        <Match pattern='/library' render={() =>
          <div className='Library'>
            <div className='toolbar-container'>
              <div className='toolbar'>
                <span
                  className={cx({ 'action': true, 'action--active': false })}
                  onClick={onToggleShuffle}>shuffle</span>
              </div>
            </div>
            <FetchLibrary library={library}>
              {tracks =>
                <TracklistTable>
                  <LazyTracklist tracks={tracks} />
                </TracklistTable>
              }
            </FetchLibrary>
          </div>
        }/>

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
    library: state[':app/library'],
    groups: state[':app/groups'],
    activeTrack: state[':player/track'],
    isPlaying: state[':player/isPlaying'],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onAuth: (userId, accessToken) => dispatch(authenticate(userId, accessToken)),
    onToggleShuffle: () => dispatch(toggleShuffle())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MusicApp);
