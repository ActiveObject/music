var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');
var sm = require('soundmanager');
var merge = require('app/merge');
var { hasTag } = require('app/Tag');

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

Soundmanager.prototype.tick = function (player) {
  if (!hasTag(this.state, ':sm/ready')) {
    return;
  }

  var track = player.track;

  if (!this.track) {
    var sound = sm.createSound({
      id: 'Audio(' + track.audio.artist + ', ' + track.audio.title + ')',
      url: track.audio.url,
      autoLoad: false,
      autoPlay: false,
      volume: 100,

      onfinish: () => {
        this.emit('finish', this.track);
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

    this.track = track;
    this.sound = sound;
  }

  if (track.id !== this.track.id) {
    this.sound.stop();
    this.sound.destruct();

    var sound = sm.createSound({
      id: 'Audio(' + track.audio.artist + ', ' + track.audio.title + ')',
      url: track.audio.url,
      autoLoad: false,
      autoPlay: false,
      volume: 100,

      onfinish: () => {
        this.emit('finish', this.track);
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

    this.sound = sound;
    this.track = track;
  }

  if (!hasTag(player, ':player/is-playing') && !this.sound.paused) {
    return this.sound.pause();
  }

  if (hasTag(player, ':player/is-playing') && this.sound.playState === 0) {
    return this.sound.play();
  }

  if (hasTag(player, ':player/is-playing') && this.sound.paused) {
    return this.sound.resume();
  }

  if (hasTag(player, ':player/seek-to-position')) {
    return this.sound.setPosition(player.seekToPosition);
  }
};

module.exports = new Soundmanager();
