var expect = require('chai').expect,
    tracks = require('app/values/tracks');

describe('value/tracks', function() {
  beforeEach(function() {
    this.vkResponse = {
      count: 3,
      offset: 0,
      items: [{
        id: 1,
        title: "Title 1",
        artist: "Artist 1",
        album_id: 1,
        duration: 1,
        genre_id: 1,
        owner_id: 1,
        url: "http://tracks/1"
      }, {
        id: 2,
        title: "Title 2",
        artist: "Artist 2",
        album_id: 1,
        duration: 1,
        genre_id: 1,
        owner_id: 1,
        url: "http://tracks/2"
      }, {
        id: 3,
        title: "Title 3",
        artist: "Artist 3",
        album_id: 1,
        duration: 1,
        genre_id: 1,
        owner_id: 1,
        url: "http://tracks/3"
      }]
    };
  });

  describe('#fromVkResponse', function() {
    it('should add all items to the empty tracks', function() {
      var t = tracks.fromVkResponse(this.vkResponse);
      expect(t.items.toString()).to.equals('Set { Track #1, Track #2, Track #3 }');
    });
  });

  describe('#merge', function() {
    it('should add new tracks', function() {
      var t1 = tracks.fromVkResponse({
        count: this.vkResponse.count,
        items: this.vkResponse.items.slice(0, 1)
      });

      var t2 = tracks.fromVkResponse({
        count: this.vkResponse.count,
        items: this.vkResponse.items.slice(1)
      });

      var t3 = t1.merge(t2);

      expect(t3.items.toString()).to.equals('Set { Track #1, Track #2, Track #3 }');
    });
  });

  describe('#size', function() {
    it('should return size of the items set', function() {
      var t = tracks.fromVkResponse(this.vkResponse);
      expect(t.size()).to.equals(3);
    });
  });
});
