var React = require('react/addons');
var Post = require('app/components/post');

var Newsfeed = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render: function() {
    var player = this.props.player;
    var owner = this.props.owner;

    var posts = this.props.newsfeed.posts.map(function(post) {
      return <Post post={post} owner={owner} player={player}></Post>;
    });

    return <div className='newsfeed'>{posts.toArray()}</div>
  }
});

module.exports = Newsfeed;
