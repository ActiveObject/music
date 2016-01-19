import app from 'app';
import { hasTag } from 'app/Tag';
import { updateOn } from 'app/renderer';
import MainLayout from 'app/main-layout/MainLayout';
import AuthView from 'app/auth/AuthView';
import VkCaptchaView from 'app/VkCaptchaView';
import GroupProfile from 'app/group-profile/GroupProfile';
import GroupTop5Tracks from 'app/GroupTop5Tracks';
import PlayBtnCtrl from 'app/main-layout/PlayBtnCtrl';

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

var AppRootView = () => {
  var route = app.value.get(':db/route');
  var vk = app.value.get(':db/vk');

  if (hasTag(vk, ':vk/captcha-needed')) {
    return <VkCaptchaView url={vk.captchaUrl} />
  }

  return (
    <div className='group-page'>
      <div className='scroll-container'>
        <section>
          <content>
            <GroupProfile group={group} />
          </content>
        </section>

        <section className='group-page__content'>
          <content>
            <header>Week top</header>
            <GroupTop5Tracks group={group.screen_name} />
          </content>
        </section>
      </div>

      <div className='main-layout__play-btn'>
        <PlayBtnCtrl />
      </div>
    </div>
  );

  if (hasTag(route, ':route/main')) {
    return <MainLayout />;
  }

  if (hasTag(route, ':route/auth')) {
    return <AuthView url={route.authUrl} />;
  }

  return <div className='empty-view' />;
}

export default updateOn(AppRootView, [':db/route', ':db/vk']);
