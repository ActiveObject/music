import { Map } from 'immutable';
import omit from 'lodash/omit';
import union from 'lodash/union';
import shuffleArray from 'lodash/shuffle';
import { hasTag, addTag, removeTag } from 'app/shared/Tag';
import merge from 'app/shared/merge';
import Track from 'app/shared/Track';
import Album from 'app/shared/Album';

function commonReducer(state, v) {
  if (hasTag(v, ':app/player')) {
    return state.set(':db/player', v);
  }

  if (hasTag(v, ':app/user')) {
    return state.set(':db/user', v);
  }

  if (hasTag(v, ':app/library')) {
    return state.set(':db/library', v.value);
  }

  if (hasTag(v, ':app/groups')) {
    return state.set(':db/groups', v.value);
  }

  return state;
}

function toggleShuffle(state, v) {
  if (hasTag(v, ':library/toggle-shuffle')) {
    if (hasTag(state.get(':db/player'), ':player/is-shuffled')) {
      return state
        .set(':db/player', removeTag(state.get(':db/player'), ':player/is-shuffled'))
        .remove(':db/shuffled-library');
    } else {
      return state
        .set(':db/player', addTag(state.get(':db/player'), ':player/is-shuffled'))
        .set(':db/shuffled-library', shuffleLibrary(state.get(':db/player'), state.get(':db/library')));
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

function pipeThroughReducers(...reducers) {
  return function (initialDbValue, v) {
    return reducers.reduce(function (dbVal, reducer) {
      return reducer(dbVal, v);
    }, initialDbValue);
  };
}

export default pipeThroughReducers(
  commonReducer,
  toggleShuffle
);
