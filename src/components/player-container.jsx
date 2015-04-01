var React = require('react');
var Atom = require('app/core/atom');
var db = require('app/core/db');
var tagOf = require('app/utils/tagOf');
var player = require('app/db/player');
var Player = require('app/components/player');

var PlayerContainer = React.createClass({
  getInitialState: function () {
    return {
      player: Atom.value(player)
    };
  },

  componentWillMount: function () {
    this.uninstallPlayer = db.install(player, (acc, v) => tagOf(v) === ':app/player' ? v : acc);
    this.unsub = Atom.listen(player, v => this.setState({ player: v }));
  },

  componentWillUnmount: function () {
    this.uninstallPlayer();
    this.unsub();
  },

  render: function() {
    return <Player player={this.state.player} />;
  }
});

module.exports = PlayerContainer;
