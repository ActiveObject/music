import React from 'react';
import cx from 'classnames';
import app from 'app';
import { updateOn } from 'app/renderer';
import vk from 'app/vk';
import { hasTag } from 'app/Tag';
import GroupProfile from 'app/group/GroupProfile';
import GroupProfilePreview from 'app/group/GroupProfilePreview';
import GroupTop5Tracks from 'app/group/GroupTop5Tracks';
import PlayBtnCtrl from 'app/play-btn/PlayBtnCtrl';
import Authenticated from 'app/auth/Authenticated';
import Layer from 'app/Layer';
import VkAudioSync from 'app/VkAudioSync';
import VkGroupSync from 'app/VkGroupSync';
import VkDriver from 'app/VkDriver';
import Soundmanager from 'app/soundmanager/Soundmanager';
import PlayerSync from 'app/PlayerSync';
import KeyboardDriver from 'app/KeyboardDriver';
import GroupActivity from 'app/group/GroupActivity';
import Player from 'app/player/Player';
import { Section, Header, Content } from 'app/ResponsiveGrid';
import ProfileCtrl from 'app/user-profile/ProfileCtrl';
import LibraryStaticTracklist from 'app/library/LibraryStaticTracklist';
import GroupsListContainer from 'app/group/GroupsListContainer';
import Router from 'react-router/lib/Router';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';
import Link from 'react-router/lib/Link';
import browserHistory from 'react-router/lib/browserHistory';
import LibraryTracklist from 'app/library/LibraryTracklist';

import 'app/styles/base.css';
import 'app/styles/theme.css';

class GroupPage extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false
    };
  }

  componentWillMount() {
    var cachedGroups = JSON.parse(localStorage.getItem(':cache/groups'));

    if (cachedGroups && cachedGroups[this.props.params.id]) {
      this.setState({
        group: cachedGroups[this.props.params.id]
      });
    } else {
      this.setState({ isLoading: true });

      vk.groups.getById({
        group_ids: this.props.params.id,
        fields: ['description']
      }, (err, res) => {
        if (err) {
          return console.log(err);
        }

        this.setState({
          isLoading: false,
          group: res.response[0]
        });
      });
    }
  }

  render() {
    return (
      <div className='group-page'>
        <div className='scroll-container'>
          <Section>
            <Content>
              <GroupProfilePreview isActive={this.state.isLoading}>
                <GroupProfile group={this.state.group} />
              </GroupProfilePreview>
              <GroupActivity groupId={this.props.params.id} />
            </Content>
          </Section>

          <Section className='group-page__content'>
            <Content>
              <Header>Week top</Header>
              <GroupTop5Tracks groupId={this.props.params.id} />
            </Content>
          </Section>
        </div>

        <div className='main-layout__play-btn'>
          <PlayBtnCtrl />
        </div>
      </div>
    )
  }
}

let Toolbar = updateOn(() => {
  var player = app.value.get(':db/player');
  var isShuffled = hasTag(player, ':player/is-shuffled');

  return (
    <div className='toolbar-container'>
      <div className='toolbar'>
        <span className={cx({ 'action': true, 'action--active': isShuffled })} onClick={shuffle}>shuffle</span>
      </div>
    </div>
  );
}, db => hasTag(db.get(':db/player'), ':player/is-shuffled'));

function shuffle() {
  app.push({
    tag: ':library/toggle-shuffle'
  });
}

let LibraryPage = () =>
  <div className='library-page'>
    <Layer>
      <ProfileCtrl />
    </Layer>
    <Layer>
      <div className='main-layout'>
        <Toolbar />
        <LibraryTracklist />
      </div>
    </Layer>
    <PlayBtnCtrl />
  </div>

let MainPage = () =>
  <div className='main-page'>
    <div className='scroll-container'>
      <Section>
        <ProfileCtrl />
      </Section>

      <Section>
        <Content>
          <Header>
            <Link to='/library'>Library</Link>
          </Header>
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

let AppRootView = () =>
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={MainPage} />
      <Route path="groups/:id" component={GroupPage} />
      <Route path="library" component={LibraryPage} />
    </Route>
  </Router>

export default AppRootView;
