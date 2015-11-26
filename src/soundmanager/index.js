import { EventEmitter } from 'events';
import { throttle } from 'underscore';
import sm from 'soundmanager';
import merge from 'app/merge';
import { hasTag } from 'app/Tag';

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


  if (this.track && track.id !== this.track.id) {
    this.sound.destruct();
  }

  if (!this.track || track.id !== this.track.id || track.audio.url !== this.track.audio.url) {
    var sound = sm.createSound({
      id: 'Audio(' + track.audio.artist + ', ' + track.audio.title + ')',
      url: track.audio.url,
      autoLoad: false,
      autoPlay: false,
      volume: 100,

      onload: () => {
        if (sound.readyState === 2) {
          var err = new Error(`Can\'t load audio ${this.track.audio.artist} - ${this.track.audio.title}`);
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

export default new Soundmanager();
