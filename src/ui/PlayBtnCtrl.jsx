import React from 'react';
import db from 'app/db';
import vbus from 'app/core/vbus';
import hasTag from 'app/fn/hasTag';
import updateOnKey from 'app/fn/updateOnKey';
import * as Player from 'app/values/player';
import PlayBtn from 'app/ui/PlayBtn';

var PlayBtnCtrl = React.createClass({
  render: function () {
    var isPlaying = hasTag(db.value.get(':db/player'), ':player/is-playing');

    return <PlayBtn isPlaying={isPlaying} togglePlay={this.togglePlay} />;
  },

  togglePlay: function () {
    vbus.emit(Player.togglePlay(db.value.get(':db/player')));
  }
})

export default updateOnKey(PlayBtnCtrl, ':db/player');