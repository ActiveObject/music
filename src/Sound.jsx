import React from 'react';
import { soundManager as sm } from 'soundmanager2';
import { throttle, omit } from 'underscore';
import app from 'app';
import { updateOn } from 'app/renderer';
import { hasTag, removeTag } from 'app/Tag';
import merge from 'app/merge';

class Sound extends React.Component {
  componentWillMount() {
    sm.setup({ debugMode: false })
    this.sound = this.createSound();
  }

  componentWillUnmount() {
    this.sound.destruct();
  }

  componentDidUpdate() {
    this.sync();
  }

  render() {
    return this.props.children;
  }

  createSound() {
    var track = this.props.track;
    var player = app.value.get(':db/player');

    return sm.createSound({
      id: 'Audio(' + track.artist + ', ' + track.title + ')',
      url: track.url,
      autoLoad: false,
      autoPlay: hasTag(player, ':player/is-playing'),
      volume: 100,

      onload: () => {
        if (this.sound.readyState === 2) {
          var err = new Error(`Can\'t load audio ${track.props.artist} - ${this.props.track.title}`);
          err.track = this.props.track;
          this.onError(err);
        }
      },

      onfinish: () => this.props.onFinish(),

      whileplaying: throttle(() => {
        if (this.sound.readyState !== 0) {
          this.onPlaying(this.sound.position);
        }
      }, 500),

      whileloading: throttle(() => this.onLoading(this.sound.bytesLoaded, this.sound.bytesTotal))
    });
  }

  sync() {
    var track = this.props.track;
    var player = app.value.get(':db/player');

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
      app.push(merge(omit(removeTag(player, ':player/seek-to-position'), 'seekToPosition'), {
        position: player.seekToPosition
      }));

      return this.sound.setPosition(player.seekToPosition);
    }
  }

  onPlaying(position) {
    if (!app.value.get(':db/player').seeking) {
      app.push(merge(app.value.get(':db/player'), { position: position }));
    }
  }

  onLoading(bytesLoaded, bytesTotal) {
    app.push(merge(app.value.get(':db/player'), { bytesLoaded, bytesTotal }));
  }

  onError(err) {
    console.log(err);
  }
}

Sound.propTypes = {
  track: React.PropTypes.object.isRequired,
  onFinish: React.PropTypes.func.isRequired
};

export default updateOn(Sound, ':db/player');
