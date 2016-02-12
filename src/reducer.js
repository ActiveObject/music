import { Map } from 'immutable';
import { omit, union, shuffle as shuffleArray } from 'underscore';
import { hasTag, addTag, removeTag } from 'app/Tag';
import merge from 'app/merge';
import Track from 'app/Track';
import Album from 'app/Album';

function commonReducer(state, v) {
  if (hasTag(v, ':app/player')) {
    return state.set(':db/player', v);
  }

  if (hasTag(v, ':app/user')) {
    return state.set(':db/user', v);
  }

  if (hasTag(v, ':app/route')) {
    return state.set(':db/route', v);
  }

  if (hasTag(v, ':app/cmd')) {
    return state.set(':db/cmd', v.value);
  }

  if (hasTag(v, ':app/command-palette')) {
    return state.set(':db/command-palette', v);
  }

  if (hasTag(v, ':app/library')) {
    return state.set(':db/library', v.value);
  }

  return state;
}

function detectArtistFilter(state, v) {
  if (!hasTag(v, ':app/cmd')) {
    return state;
  }

  var isCmdActivated = hasTag(state.get(':db/command-palette'), ':cmd/is-activated');
  var cmd = state.get(':db/cmd');

  if (!isCmdActivated) {
    return state;
  }

  if (cmd.indexOf(':artist') === -1) {
    return state.update(':db/context', function (ctx) {
      return omit(removeTag(ctx, ':context/filter-by-artist'), 'filter');
    });
  }

  var artist = cmd.slice(cmd.indexOf(':artist') + ':artist'.length).trim();

  return state.update(':db/context', function (ctx) {
    return merge(addTag(ctx, ':context/filter-by-artist'), {
      filter: {
        value: artist
      }
    });
  });
}

function detectAlbumFilter(state, v) {
  if (!hasTag(v, ':app/cmd')) {
    return state;
  }

  var isCmdActivated = hasTag(state.get(':db/command-palette'), ':cmd/is-activated');
  var cmd = state.get(':db/cmd');

  if (!isCmdActivated) {
    return state;
  }

  if (cmd.indexOf('#') === -1) {
    return state.update(':db/context', function (ctx) {
      return omit(removeTag(ctx, ':context/filter-by-tag'), 'filter');
    });
  }

  var tag = cmd.slice(cmd.indexOf('#') + 1).trim();

  return state.update(':db/context', function (ctx) {
    return merge(addTag(ctx, ':context/filter-by-tag'), {
      filter: {
        value: tag,
        tags: state.get(':db/tags')
      }
    });
  });
}

function detectTrackFilter(state, v) {
  if (!hasTag(v, ':app/cmd')) {
    return state;
  }

  var isCmdActivated = hasTag(state.get(':db/command-palette'), ':cmd/is-activated');
  var cmd = state.get(':db/cmd');

  if (!isCmdActivated) {
    return state;
  }

  if (cmd.indexOf(':track') === -1) {
    return state;
  }

  var track = cmd.slice(cmd.indexOf(':track') + ':track'.length).trim();

  if (!track) {
    return state.update(':db/context', function (ctx) {
      return omit(removeTag(ctx, ':context/filter-by-track'), 'filter');
    });
  }

  return state.update(':db/context', function (ctx) {
    return merge(addTag(ctx, ':context/filter-by-track'), {
      filter: {
        value: track
      }
    });
  });
}

function fallbackCmdToDefault(state, v) {
  if (!hasTag(v, ':app/command-palette')) {
    return state;
  }

  if (hasTag(v, ':cmd/is-activated')) {
    return state;
  }

  if (state.get(':db/cmd').trim()) {
    return state;
  }

  return state.set(':db/cmd', 'All tracks');
}

function embodyTracks(state, v) {
  if (hasTag(v, ':app/tracks')) {
    return state.set(':db/tracks', v.tracks);
  }

  if (hasTag(v, ':vk/tracks')) {
    var newTracks = v.tracks.reduce(function (result, track) {
      var t = Track.fromVk(track, state.get(':db/albums'));
      return result.set(t.id, t);
    }, Map().asMutable()).asImmutable();

    return state.update(':db/tracks', existingTracks => existingTracks.merge(newTracks));
  }

  return state;
}

function embodyAlbums(state, v) {
  if (hasTag(v, ':app/albums')) {
    return state.set(':db/albums', v.albums);
  }

  if (hasTag(v, ':vk/albums')) {
    var newAlbums = v.albums.reduce(function (result, track) {
      var t = Album.fromVk(track, state.get(':db/albums'));
      return result.set(t.id, t);
    }, Map().asMutable()).asImmutable();

    return state.update(':db/albums', existingAlbums => existingAlbums.merge(newAlbums));
  }

  return state;
}

function embodyTags(state, v) {
  if (hasTag(v, ':app/albums')) {
    var updatedTags = v.albums.map(x => x.title).toArray();
    var updatedTagIds = v.albums.map(x => x.id).toArray();

    return state
      .update(':db/tags', tags => union(tags, updatedTags))
      .update(':db/tracks', function (tracks) {
        return tracks.map(function (track) {
          var idx = updatedTagIds.indexOf(track.album);

          if (idx !== -1) {
            return merge(track, {
              audioTags: union(track.audioTags, updatedTags[idx])
            });
          }

          return track;
        });
      });
  }

  return state;
}

function setDefaultPlayerTracklist(state, v) {
  if (hasTag(v, ':app/tracks') || hasTag(v, ':vk/tracks') || hasTag(v, ':tracks/remove-outdated')) {
    return state.set(':db/library', createLibrary(state.get(':db/tracks')));
  }

  return state;
}

function createLibrary(db) {
  return db
    .toList()
    .sortBy(t => t.audio.index)
    .map(createTrackDescriptor)
    .toJS();
}

function createTrackDescriptor(track) {
  return {
    tag: ':track-source/library',
    trackId: track.id
  };
}

function pipeThroughReducers(...reducers) {
  return function (initialDbValue, v) {
    return reducers.reduce(function (dbVal, reducer) {
      return reducer(dbVal, v);
    }, initialDbValue);
  };
}

function removeOutdatedTracks(state, v) {
  if (hasTag(v, ':tracks/remove-outdated')) {
    return state.update(':db/tracks', (tracks) => {
      return v.ids.reduce((res, id) => res.remove(id), tracks);
    });
  }

  return state;
}

function toggleShuffle(state, v) {
  if (hasTag(v, ':library/toggle-shuffle')) {
    if (hasTag(state.get(':db/player'), ':player/is-shuffled')) {
      return state
        .set(':db/player', removeTag(state.get(':db/player'), ':player/is-shuffled'))
        .set(':db/library', state.get(':db/library-original'));
    } else {
      return state
        .set(':db/player', addTag(state.get(':db/player'), ':player/is-shuffled'))
        .set(':db/library-original', state.get(':db/library'))
        .set(':db/library', shuffleLibrary(state.get(':db/player'), state.get(':db/library')));
    }
  }

  return state;
}

function shuffleLibrary(player, library) {
  var t = {
    tag: ':track-source/library',
    trackId: player.track.id
  };

  return [t, ...shuffleArray(library.filter(t => t.trackId !== player.track.id))];
}

export default pipeThroughReducers(
  commonReducer,
  embodyTracks,
  removeOutdatedTracks,
  embodyAlbums,
  detectArtistFilter,
  // detectAlbumFilter,
  // detectTrackFilter,
  fallbackCmdToDefault,
  embodyTags,
  setDefaultPlayerTracklist,
  toggleShuffle
);
