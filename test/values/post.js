var expect = require('chai').expect,
    post = require('app/values/post');

describe('Post', function() {
  beforeEach(function() {
    this.response = {
      id: 1,
      from_id: 1,
      owner_id: 1,
      date: 1418028428,
      post_type: 'post',
      text: 'Test text',
      attachments: [{
        type: 'photo',
        photo: {
          id: 347954710,
          album_id: -7,
          owner_id: 1,
          photo_75: 'http://cs7002.vk....8/IXG9iD6ls7A.jpg',
          photo_130: 'http://cs7002.vk....9/yCbSQ5QtWW8.jpg',
          photo_604: 'http://cs7002.vk....a/T0ylJCDCfis.jpg',
          photo_807: 'http://cs7002.vk....b/EXHm-5Xs6qo.jpg',
          photo_1280: 'http://cs7002.vk....c/2ykqkh_sUt8.jpg',
          photo_2560: 'http://cs7002.vk....d/Dg3ZZYXofYo.jpg',
          width: 1448,
          height: 2048,
          text: '',
          date: 1418027225,
          post_id: 45636,
          access_key: '4574d6534b59070a2f'
        }
      }],

      post_source: {
        type: 'vk'
      },

      comments: {
        count: 0,
        can_post: 0
      },

      likes: {
        count: 8843,
        user_likes: 0,
        can_like: 1,
        can_publish: 1
      },

      reposts: {
        count: 663,
        user_reposted: 0
      }
    };
  });

  describe('#modify', function() {
    it('should create a post with correct id', function() {
      expect(post.modify(this.response).id).to.equal(1);
    });
  });
});
