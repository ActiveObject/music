import app from 'app';
import { hasTag } from 'app/Tag';
import GroupProfile from 'app/group-profile/GroupProfile';
import GroupTop5Tracks from 'app/GroupTop5Tracks';
import PlayBtnCtrl from 'app/play-btn/PlayBtnCtrl';
import Authenticated from 'app/auth/Authenticated';
import Layer from 'app/Layer';
import VkAudioSync from 'app/VkAudioSync';
import VkDriver from 'app/VkDriver';
import Soundmanager from 'app/soundmanager/Soundmanager';
import PlayerSync from 'app/PlayerSync';
import KeyboardDriver from 'app/KeyboardDriver';
import GroupActivity from 'app/GroupActivity';
import Player from 'app/player/Player';
import { Section, Header, Content } from 'app/ResponsiveGrid';
import ProfileCtrl from 'app/user-profile/ProfileCtrl';
import LibraryStaticTracklist from 'app/library/LibraryStaticTracklist';
import GroupsListContainer from 'app/GroupsListContainer';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';

import 'app/styles/base.css';
import 'app/styles/theme.css';

var group = {
  id: 32211876,
  is_admin: 0,
  is_closed: 0,
  is_member: 1,
  name: "Vocal Dubstep 2016",
  photo_50: "http://cs630625.vk.me/v630625412/bd50/BiqXo4UZ9qs.jpg",
  photo_100: "http://cs630625.vk.me/v630625412/bd4f/DXBBQBYE260.jpg",
  photo_200: "http://cs630625.vk.me/v630625412/bd4e/63vhFTQvwYA.jpg",
  screen_name: "dubstep_vocal",
  type: "page"
};

var GroupPage = () =>
  <div className='group-page'>
    <div className='scroll-container'>
      <Section>
        <Content>
          <GroupProfile group={group} />
          <GroupActivity groupId={group.id} />
        </Content>
      </Section>

      <Section className='group-page__content'>
        <Content>
          <Header>Week top</Header>
          <GroupTop5Tracks group={group.screen_name} />
        </Content>
      </Section>
    </div>

    <div className='main-layout__play-btn'>
      <PlayBtnCtrl />
    </div>
  </div>

var MainPage = () =>
  <div className='main-page'>
    <div className='scroll-container'>
      <Section>
        <ProfileCtrl />
      </Section>

      <Section>
        <Content>
          <Header>Library</Header>
          <LibraryStaticTracklist />
        </Content>
      </Section>

      <Section className='page-section'>
        <Content>
          <Header>Groups</Header>
          <GroupsListContainer ids={['32211876', '1489880', '43426041', '10830340', '26578488']} />
        </Content>
      </Section>
    </div>

    <PlayBtnCtrl />
  </div>

var AppRootView = ({ children }) =>
  <Authenticated>
    <Layer>
      {children}
      <VkAudioSync />
      <VkDriver />
      <Soundmanager />
      <PlayerSync />
      <KeyboardDriver />
    </Layer>
  </Authenticated>

let Root = () =>
  <Router history={hashHistory}>
    <Route path="/" component={AppRootView}>
      <IndexRoute component={MainPage} />
      <Route path="groups" component={GroupPage} />
    </Route>
  </Router>


export default Root;
