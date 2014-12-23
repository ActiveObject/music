var Immutable = require('immutable');
var isString = require('underscore').isString;
var Atom = require('app/core/atom');
var app = require('app/core/app');
var newsfeed = require('app/values/newsfeed');
var activity = require('app/values/activity');
var eventBus = require('app/core/event-bus');
var LastNWeeksDRange = require('app/values/last-nweeks-drange');

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

Appstate.prototype.activityForGroup = function(id) {
  var feed = new Feed(0, 100);
  var period = new LastNWeeksDRange(33);

  var saved = this.atom.value
      .get('activities')
      .filter(a => a.owner === -id)
      .groupBy(a => a.date)
      .map(v => v.size);

  var a = activity.modify({ owner: -id }).fromMap(saved);

  eventBus.push(a.load(feed, period));

  var e = new Entity(a, function (e, receive) {
    receive(':app/activity', function(appstate) {
      Atom.update(e, function (v) {
        var items = appstate.get('activities')
          .filter(a => a.owner === -id)
          .groupBy(a => a.date)
          .map(v => v.size);

        return activity.modify({ owner: -id }).fromMap(items);
      });
    });
  });

  function onChange(v) {
    var toLoad = v.load(feed, period);

    if (!toLoad) {
      return e.atom.removeListener('change', onChange);
    }

    eventBus.push(toLoad);
  }

  e.atom.on('change', onChange);

  return e;
};

Appstate.prototype.groups = function(ids) {
  var saved = this.atom.value.get('groups').filter(g => ids.indexOf(g.id) !== -1);

  return new Entity(saved, function (e, receive) {
    receive(':app/groups', function(appstate, groups) {
      Atom.update(e, (v) => groups.filter(g => ids.indexOf(g.id) !== -1));
    });
  });
};

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
