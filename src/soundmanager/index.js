var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var curry = require('curry');
var sm = require('sound-manager');
var merge = require('app/utils').merge;
var Atom = require('app/core/atom');

function UninitializedState() {

}

UninitializedState.prototype.setup = function (options) {
  return new ReadyState(options);
};

UninitializedState.prototype.play = function () {
  return this;
};

UninitializedState.prototype.pause = function () {
  return this;
};

UninitializedState.prototype.useTrack = function () {
  return this;
};

UninitializedState.prototype.setPosition = function () {
  return this;
};

function ReadyState(attrs) {
  this.track = attrs.track;
  this.sound = attrs.sound;
}

ReadyState.prototype.play = function () {
  if (!this.track || !this.sound) {
    return this;
  }

  return new PlayingState({
    track: this.track,
    sound: this.sound
  });
};

ReadyState.prototype.pause = function () {
  if (!this.track || !this.sound) {
    return this;
  }

  return new PausedState({
    track: this.track,
    sound: this.sound
  });
};

ReadyState.prototype.useTrack = function (track, sound) {
  return new ReadyState({
    track: track,
    sound: sound
  });
};

ReadyState.prototype.setPosition = function () {
  return this;
};


function PlayingState(attrs) {
  this.track = attrs.track;
  this.sound = attrs.sound;

  if (this.sound.paused) {
    this.sound.resume();
  } else {
    this.sound.play();
  }
}

PlayingState.prototype.useTrack = function (track, sound) {
  this.sound.stop();
  this.sound.unload();

  return new PlayingState({
    track: track,
    sound: sound
  });
};

PlayingState.prototype.play = function () {
  return this;
};

PlayingState.prototype.pause = function () {
  return new PausedState({
    track: this.track,
    sound: this.sound
  });
};

PlayingState.prototype.setPosition = function (pos) {
  this.sound.setPosition(pos);
  return this;
};

function PausedState(attrs) {
  this.track = attrs.track;
  this.sound = attrs.sound;

  if (!this.sound.paused) {
    this.sound.pause();
  }
}

PausedState.prototype.useTrack = function (track, sound) {
  this.sound.stop();
  this.sound.unload();

  return new PausedState({
    track: track,
    sound: sound
  });
};

PausedState.prototype.play = function () {
  return new PlayingState({
    track: this.track,
    sound: this.sound,
    position: this.position
  });
};

PausedState.prototype.pause = function () {
  return this;
};

PausedState.prototype.setPosition = function (v) {
  this.sound.setPosition(v);
  return this;
};


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
      this.atom.swap(new ReadyState({}));
    }.bind(this),

    ontimeout: function () {
      this.atom.swap(new UninitializedState());
    }.bind(this)
  }));
};

Soundmanager.prototype.play = function () {
  this.atom.update(state => state.play());
};

Soundmanager.prototype.pause = function () {
  this.atom.update(state => state.pause());
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

  this.atom.update(state => state.useTrack(track, sound));
};

Soundmanager.prototype.setPosition = function (position) {
  this.atom.update(state => state.setPosition(position));
};

module.exports = new Soundmanager({
  mountPoint: 'soundmanager',
  atom: new Atom(new UninitializedState())
});
