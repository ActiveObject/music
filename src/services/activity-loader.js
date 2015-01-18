var _ = require('underscore');
var moment = require('moment');
var vk = require('app/vk');
var Atom = require('app/core/atom');
var NewsfeedActivity = require('app/values/newsfeed-activity');

function ActivityLoader(id, saved, period) {
  this.inbox = [{
    id: -id,
    offset: 0,
    count: 100,
    period: period
  }];

  this.atom = new Atom();
}

ActivityLoader.prototype.process = function () {
  if (this.inbox.length === 0) {
    return;
  }

  var req = this.inbox[0];

  this.load(req, function (err, data) {
    this.inbox.shift();

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
      Atom.swap(this, items);

      var oldest = moment(_.last(items).date);

      if (oldest.isAfter(req.period.startOf())) {
        this.inbox.push({
          id: req.id,
          period: req.period,
          offset: req.offset + req.count,
          count: req.count
        });

        this.process();
      }
    }
  }.bind(this));
};

ActivityLoader.prototype.load = function (req, callback) {
  vk.wall.get({
    owner_id: req.id,
    offset: req.offset,
    count: req.count
  }, function(err, res) {
    if (err) {
      return callback(err);
    }

    callback(null, res.response);
  });
};

module.exports = ActivityLoader;
