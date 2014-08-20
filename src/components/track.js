var React = require('react');
var moment = require('moment');
var Immutable = require('immutable');
var PlayBtn = require('app/components/play-btn');
var dom = require('app/core/dom');

require('moment-duration-format');

module.exports = React.createClass({
  displayName: 'Track',

  shouldComponentUpdate: function (nextProps) {
    return nextProps.track !== this.props.track || nextProps.activeTrack !== this.props.activeTrack;
  },

  render: function() {
    var isActive = this.props.track.get('id') === this.props.activeTrack.get('id');
    var isPlaying = isActive && this.props.activeTrack.get('isPlaying', false);

    var playBtn = new PlayBtn({
      key: 'play-btn',
      isPlaying: isPlaying,
      isActive: isActive,
      onClick: this.togglePlay
    });

    var title = dom.div()
      .key('title')
      .className('tracklist-item-title')
      .append(this.props.track.get('title'));

    var artist = dom.div()
      .key('artist')
      .className('tracklist-item-artist')
      .append(this.props.track.get('artist'));

    var duration = dom.span()
      .key('duration')
      .className('track-duration')
      .append(moment.duration(this.props.track.get('duration'), 's').format('mm:ss'));

    var desc = dom.div()
      .key('desc')
      .className('tracklist-item-desc')
      .attr('title', [this.props.track.get('artist'), this.props.track.get('title')].join(' - '))
      .append(artist, title);

    return dom.div()
      .className('tracklist-item')
      .append(playBtn, desc, duration)
      .make();
  },

  togglePlay: function () {
    var track = Immutable.fromJS(this.props.track);

    this.props.cursor.activeTrack(function (activeTrack, update) {
      if (track.get('id') !== activeTrack.get('id')) {
        return update(track.set('isPlaying', true));
      }

      return update(activeTrack.set('isPlaying', !activeTrack.get('isPlaying')));
    });
  }
});