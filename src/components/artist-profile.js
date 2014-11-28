var React = require('react');
var IScroll = require('iscroll');
var dom = require('app/core/dom');
var Tracklist = require('app/components/tracklist');

module.exports = React.createClass({
  displayName: 'ArtistProfile',

  componentDidMount: function() {
    this.scroll = new IScroll(this.refs.view.getDOMNode(), {
      mouseWheel: true,
      scrollX: false
    });
  },

  componentDidUpdate: function () {
    this.scroll.refresh();
  },

  render: function () {
    var tracklist = new Tracklist({
      player: this.props.player,
      playlist: this.props.library.playlistForArtist(this.props.artist)
    });

    var container = dom.div()
      .className('main-container')
      .append(this.props.artist, tracklist);

    return dom.div()
      .className('main-view artist-profile')
      .attr('ref', 'view')
      .append(container)
      .make();
  }
});
