import { EventEmitter } from 'events';
import throttle from 'lodash/throttle';
import { soundManager as sm } from 'soundmanager2';
import merge from 'app/merge';
import { hasTag } from 'app/Tag';

function Driver() {
  this.state = {
    tag: ':sm/uninitialized'
  };

  this.setMaxListeners(100);
}

Driver.prototype = Object.create(EventEmitter.prototype, {
  constructor: { value: Driver, enumerable: false }
});

Driver.prototype.setup = function (options) {
  sm.setup(merge(options, {
    onready: () => {
      this.state.tag = ':sm/ready';
    }
  }));
};

Driver.prototype.tick = function (player) {
  if (!hasTag(this.state, ':sm/ready')) {
    return;
  }

  if (!player.track) {
    return;
  }

  var track = player.track;

  if (this.track && track.id !== this.track.id) {
    this.sound.destruct();
  }

  if (!this.track || track.id !== this.track.id || track.url !== this.track.url) {
    var sound = sm.createSound({
      id: 'Audio(' + track.artist + ', ' + track.title + ')',
      url: track.url,
      autoLoad: false,
      autoPlay: false,
      volume: 100,

      onload: () => {
        if (sound.readyState === 2) {
          var err = new Error(`Can\'t load audio ${this.track.artist} - ${this.track.title}`);
          err.track = this.track;
          this.emit('error', err);
        }
      },

      onfinish: () => {
        this.emit('finish', this.track);
      },

      whileplaying: throttle(() => {
        if (sound.readyState !== 0) {
          this.emit('whileplaying', sound.position);
        }
      }, 500),

      whileloading: throttle(() => {
        this.emit('whileloading', sound.bytesLoaded, sound.bytesTotal);
      }, 500)
    });

    this.track = track;
    this.sound = sound;
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

export default new Driver();
