var React = require('react');
var _ = require('underscore');
var dom = require('app/core/dom');
var Track = require('app/components/track');

function print(shouldUpdate) {
  console.log('Tracklist shouldUpdate: ', shouldUpdate);
  return shouldUpdate;
}

module.exports = React.createClass({
  displayName: 'Tracklist',

  getInitialState: function () {
    return {
      visible: [0, 400]
    };
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return print(nextProps.tracks !== this.props.tracks || !_.isEqual(this.state, nextState));
  },

  render: function() {
    var tracks = this.props.tracks
      .slice(this.state.visible[0], this.state.visible[1])
      .map(function (track) {
        return new Track({
          key: track.get('id'),
          track: track.toJS(),
          activeTrack: this.props.cursor.activeTrack
        });
      }, this)
      .toJS();

    return dom.div()
      .append(tracks)
      .make();
  }
});