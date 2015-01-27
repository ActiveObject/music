var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var sm = require('sound-manager');
var merge = require('app/utils/merge');
var Atom = require('app/core/atom');

var UninitializedState = require('./uninitialized-state');
var ReadyState = require('./ready-state');
var PlayingState = require('./playing-state');
var PausedState = require('./paused-state');


function Soundmanager(attrs) {
  this.mountPoint = attrs.mountPoint;
  this.atom = attrs.atom;
}

Soundmanager.prototype = Object.create(EventEmitter.prototype, {
  constructor: { value: Soundmanager, enumerable: false }
});

Soundmanager.prototype.setup = function (options) {
  sm.setup(merge(options, {
    onready: function () {
      if (this.atom.value.track) {
        this.useTrack(this.atom.value.track);
      }

      Atom.update(this, v => v.setup());
    }.bind(this),

    ontimeout: function () {
      this.atom.swap(UninitializedState.create({}));
    }.bind(this)
  }));
};

Soundmanager.prototype.play = function () {
  Atom.update(this, v => v.play());
};

Soundmanager.prototype.pause = function () {
  Atom.update(this, v => v.pause());
};

Soundmanager.prototype.useTrack = function (track) {
  var stm = this;

  var sound = sm.createSound({
    id: track.id,
    url: track.url,
    autoLoad: false,
    autoPlay: false,
    volume: 100,

    onfinish: function () {
      stm.emit('finish', stm.atom.value.track);
    },

    whileplaying: _.throttle(function () {
      if (this.readyState !== 0) {
        stm.emit('whileplaying', this.position);
      }
    }, 500),

    whileloading: _.throttle(function () {
      stm.emit('whileloading', this.bytesLoaded, this.bytesTotal);
    }, 500)
  });

  Atom.update(this, v => v.useTrack(track, sound));
};

Soundmanager.prototype.setPosition = function (position) {
  Atom.update(this, v => v.setPosition(position));
};

module.exports = new Soundmanager({
  mountPoint: 'soundmanager',
  atom: new Atom(UninitializedState.create({}))
});
