var _ = require('underscore');
var Immutable = require('immutable');
var isString = require('underscore').isString;
var moment = require('moment');
var Atom = require('app/core/atom');
var app = require('app/core/app');
var newsfeed = require('app/values/newsfeed');
var Activity = require('app/values/activity');
var eventBus = require('app/core/event-bus');
var LastNWeeksDRange = require('app/values/last-nweeks-drange');
var vk = require('app/vk');
var NewsfeedActivity = require('app/values/newsfeed-activity');

function Appstate(attrs) {
  this.atom = attrs.atom;
}

Appstate.prototype.toJSON = function() {
  return this.atom.value.filterNot(function(val, key) {
    return key === 'soundmanager';
  }).toJSON();
};

Appstate.prototype.mount = function(receive, send, service) {
  if (!Atom.isAtomable(service)) {
    throw new TypeError('Mount target should implement atomable protocol');
  }

  if (!isString(service.mountPoint)) {
    throw new TypeError('Mount target should have a mountPoint as string but given ' + service.mountPoint);
  }

  var e = 'app',
      a = ':app/' + service.mountPoint;

  service.atom.on('change', function (newState) {
    send({ e: e, a: a, v: newState });
  });

  receive(a, function (appstate, v) {
    return appstate.set(service.mountPoint, v);
  });

  receive(':app/started', function(appstate) {
    return appstate.set(service.mountPoint, service.atom.value);
  });
};

function Entity(v, service) {
  var releasers = [];
  var atom = new Atom(v);

  app.use((receive) => {
    return service(this, function () {
      var release = receive.apply(this, arguments);
      releasers.push(release);
      return release;
    });
  });

  this.atom = atom;

  this.release = function () {
    releasers.forEach(function (release) {
      release();
    });

    atom.removeAllListeners('change');
    atom.value = null;
  };
}

function CompoundEntity(entities) {
  var initial = Immutable.Map();

  entities.forEach(function (e) {
    initial = initial.set(-e.atom.value.owner, e.atom.value);
  });

  var atom = new Atom(initial);

  entities.forEach(function (e) {
    e.atom.on('change', function (ev) {
      atom.swap(atom.value.set(-ev.owner, ev));
    });
  });

  this.atom = atom;

  this.release = function () {
    entities.forEach(function (e) {
      e.release();
    });
  };
}

Appstate.prototype.groupById = function(id) {
  var g = this.atom.value.get('groups').find(g => g.id === id);

  return new Entity(g, function (e, receive) {
    receive(':app/groups', function(appstate, groups) {
      Atom.update(e, (v) => appstate.get('groups').find(g => g.id === id));
    });
  });
};

Appstate.prototype.newsfeedForGroup = function(id) {
  var saved = this.atom.value.get('newsfeeds').find(nf => nf.owner === -id);
  var nf = saved ? saved : newsfeed.modify({ owner: -id });

  eventBus.push(nf.load(0, 10));

  return new Entity(nf, function (e, receive) {
    receive(':app/newsfeed', function(appstate, nf) {
      Atom.update(e, (v) => nf.owner === -id ? nf : v);
    });
  });
};

function ActivityLoader(id, saved, onItems) {
  var feed = new Feed(0, 100);
  var period = new LastNWeeksDRange(33);

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

    onItems(items);

    var oldest = moment(_.last(items).date);

    if (oldest.isAfter(period.startOf())) {
      loadWall(-id, feed.next(), onData);
    }
  }

  loadWall(-id, feed.next(), onData);
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

Appstate.prototype.activityForGroup = function(id) {
  var period = new LastNWeeksDRange(33, new Date());
  var a = new Activity(-id, period, this.atom.value.get('activities'));

  var loader = new ActivityLoader(id, this.atom.value.get('activities'), function (items) {
    eventBus.push({ e: 'app', a: ':app/activity', v: items });
  });

  return new Entity(a, function (e, receive) {
    receive(':app/activity', function(appstate) {
      Atom.swap(e, new Activity(-id, period, appstate.get('activities')));
    });
  });
};

Appstate.prototype.groups = function(ids) {
  var saved = this.atom.value.get('groups').filter(g => ids.indexOf(g.id) !== -1);

  return new Entity(saved, function (e, receive) {
    receive(':app/groups', function(appstate, groups) {
      Atom.update(e, (v) => groups.filter(g => ids.indexOf(g.id) !== -1));
    });
  });
};

Appstate.prototype.activities = function(ids) {
  return new CompoundEntity(ids.map(id => this.activityForGroup(id)));
};

module.exports = new Appstate({
  atom: new Atom(Immutable.Map())
});

module.exports.update = function update(key, updater) {
  return function updateDb(db) {
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift(db.get(key));
    return db.set(key, updater.apply(db, args));
  };
};
