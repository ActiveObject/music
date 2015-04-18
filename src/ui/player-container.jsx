var React = require('react');
var Atom = require('app/core/atom');
var player = require('app/db/player');
var Player = require('app/ui/player');

var PlayerContainer = React.createClass({
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
    return <Player player={this.state.player} />;
  }
});

module.exports = PlayerContainer;
