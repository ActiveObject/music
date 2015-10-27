import app from 'app';
import { hasTag } from 'app/Tag';
import { updateOn } from 'app/renderer';
import MainLayout from 'app/main-layout/MainLayout';
import AuthView from 'app/auth/AuthView';

var AppRootView = () => {
  var route = app.value.get(':db/route');

  if (hasTag(route, ':route/main')) {
    return <MainLayout />;
  }

  if (hasTag(route, ':route/auth')) {
    return <AuthView url={route.authUrl} />;
  }

  return <div className='empty-view' />;
}

export default updateOn(AppRootView, ':db/route');