var Atom = require('app/core/atom');
var player = require('app/db/player');
var Tracklist = require('app/ui/tracklist');

var PlaylistView = React.createClass({
  getInitialState: function () {
    return {
      player: Atom.value(player)
    };
  },

  componentWillMount: function () {
    this.unsub = Atom.listen(player, v => this.setState({ player: v }));
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
