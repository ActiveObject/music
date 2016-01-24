import app from 'app';
import { hasTag } from 'app/Tag';
import MainLayout from 'app/main-layout/MainLayout';
import VkCaptchaView from 'app/VkCaptchaView';
import GroupProfile from 'app/group-profile/GroupProfile';
import GroupTop5Tracks from 'app/GroupTop5Tracks';
import PlayBtnCtrl from 'app/play-btn/PlayBtnCtrl';
import Authenticated from 'app/auth/Authenticated';
import Layer from 'app/main-layout/Layer';
import Drivers from 'app/Drivers';

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

var Section = ({ children, className }) =>
  <div className={`section ${className}`}>
    {children}
  </div>

var Header = ({ children }) =>
  <div className='header'>
    {children}
  </div>

var Content = ({ children }) =>
  <div className='content'>
    {children}
  </div>

var GroupPage = () =>
  <div className='group-page'>
    <div className='scroll-container'>
      <Section>
        <Content>
          <GroupProfile group={group} />
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

var AppRootView = () =>
  <Authenticated>
    <Layer>
      <MainLayout />
      <VkCaptchaView />
      <Drivers />
    </Layer>
  </Authenticated>

export default AppRootView;
