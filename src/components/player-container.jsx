var React = require('react');
var Atom = require('app/core/atom');
var PlayerStore = require('app/stores/player-store');
var Player = require('app/components/player');

var PlayerContainer = React.createClass({
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
    return <Player player={this.state.player} />;
  }
});

module.exports = PlayerContainer;
