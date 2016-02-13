import { Map } from 'immutable';
import Kefir from 'kefir';
import app from 'app';
import onValue from 'app/onValue';
import * as Storage from 'app/Storage';
import merge from 'app/merge';
import { addTag, hasTag } from 'app/Tag';
import subscribeWith from 'app/subscribeWith';
import * as Player from 'app/Player';

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

export default function () {
  var playerTracks = Kefir.fromEvents(app, 'change')
    .map(v => v.get(':db/player'))
    .skipDuplicates()
    .filter(p => !hasTag(p, ':player/empty'))
    .map(p => p.track)
    .skipDuplicates()

  var albums = Kefir.fromEvents(app, 'change')
    .skip(1)
    .map(v => v.get(':db/albums'))
    .skipDuplicates();

  var unsub = subscribeWith(onValue, function (onValue) {
    onValue(playerTracks, function (v) {
      Storage.setItem({ ':player/track': JSON.stringify(v) });
    });

    onValue(albums, function(albums) {
      Storage.setItem({ ':app/albums': JSON.stringify({ albums: albums }) });
    });
  });

  Storage.getItem(':player/track', function (track) {
    app.push(Player.useTrack(app.value.get(':db/player'), JSON.parse(track)));
  });

  Storage.getItem(':app/albums', function (albums) {
    app.push(addTag(JSON.parse(albums, revive), ':app/albums'));
  });

  return unsub;
};
