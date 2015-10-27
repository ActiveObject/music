import db from 'app/db';
import { hasTag } from 'app/Tag';
import updateOnKey from 'app/updateOnKey';
import MainLayout from 'app/main-layout/MainLayout';
import AuthView from 'app/auth/AuthView';

var AppRootView = () => {
  var route = db.value.get(':db/route');

  if (hasTag(route, ':route/main')) {
    return <MainLayout />;
  }

  if (hasTag(route, ':route/auth')) {
    return <AuthView url={route.authUrl} />;
  }

  return <div className='empty-view' />;
}

export default updateOnKey(AppRootView, ':db/route');