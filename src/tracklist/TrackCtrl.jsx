import app from 'app';
import { updateOn } from 'app/renderer';
import * as Player from 'app/Player';
import { hasTag } from 'app/Tag';
import Track from './track';
import sm from 'app/soundmanager';

class TrackCtrl extends React.Component {
  componentWillMount() {
    this.unsub = on(sm, 'finish', (track) => {
      if (track.id === this.props.track.id) {
        app.push(
          Player.play(
            Player.nextTrack(app.value.get(':db/player'), this.props.tracklist)));
      }
    });
  }

  componentWillUnmount() {
    this.unsub();
  }

  render() {
    var { track, tracklist } = this.props;
    var player = app.value.get(':db/player');
    var isActive = !hasTag(player, ':player/empty') && track.id === player.track.id;

    return (
       <Track
          track={track}
          isActive={isActive}
          onTogglePlay={ (t) => togglePlay(t, tracklist) } />
    );
  }
}

function togglePlay(track, tracklist) {
  app.push(Player.togglePlay(app.value.get(':db/player'), track, tracklist));
}

function on(emitter, event, fn) {
  emitter.on(event, fn);

  return function() {
    emitter.removeListener(event, fn);
  };
}

export default updateOn(TrackCtrl, function (dbVal) {
  return !(hasTag(dbVal.get(':db/player'), ':player/empty')) && dbVal.get(':db/player').track.id;
});
