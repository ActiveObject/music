var Atom = require('app/core/atom');
var db = require('app/core/db');
var tagOf = require('app/utils/tagOf');
var player = require('app/values/player');
var Tracklist = require('app/components/tracklist');

var PlaylistView = React.createClass({
  getInitialState: function () {
    this.player = new Atom(player);

    return {
      player: Atom.value(this.player)
    };
  },

  componentWillMount: function () {
    this.uninstallPlayer = db.install(this.player, (acc, v) => tagOf(v) === ':app/player' ? v : acc);
    this.unsub = Atom.listen(this.player, v => this.setState({ player: v }));
  },

  componentWillUnmount: function () {
    this.uninstallPlayer();
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
