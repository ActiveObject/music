import { EventEmitter } from 'events';
import merge from 'app/shared/merge';
import { toString } from 'app/shared/Track';

function SoundDriver() {
  this.setMaxListeners(100);
}

SoundDriver.prototype = Object.create(EventEmitter.prototype, {
  constructor: { value: SoundDriver, enumerable: false }
});

SoundDriver.prototype.tick = function (track, isPlaying, isSeeking, seekToPosition) {
  if (!track) {
    return;
  }

  if (this.track && (track.id !== this.track.id || track.url !== this.track.url)) {
    console.log(`[SoundDriver] destroy sound for ${toString(this.track)}`);
    this.destroyAudio();
  }

  if (!this.track || track.id !== this.track.id || track.url !== this.track.url) {
    this.track = track;
    this.destroyAudio = this.createAudio(track);
  }

  if (!isPlaying && !this.audio.paused) {
    return this.audio.pause();
  }

  if (isPlaying && this.audio.paused) {
    return this.audio.play();
  }

  if (isSeeking) {
    return this.audio.currentTime = seekToPosition / 1000;
  }
};

SoundDriver.prototype.createAudio = function (track) {
  console.log(`[SoundDriver] create audio for ${toString(track)}`);

  var audio = new Audio(track.url);

  var onStalled = () => {
    console.log(`[SoundDriver] stalled ${toString(track)}`);
    var err = new Error(`Can\'t load audio ${toString(track)}`);
    err.track = this.track;
    this.emit('error', err);
  }

  var onTimeUpdate = () => {
    this.emit('whileplaying', audio.currentTime * 1000);
  }

  var onEnded = () => {
    this.emit('finish');
  }

  audio.addEventListener('stalled', onStalled, false);
  audio.addEventListener('timeupdate', onTimeUpdate, false);
  audio.addEventListener('ended', onEnded, false);

  this.audio = audio;

  return function () {
    audio.pause();
    audio.src = '';
    audio.load();
    audio.removeEventListener('stalled', onStalled, false);
    audio.removeEventListener('timeupdate', onTimeUpdate, false);
    audio.removeEventListener('ended', onEnded, false);
  };
};

export default new SoundDriver();
