import { Map } from 'immutable';
import Atom from 'app/Atom';
import vbus from 'app/vbus';
import onValue from 'app/fn/onValue';
import player from 'app/db/player';
import tracks from 'app/db/tracks';
import albums from 'app/db/albums';
import * as Storage from 'app/Storage';
import merge from 'app/fn/merge';
import { addTag } from 'app/Tag';

function firstValue(x) {
  return x[Object.keys(x)[0]];
}

function revive(key, value) {
  if (key === 'player') {
    return firstValue(value);
  }

  if (key === 'tracks') {
    return Map(value);
  }

  if (key === 'albums') {
    return Map(value);
  }

  return value;
}

export default function (vbus) {
  var unsub1 = onValue(player
    .changes
    .map(player => player.track)
    .skipDuplicates()
    .filter(track => Object.keys(track.audio).length > 0)
    .map(JSON.stringify), v => Storage.setItem({ ':player/track': v }));

  var unsub4 = Atom.listen(tracks, function(tracks) {
    Storage.setItem({ ':app/tracks': JSON.stringify({ tracks: tracks }) });
  });

  var unsub5 = Atom.listen(albums, function(albums) {
    Storage.setItem({ ':app/albums': JSON.stringify({ albums: albums }) });
  });

  Storage.getItem(':player/track', function (track) {
    vbus.emit(merge(Atom.value(player), { track: JSON.parse(track) }));
  });

  Storage.getItem(':app/tracks', function (tracks) {
    vbus.emit(addTag(JSON.parse(tracks, revive), ':app/tracks'));
  });

  Storage.getItem(':app/albums', function (albums) {
    vbus.emit(addTag(JSON.parse(albums, revive), ':app/albums'));
  });

  return function() {
    unsub1();
    unsub4();
    unsub5();
  };
};
