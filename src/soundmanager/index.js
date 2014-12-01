var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var curry = require('curry');
var sm = require('sound-manager');
var merge = require('app/utils').merge;

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
  this.sound.setPosition(pos);
  return this;
};


function Soundmanager(state) {
  this.state = state;
}

Soundmanager.prototype = Object.create(EventEmitter.prototype, {
  constructor: { value: Soundmanager, enumerable: false }
});

Soundmanager.prototype.setup = function (options) {
  sm.setup(merge(options, {
    onready: function () {
      this.changeState(new ReadyState({}));
    }.bind(this),

    ontimeout: function () {
      this.changeState(new UninitializedState());
    }.bind(this)
  }));
};

Soundmanager.prototype.play = function () {
  return this.changeState(this.state.play());
};

Soundmanager.prototype.pause = function () {
  return this.changeState(this.state.pause());
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

  return this.changeState(this.state.useTrack(track, sound));
};

Soundmanager.prototype.setPosition = function (position) {
  return this.changeState(this.state.setPosition(position));
};

Soundmanager.prototype.changeState = function (newState) {
  if (this.state !== newState) {
    this.state = newState;
    this.emit('change', this.state);
  }

  return this;
};

module.exports = new Soundmanager(new UninitializedState());
