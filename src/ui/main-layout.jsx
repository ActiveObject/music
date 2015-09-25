import 'app/styles/base.css';
import 'app/styles/theme.css';
import 'app/styles/track.css';
import 'app/styles/playlist.css';

import React from 'react/addons';
import db from 'app/db';
import vbus from 'app/core/vbus';
import onValue from 'app/fn/onValue';
import * as Player from 'app/values/player';
import App from 'app/ui/app';
import Track from 'app/ui/track';
import IScrollLayer from 'app/ui/iscroll-layer';
import hasTag from 'app/fn/hasTag';

var PlaylistUI = updateOn(React.createClass({
  render: function () {
    var player = db.value.get(':db/player');
    var rows = this.props.tracks.slice(0, 100).map(function (track) {
      var isActive = track.id === player.track.id;
      var isPlaying = isActive && hasTag(player, ':player/is-playing');

      return <Track
        track={track}
        isPlaying={isActive}
        isActive={isPlaying}
        onTogglePlay={this.togglePlay}
      />
    }, this);

    return (
      <div className='playlist'>
        <div className='playlist__header'>{this.props.name}</div>
        <div className='playlist__content'>
          <div className='playlist__columns'>
            <div className='track__index'>#</div>
            <div className='track__artist'>artist</div>
            <div className='track__title'>title</div>
            <div className='track__duration'>time</div>
          </div>
          <div className='playlist__table'>
            <IScrollLayer>{rows}</IScrollLayer>
          </div>
        </div>
        <div className='playlist__paginator'></div>
      </div>
    )
  },

  togglePlay: function (track) {
    vbus.emit(Player.togglePlay(db.value.get(':db/player'), track));
  }
}), ':db/player');

var MainLayout = React.createClass({
  render: function() {
    var tracks = db.value.get(':db/tracks')
      .toList()
      .sortBy(t => t.audio.index);

    return (
      <App>
        <PlaylistUI name='All tracks' tracks={tracks} />
      </App>
    );
  }
});

function updateOn(ComposedComponent, dbKey) {
  return React.createClass({
    componentDidMount: function () {
      var stream = db.changes.map(v => v.get(dbKey)).skipDuplicates();
      this.unsub = onValue(stream, () => this.forceUpdate());
    },

    componentWillUnmount: function () {
      this.unsub();
    },

    render: function () {
      return <ComposedComponent {...this.props} />;
    }
  });
}

export default updateOn(MainLayout, ':db/tracks');
