var React = require('react/addons');
var Post = require('app/ui/post');

var Newsfeed = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render: function() {
    var player = this.props.player;
    var owner = this.props.owner;

    var posts = this.props.newsfeed.posts.map(function(post) {
      return <Post post={post} owner={owner} player={player} />;
    });

    return <div className='newsfeed'>{posts}</div>
  }
});

module.exports = Newsfeed;
