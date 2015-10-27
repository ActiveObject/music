import { Map } from 'immutable';
import Kefir from 'kefir';
import app from 'app';
import Atom from 'app/Atom';
import onValue from 'app/onValue';
import * as Storage from 'app/Storage';
import merge from 'app/merge';
import { addTag } from 'app/Tag';
import subscribeWith from 'app/subscribeWith';

var albums = app.view(':db/albums');
var tracks = app.view(':db/tracks');

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
    .map(v => v.get(':db/player').track)
    .skipDuplicates()
    .filter(track => Object.keys(track.audio).length > 0);

  var unsub = subscribeWith(onValue, Atom.listen, function (onValue, listen) {
    onValue(playerTracks, function (v) {
      Storage.setItem({ ':player/track': JSON.stringify(v) });
    });

    listen(tracks, function(tracks) {
      Storage.setItem({ ':app/tracks': JSON.stringify({ tracks: tracks }) });
    });

    listen(albums, function(albums) {
      Storage.setItem({ ':app/albums': JSON.stringify({ albums: albums }) });
    });
  });

  Storage.getItem(':player/track', function (track) {
    app.push(merge(app.value.get(':db/player'), { track: JSON.parse(track) }));
  });

  Storage.getItem(':app/tracks', function (tracks) {
    app.push(addTag(JSON.parse(tracks, revive), ':app/tracks'));
  });

  Storage.getItem(':app/albums', function (albums) {
    app.push(addTag(JSON.parse(albums, revive), ':app/albums'));
  });

  return unsub;
};
