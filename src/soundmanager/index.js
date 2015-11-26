var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var sm = require('soundmanager');
var merge = require('app/merge');
var { hasTag, addTag } = require('app/Tag');

function Soundmanager() {
  this.state = {
    tag: ':sm/uninitialized'
  };
}

Soundmanager.prototype = Object.create(EventEmitter.prototype, {
  constructor: { value: Soundmanager, enumerable: false }
});

Soundmanager.prototype.setup = function (options) {
  sm.setup(merge(options, {
    onready: () => {
      this.state.tag = ':sm/ready';
    }
  }));
};

Soundmanager.prototype.play = function (track) {
  if (!hasTag(this.state, ':sm/ready')) {
    return;
  }

  if (!this.state.track) {
    var sound = sm.createSound({
      id: 'Audio(' + track.audio.artist + ', ' + track.audio.title + ')',
      url: track.audio.url,
      autoLoad: false,
      autoPlay: false,
      volume: 100,

      onfinish: () => {
        this.emit('finish', this.state.track);
      },

      whileplaying: _.throttle(() => {
        if (sound.readyState !== 0) {
          this.emit('whileplaying', sound.position);
        }
      }, 500),

      whileloading: _.throttle(() => {
        this.emit('whileloading', sound.bytesLoaded, sound.bytesTotal);
      }, 500)
    });

    this.state.track = track;
    this.state.sound = sound;
  }

  if (track.id !== this.state.track.id) {
    this.state.sound.stop();
    this.state.sound.destruct();

    var sound = sm.createSound({
      id: 'Audio(' + track.audio.artist + ', ' + track.audio.title + ')',
      url: track.audio.url,
      autoLoad: false,
      autoPlay: false,
      volume: 100,

      onfinish: () => {
        this.emit('finish', this.state.track);
      },

      whileplaying: _.throttle(() => {
        if (sound.readyState !== 0) {
          this.emit('whileplaying', sound.position);
        }
      }, 500),

      whileloading: _.throttle(() => {
        this.emit('whileloading', sound.bytesLoaded, sound.bytesTotal);
      }, 500)
    });

    this.state.sound = sound;
    this.state.track = track;
  }

  if (this.state.sound.playState === 0) {
    return this.state.sound.play();
  }

  if (this.state.sound.paused) {
    return this.state.sound.resume();
  }
};

Soundmanager.prototype.pause = function (track) {
  if (!hasTag(this.state, ':sm/ready')) {
    return;
  }

  if (!this.state.sound.paused) {
    this.state.sound.pause();
  }
};

Soundmanager.prototype.setPosition = function (position) {
  if (!hasTag(this.state, ':sm/ready')) {
    return;
  }

  this.state.sound.setPosition(position);
};

module.exports = new Soundmanager();
