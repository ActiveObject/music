var React = require('react');
var dom = require('app/core/dom');

var Post = React.createClass({
  displayName: 'Post',

  render: function() {
    var header = dom.header().append(this.props.post.text);

    return dom.div()
      .className('post')
      .append(header)
      .make();
  }
});

module.exports = Post;
