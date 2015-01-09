var _ = require('underscore');
var moment = require('moment');
var vk = require('app/vk');
var Atom = require('app/core/atom');
var NewsfeedActivity = require('app/values/newsfeed-activity');

function ActivityLoader(id, saved, period) {
  var feed = new Feed(0, 100);
  var atom = new Atom();

  function onData(err, data) {
    if (err) {
      return console.log(err);
    }

    var items = data.items.map(function (item) {
      return new NewsfeedActivity({
        id: [item.owner_id, item.id].join(':'),
        owner: item.owner_id,
        date: moment(item.date * 1000).format('YYYY-MM-DD')
      });
    });

    if (items.length > 0) {
      atom.swap(items);

      var oldest = moment(_.last(items).date);

      if (oldest.isAfter(period.startOf())) {
        loadWall(-id, feed.next(), onData);
      }
    }
  }

  loadWall(-id, feed.next(), onData);

  this.atom = atom;
}

function loadWall(owner, params, callback) {
  vk.wall.get({
    owner_id: owner,
    offset: params.offset,
    count: params.count
  }, function(err, res) {
    if (err) {
      return callback(err);
    }

    callback(null, res.response);
  });
}

function Feed(offset, count) {
  this.atom = new Atom({
    offset: offset,
    count: count
  });
}

Feed.prototype.next = function () {
  var offset = this.atom.value.offset;
  var count = this.atom.value.count;

  this.atom.swap({
    offset: offset + count,
    count: count
  });

  return {
    offset: offset,
    count: count
  };
};

module.exports = ActivityLoader;
