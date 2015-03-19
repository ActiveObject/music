var _ = require('underscore');
var Immutable = require('immutable');
var moment = require('moment');
var vk = require('app/vk');
var NewsfeedActivity = require('app/values/newsfeed-activity');

function ActivityLoader(id, period) {
  this.id = id;
  this.period = period;
}

ActivityLoader.prototype.go = function (input, output) {
  input.onValue(function (msg) {
    vk.wall.get({
      owner_id: msg.id,
      offset: msg.offset,
      count: msg.count
    }, function(err, res) {
      if (err) {
        return output.error(err);
      }

      var items = res.response.items.map(function (item) {
        return new NewsfeedActivity({
          id: [item.owner_id, item.id].join(':'),
          owner: item.owner_id,
          date: moment(item.date * 1000).format('YYYY-MM-DD')
        });
      });

      if (items.length > 0) {
        output.push(Immutable.Set(items));
      }

      var oldest = moment(_.last(items).date);

      if (oldest.isAfter(msg.period.startOf())) {
        input.push({
          id: msg.id,
          period: msg.period,
          offset: msg.offset + msg.count,
          count: msg.count
        });
      } else {
        output.end();
      }
    });
  });

  input.push({
    id: this.id,
    offset: 0,
    count: 100,
    period: this.period
  });
};

ActivityLoader.prototype.toString = function () {
  return 'ActivityLoader(' + this.id + ', ' + this.period.toString() + ')';
};

module.exports = ActivityLoader;
