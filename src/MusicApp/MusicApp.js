import React from 'react';
import Router from 'react-router/BrowserRouter';
import Match from 'react-router/Match';
import Link from 'react-router/Link';
import { connect } from 'react-redux';
import cx from 'classnames';

import vk from 'app/shared/vk';
import Shortcut from 'app/shared/Shortcut';

import {
  authenticate,
  toggleShuffle,
  pushLibrary,
  pushGroups,
  useTrack,
  togglePlay,
  rewind,
  forward
} from 'app/shared/redux';

import Auth from './Auth';
import Group from './Group';
import PlayBtnCtrl from './PlayBtn/PlayBtnCtrl';
import UserProfile from './UserProfile';
import Soundmanager from './Soundmanager';
import VkAudioSync from './VkAudioSync';
import VkGroupSync from './VkGroupSync';
import VkDriver from './VkDriver';
import PlayerSync from './PlayerSync';
import Player from './PlayerView';
import GroupsListContainer from './GroupsListContainer';
import LibrarySync from './LibrarySync';
import TracklistTable from './tracklist/TracklistTable';
import TracklistPreview from './tracklist/TracklistPreview';
import LazyTracklist from './tracklist/LazyTracklist';
import TrackCtrl from './tracklist/TrackCtrl';

import './styles/base.css';
import './styles/theme.css';
import './styles/Library.css';
import './styles/ResponsiveGrid.css';

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
  onTrackChange,
  onTogglePlay,
  onRewind,
  onForward
}) =>
  <Router>
    <Auth isAuthenticated={isAuthenticated} onAuth={onAuth}>
      <div>
        <Match exactly pattern='/' render={() =>
          <UserProfile userId={userId} />
        }/>

        <Match pattern='/library' render={() =>
          <UserProfile userId={userId} />
        }/>

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
                      <div>
                        {tracks.slice(0, 10).map(t => <TrackCtrl key={t.id} track={t} tracklist={tracks} />)}
                      </div>
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

        <VkAudioSync vk={vk} userId={userId} onSync={onAudioSync} interval={10} />
        <VkGroupSync vk={vk} userId={userId} onSync={onGroupSync} interval={60} />
        <VkDriver vk={vk} userId={userId} accessToken={accessToken} />
        <PlayerSync isPlayerEmpty={isPlayerEmpty} track={activeTrack} onTrackChange={onTrackChange} />

        <Shortcut bindTo='space' onKeyDown={onTogglePlay} preventDefault={true} />
        <Shortcut bindTo='left' onKeyDown={onRewind} />
        <Shortcut bindTo='right' onKeyDown={onForward} />
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
    onTogglePlay: () => {
      console.log(`[MusicApp] toggle play`);
      dispatch(togglePlay());
    },

    onRewind: () => {
      console.log(`[MusicApp] rewind 5s`);
      dispatch(rewind(5000));
    },

    onForward: () => {
      console.log(`[MusicApp] forward 5s`);
      dispatch(forward(5000));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MusicApp);
