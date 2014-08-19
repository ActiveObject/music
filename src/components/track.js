var React = require('react');
var dom = React.DOM;

module.exports = React.createClass({
  displayName: 'track',

  render: function() {
    var title = dom.div({ key: 'title', className: 'tracklist-item-title' }, this.props.track.title);
    var artist = dom.div({ key: 'artist', className: 'tracklist-item-artist' }, this.props.track.artist);

    var icon = dom.svg({
      className: 'icon',
      dangerouslySetInnerHTML: {
        __html: '<use xlink:href="#shape-iconmonstr-arrow-37-icon"></use>'
      }
    });

    var playBtn = dom.div({ key: 'play-btn', className: 'play-btn' }, icon);
    var desc = dom.div({ key: 'desc', className: 'tracklist-item-desc' }, [artist, title]);

    return dom.div({ className: 'tracklist-item' }, [playBtn, desc]);
  }
});