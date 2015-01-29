var List = require('immutable').List;
var merge = require('app/utils/merge');
var PostTracklist = require('app/values/tracklists/post-tracklist');
var Playlist = require('app/values/playlist');
var Track = require('app/values/track');

function Post(attrs) {
  this.id = attrs.id;
  this.from = attrs.from_id;
  this.owner = attrs.owner_id;
  this.date = new Date(attrs.date * 1000);
  this.type = attrs.post_type;
  this.text = attrs.text;
  this.attachments = attrs.attachments;
  this.source = attrs.post_source;
  this.comments = attrs.comments;
  this.likes = attrs.likes;
  this.reposts = attrs.reposts;
}

Post.prototype.modify = function(attrs) {
  return new Post(merge(this, attrs));
};

Post.prototype.tracklist = function() {
  if (!this.attachments) {
    return new PostTracklist({
      post: this.id,
      playlist: new Playlist({ tracks: List() })
    });
  }

  var audioItems = this.attachments.filter(function(item) {
    return item.type === 'audio';
  });

  var tracks = audioItems.map(function(item, i) {
    return Track.fromVk(merge(item.audio, { index: i }));
  });

  return new PostTracklist({
    post: this.id,
    playlist: new Playlist({ tracks: List(tracks) })
  });
};

Post.prototype.primaryImage = function() {
  if (!this.attachments) {
    return null;
  }

  var photos = this.attachments.filter((v) => v.type === 'photo');

  if (photos.length === 0) {
    return null;
  }

  return photos[0].photo;
};

module.exports = new Post({});
