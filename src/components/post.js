var React = require('react');
var dom = require('app/core/dom');
var Tracklist = React.createFactory(require('app/components/tracklist'));

var Post = React.createClass({
  displayName: 'Post',

  render: function() {
    var header = dom.header().append(this.props.post.text);

    var tracklist = new Tracklist({
      player: this.props.player,
      playlist: this.props.post.playlist()
    });

    return dom.div()
      .className('post')
      .append(header, tracklist)
      .make();
  }
});

module.exports = Post;
