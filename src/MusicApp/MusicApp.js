import React, { Component } from 'react';
import Router from 'react-router/BrowserRouter';
import Match from 'react-router/Match';
import Link from 'react-router/Link';
import cx from 'classnames';
import { Map } from 'immutable';

import Shortcut from 'app/shared/Shortcut';
import {
  useTrack,
  togglePlay,
  rewind,
  forward,
  prevTrack,
  nextTrack,
  volumeUp,
  volumeDown
} from 'app/effects';
import { Effect } from 'app/shared/effects';

import Auth from './Auth';
import Group from './Group';
import UserProfile from './UserProfile';
import AudioDriver from './AudioDriver';
import VkAudioSync from './VkAudioSync';
import VkGroupSync from './VkGroupSync';
import VkDriver from './VkDriver';
import PlaylistDriver from './PlaylistDriver';
import PlayerSync from './PlayerSync';
import Player from './Player';
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

class MusicApp extends Component {
  state = {
    library: [],
    groups: [],
    albums: Map()
  }

  onAudioSync = library => this.setState({ library })
  onGroupSync = groups => this.setState({ groups })

  render() {
    var { library, groups, albums } = this.state;

    return (
      <Auth appId={process.env.MUSIC_APP_ID} apiVersion='5.29'>
        {({ userId, accessToken }) =>
          <VkDriver userId={userId} accessToken={accessToken} apiVersion='5.29'>
            <PlaylistDriver playlist={library}>
              {({ track, playlist }) =>
                <AudioDriver track={track}>
                  {({ audio }) =>
                    <Router>
                    <div>
                      <Match exactly pattern='/' render={() => <UserProfile userId={userId} /> } />
                      <Match pattern='/library' render={() => <UserProfile userId={userId} /> } />
                      <Match pattern='/groups/:id' render={({ params }) => <Group id={params.id} audio={audio} currentTrack={track} />}/>

                      <Match exactly pattern='/' render={() =>
                        <div className='Home'>
                          <section>
                            <header>
                              <Link to='/library'>Library</Link>
                            </header>
                            <LibrarySync userId={userId} library={library} albums={albums}>
                              {tracks =>
                                <TracklistTable>
                                  <TracklistPreview isActive={tracks.length === 0} numOfItems={10}>
                                    <div>
                                      {tracks.slice(0, 10).map(t => <TrackCtrl audio={audio} key={t.id} track={t} currentTrack={track} tracklist={tracks} />)}
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

                      <Match pattern='/library' render={() =>
                          <div className='Library'>
                            <LibrarySync userId={userId} library={library} albums={albums}>
                              {tracks =>
                                <TracklistTable>
                                  <LazyTracklist tracks={tracks} audio={audio} currentTrack={track} />
                                </TracklistTable>
                              }
                            </LibrarySync>
                          </div>
                        } />

                        {track && <Player audio={audio} track={track} playlist={playlist} />}

                        <VkAudioSync userId={userId} onSync={this.onAudioSync} interval={10} />
                        <VkGroupSync userId={userId} onSync={this.onGroupSync} interval={60} />

                        <Effect children={run => <Shortcut bindTo='left' onKeyDown={() => run(rewind(5000))} />} />
                        <Effect children={run => <Shortcut bindTo='right' onKeyDown={() => run(forward(5000))} />} />
                        <Effect children={run => <Shortcut bindTo='space' onKeyDown={() => run(togglePlay())} preventDefault />} />
                        <Effect children={run => <Shortcut bindTo='shift+left' onKeyDown={() => run(prevTrack())} />} />
                        <Effect children={run => <Shortcut bindTo='shift+right' onKeyDown={() => run(nextTrack())} />} />
                        <Effect children={run => <Shortcut bindTo='shift+up' onKeyDown={() => run(volumeUp())} />} />
                        <Effect children={run => <Shortcut bindTo='shift+down' onKeyDown={() => run(volumeDown())} />} />
                      </div>
                    </Router>
                  }
                </AudioDriver>
              }
            </PlaylistDriver>
          </VkDriver>
        }
      </Auth>
    )
  }
}

export default MusicApp;
