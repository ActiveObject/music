import { EventEmitter } from 'events';
import throttle from 'lodash/throttle';
import { soundManager as sm } from 'soundmanager2';
import merge from 'app/shared/merge';
import { hasTag } from 'app/shared/Tag';
import { toString } from 'app/shared/Track';

function SoundDriver() {
  this.state = {
    tag: ':sm/uninitialized'
  };

  this.setMaxListeners(100);
}

SoundDriver.prototype = Object.create(EventEmitter.prototype, {
  constructor: { value: SoundDriver, enumerable: false }
});

SoundDriver.prototype.setup = function (options) {
  sm.setup(merge(options, {
    onready: () => {
      this.state.tag = ':sm/ready';
    }
  }));
};

SoundDriver.prototype.tick = function (player) {
  if (!hasTag(this.state, ':sm/ready')) {
    return;
  }

  if (!player.track) {
    return;
  }

  var track = player.track;

  if (this.track && (track.id !== this.track.id || track.url !== this.track.url)) {
    console.log(`[SoundDriver] destroy sound for ${toString(this.track)}`);
    this.sound.destruct();
  }

  if (!this.track || track.id !== this.track.id || track.url !== this.track.url) {
    this.track = track;
    this.sound = this.createSound(track);
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

SoundDriver.prototype.createSound = function (track) {
  console.log(`[SoundDriver] create sound for ${toString(track)}`);

  var sound = sm.createSound({
    id: 'Audio(' + track.artist + ', ' + track.title + ')',
    url: track.url,
    autoLoad: false,
    autoPlay: false,
    volume: 100,

    onload: () => {
      if (this.sound.readyState === 2) {
        var err = new Error(`Can\'t load audio ${toString(track)}`);
        err.track = this.track;
        this.emit('error', err);
      }
    },

    onfinish: () => {
      console.log(`[SoundDriver] finish`);
      this.emit('finish', this.track);
    },

    whileplaying: throttle(() => {
      if (this.sound.readyState !== 0) {
        this.emit('whileplaying', this.sound.position);
      }
    }, 500),

    whileloading: throttle(() => {
      this.emit('whileloading', this.sound.bytesLoaded, this.sound.bytesTotal);
    }, 500)
  });

  // Workaround issue with HTML5 stalled event that isn't
  // passed through soundmanager Sound object
  // See http://stackoverflow.com/questions/12027442/how-to-bind-the-html5stalled-event-from-soundmanager
  sound._a.addEventListener('stalled', () => {
    console.log(`[SoundDriver] stalled ${toString(track)}`);
    var err = new Error(`Can\'t load audio ${toString(track)}`);
    err.track = this.track;
    this.emit('error', err);
  });

  return sound;
};

export default new SoundDriver();
