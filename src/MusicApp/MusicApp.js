import React from 'react';
import Router from 'react-router/BrowserRouter';
import Match from 'react-router/Match';
import Link from 'react-router/Link';
import { connect } from 'react-redux';
import cx from 'classnames';

import Auth from 'app/Auth';
import Group from 'app/Group';
import PlayBtnCtrl from 'app/shared/PlayBtn/PlayBtnCtrl';
import UserProfile from 'app/shared/UserProfile';
import Soundmanager from 'app/shared/Soundmanager';
import VkAudioSync from './VkAudioSync';
import VkGroupSync from './VkGroupSync';
import VkDriver from './VkDriver';
import PlayerSync from './PlayerSync';
import KeyboardDriver from './KeyboardDriver';
import Player from 'app/shared/PlayerView';
import GroupsListContainer from 'app/Home/GroupsListContainer';
import LibrarySync from 'app/Library/LibrarySync';
import TracklistTable from 'app/shared/tracklist/TracklistTable';
import TracklistPreview from 'app/shared/tracklist/TracklistPreview';
import StaticTracklist from 'app/shared/tracklist/StaticTracklist';
import LazyTracklist from 'app/shared/tracklist/LazyTracklist';
import vk from 'app/shared/vk';

import { authenticate, toggleShuffle, pushLibrary, pushGroups, useTrack } from 'app/redux';

import './styles/base.css';
import './styles/theme.css';
import 'app/shared/ResponsiveGrid.css';
import 'app/Library/Library.css';

let MusicApp = ({
  isAuthenticated,
  userId,
  accessToken,
  activeTrack,
  isPlaying,
  isPlayerEmpty,
  library,
  groups,
  onAuth,
  onToggleShuffle,
  onAudioSync,
  onGroupSync,
  onTrackChange
}) =>
  <Router>
    <Auth isAuthenticated={isAuthenticated} onAuth={onAuth}>
      <div>
        <Match exactly pattern='/' component={UserProfile} />
        <Match pattern='/library' component={UserProfile} />

        <Match exactly pattern='/' render={() =>
          <div className='Home'>
            <section>
              <header>
                <Link to='/library'>Library</Link>
              </header>
              <LibrarySync>
                {tracks =>
                  <TracklistTable>
                    <TracklistPreview isActive={tracks.length === 0} numOfItems={10}>
                      <StaticTracklist tracks={tracks} limit={10} />
                    </TracklistPreview>
                  </TracklistTable>
                }
              </LibrarySync>
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
            <LibrarySync>
              {tracks =>
                <TracklistTable>
                  <LazyTracklist tracks={tracks} />
                </TracklistTable>
              }
            </LibrarySync>
          </div>
        }/>

        <Soundmanager>
          <Player track={activeTrack} isPlaying={isPlaying} />
        </Soundmanager>

        <VkAudioSync userId={userId} onSync={onAudioSync} />
        <VkGroupSync userId={userId} onSync={onGroupSync} />
        <VkDriver vk={vk} userId={userId} accessToken={accessToken} />
        <PlayerSync isPlayerEmpty={isPlayerEmpty} track={activeTrack} onTrackChange={onTrackChange} />
        <KeyboardDriver />
      </div>
    </Auth>
  </Router>

function mapStateToProps(state) {
  return {
    isAuthenticated: state[':app/isAuthenticated'],
    userId: state[':app/userId'],
    accessToken: state[':app/accessToken'],
    library: state[':app/library'],
    groups: state[':app/groups'],
    activeTrack: state[':player/track'],
    isPlaying: state[':player/isPlaying'],
    isPlayerEmpty: state[':player/isEmpty'],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onAuth: (userId, accessToken) => dispatch(authenticate(userId, accessToken)),
    onToggleShuffle: () => dispatch(toggleShuffle()),
    onAudioSync: (library) => dispatch(pushLibrary(library)),
    onGroupSync: (groups) => dispatch(pushGroups(groups)),
    onTrackChange: (track) => dispatch(useTrack(track)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MusicApp);
