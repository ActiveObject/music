import app from 'app';
import { updateOn } from 'app/renderer';
import * as Player from 'app/Player';
import { hasTag } from 'app/Tag';
import Sound from 'app/Sound';
import Track from './track';

let TrackCtrl = ({ track, tracklist }) => {
  var player = app.value.get(':db/player');
  var isActive = !hasTag(player, ':player/empty') && track.id === player.track.id;

  if (isActive) {
    return (
      <Sound track={track} onFinish={() => nextTrack(tracklist)}>
        <Track
          track={track}
          isActive={isActive}
          onTogglePlay={ (t) => togglePlay(t, tracklist) } />
      </Sound>
    );
  }

  return (
    <Track
      track={track}
      isActive={isActive}
      onTogglePlay={ (t) => togglePlay(t, tracklist) } />
  );
}

function togglePlay(track, tracklist) {
  app.push(Player.togglePlay(app.value.get(':db/player'), track, tracklist));
}

function nextTrack(tracklist) {
  app.push(
    Player.play(
      Player.nextTrack(app.value.get(':db/player'), tracklist)));
}

export default updateOn(TrackCtrl, function (dbVal) {
  return !(hasTag(dbVal.get(':db/player'), ':player/empty')) && dbVal.get(':db/player').track.id;
});
