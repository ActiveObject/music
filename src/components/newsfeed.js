var React = require('react');
var dom = require('app/core/dom');
var Post = React.createFactory(require('app/components/post.jsx'));
var eventBus = require('app/core/event-bus');

var Newsfeed = React.createClass({
  displayName: 'Newsfeed',

  componentDidMount: function() {
    eventBus.push(this.props.newsfeed.load(0, 10));
  },

  shouldComponentUpdate: function(nextProps) {
    return nextProps.newsfeed !== this.props.newsfeed || nextProps.player !== this.props.player;
  },

  render: function() {
    var player = this.props.player;
    var owner = this.props.owner;

    var posts = this.props.newsfeed.posts.toJS().slice(0, 10).map(function(post) {
      return new Post({
        post: post,
        owner: owner,
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
