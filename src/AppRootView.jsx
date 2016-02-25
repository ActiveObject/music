import app from 'app';
import vk from 'app/vk';
import { hasTag } from 'app/Tag';
import GroupProfile from 'app/group-profile/GroupProfile';
import GroupProfilePreview from 'app/group-profile/GroupProfilePreview';
import GroupTop5Tracks from 'app/GroupTop5Tracks';
import PlayBtnCtrl from 'app/play-btn/PlayBtnCtrl';
import Authenticated from 'app/auth/Authenticated';
import Layer from 'app/Layer';
import VkAudioSync from 'app/VkAudioSync';
import VkGroupSync from 'app/VkGroupSync';
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
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

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

let MainPage = () =>
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
    </Route>
  </Router>

export default AppRootView;
