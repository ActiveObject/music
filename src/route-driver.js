import page from 'page';
import app from 'app';

page('/', function () {
  app.push({
    tag: [':app/route', ':route/main']
  });
});

export default page;
