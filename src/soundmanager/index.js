var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var sm = require('soundmanager');
var merge = require('app/merge');

var UninitializedState = require('./uninitialized-state');
var ReadyState = require('./ready-state');
var PlayingState = require('./playing-state');
var PausedState = require('./paused-state');
var hasTag = require('app/Tag').hasTag;


function Soundmanager(attrs) {
  this.state = attrs.state;
}

Soundmanager.prototype = Object.create(EventEmitter.prototype, {
  constructor: { value: Soundmanager, enumerable: false }
});

Soundmanager.prototype.setup = function (options) {
  sm.setup(merge(options, {
    onready: function () {
      if (this.state.track) {
        this.useTrack(this.state.track);
      }

      this.state = this.state.setup();
    }.bind(this),

    ontimeout: function () {
      this.state = UninitializedState.create({});
    }.bind(this)
  }));
};

Soundmanager.prototype.play = function () {
  this.state = this.state.play();
};

Soundmanager.prototype.pause = function () {
  this.state = this.state.pause();
};

Soundmanager.prototype.useTrack = function (track) {
  var stm = this;

  var sound = sm.createSound({
    id: 'Audio(' + track.audio.artist + ', ' + track.audio.title + ')',
    url: track.audio.url,
    autoLoad: false,
    autoPlay: false,
    volume: 100,

    onfinish: function () {
      stm.emit('finish', stm.state.track);
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

  this.state = this.state.useTrack(track, sound);
};

Soundmanager.prototype.setPosition = function (position) {
  if (hasTag(this.state, ':sm/playing') || hasTag(this.state, ':sm/paused')) {
    this.state.sound.setPosition(position);
  }
};

module.exports = new Soundmanager({
  state: UninitializedState.create({})
});
