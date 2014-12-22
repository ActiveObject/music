var Immutable = require('immutable');
var isString = require('underscore').isString;
var Atom = require('app/core/atom');
var app = require('app/core/app');
var newsfeed = require('app/values/newsfeed');
var activity = require('app/values/activity');
var eventBus = require('app/core/event-bus');

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

function Entity(v) {
  this.atom = new Atom(v);
}

Appstate.prototype.groupById = function(id) {
  var e = new Entity(this.atom.value.get('groups').items.find(g => g.id === id));

  e.atom.on('change', (v) => console.log(v.toJS()));

  app.use(function (receive) {
    receive(':app/groups', function(appstate, groups) {
      Atom.update(e, function(v) {
        return appstate.get('groups').items.find(g => g.id === id);
      });
    });
  });

  return e;
};

Appstate.prototype.newsfeedForGroup = function(id) {
  var saved = this.atom.value.get('newsfeeds').find(nf => nf.owner === -id);
  var nf = saved ? saved : newsfeed.modify({ owner: -id });
  var e = new Entity(nf);

  app.use(function (receive) {
    receive(':app/newsfeed', function(appstate, nf) {
      Atom.update(e, (v) => nf.owner === -id ? nf : v);
    });
  });

  eventBus.push(nf.load());

  return e;
};

Appstate.prototype.activityForGroup = function(id) {
  var saved = this.atom.value.get('activities').find(a => a.owner === -id);
  var a = saved ? saved : activity.modify({ owner: -id });
  var e = new Entity(a);

  app.use(function (receive) {
    receive(':app/activity', function(appstate, activity) {
      Atom.update(e, (v) => activity.owner === -id ? activity : v);
    });
  });

  eventBus.push(a.load(0, 1000));

  return e;
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
