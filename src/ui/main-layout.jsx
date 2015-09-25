var React = require('react/addons');
var App = require('app/ui/app');
var db = require('app/db');
var onValue = require('app/fn/onValue');

var Track = require('app/ui/track');

require('app/styles/track.css');
require('app/styles/playlist.css');

var PlaylistUI = React.createClass({
  render: function () {
    var tracks = db.value.get(':db/tracks')
      .toList()
      .sortBy(t => t.audio.index)
      .slice(0, 10)
      .map(function (track) {
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
    return (
      <App>
        <PlaylistUI />
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

module.exports = updateOn(MainLayout, ':db/tracks');
