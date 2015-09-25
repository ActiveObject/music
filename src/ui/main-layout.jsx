import 'app/styles/base.css';
import 'app/styles/theme.css';
import 'app/styles/track.css';
import 'app/styles/playlist.css';

import React from 'react/addons';
import db from 'app/db';
import onValue from 'app/fn/onValue';
import App from 'app/ui/app';
import Track from 'app/ui/track';

var PlaylistUI = React.createClass({
  render: function () {
    var tracks = this.props.tracks.slice(0, 10).map(function (track) {
      return <Track
        track={track}
        isPlaying={false}
        isActive={false}
      />
    });

    return (
      <div className='playlist'>
        <h3 className='playlist__header'>{this.props.name}</h3>
        <div className='playlist__content'>{tracks}</div>
        <div className='playlist__paginator'></div>
      </div>
    )
  }
})

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
