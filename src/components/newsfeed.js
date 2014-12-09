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
    var posts = this.props.newsfeed.posts.toJS().map(function(post) {
      return new Post({ post: post });
    });

    return dom.div()
      .className('newsfeed')
      .append(posts)
      .make();
  }
});

module.exports = Newsfeed;
