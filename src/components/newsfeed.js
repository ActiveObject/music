var React = require('react');
var dom = require('app/core/dom');
var Post = React.createFactory(require('app/components/post.jsx'));

var Newsfeed = React.createClass({
  displayName: 'Newsfeed',

  shouldComponentUpdate: function(nextProps) {
    return nextProps.newsfeed !== this.props.newsfeed || nextProps.player !== this.props.player;
  },

  render: function() {
    var player = this.props.player;
    var owner = this.props.owner;

    var posts = this.props.newsfeed.posts.map(function(post) {
      return new Post({
        post: post,
        owner: owner,
        player: player
      });
    });

    return dom.div()
      .className('newsfeed')
      .append(posts.toArray())
      .make();
  }
});

module.exports = Newsfeed;
