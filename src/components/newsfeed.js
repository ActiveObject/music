var React = require('react');
var dom = require('app/core/dom');
var Post = require('app/components/post');
var eventBus = require('app/core/event-bus');

var Newsfeed = React.createClass({
  displayName: 'Newsfeed',

  componentDidMount: function() {
    eventBus.push(this.props.newsfeed.load(0, 10));
  },

  render: function() {
    var player = this.props.player;

    var posts = this.props.newsfeed.posts.toJS().map(function(post) {
      return new Post({
        post: post,
        player: player
      });
    });

    return dom.div()
      .className('newsfeed')
      .append(posts)
      .make();
  }
});

module.exports = Newsfeed;
