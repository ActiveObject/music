var Atom = require('app/core/atom');
var PlayerStore = require('app/stores/player-store');
var Tracklist = require('app/components/tracklist');

var PlaylistView = React.createClass({
  getInitialState: function () {
    return {
      player: PlayerStore.value
    };
  },

  componentWillMount: function () {
    this.unsub = Atom.listen(PlayerStore, v => this.setState({ player: v }));
  },

  componentWillUnmount: function () {
    this.unsub();
  },

  render: function() {
    return (
      <div className='playlist'>
        <h3>{this.props.value.name}</h3>
        <Tracklist player={this.state.player} tracklist={this.props.value} />
      </div>
    );
  }
});

module.exports = PlaylistView;
