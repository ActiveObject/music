require('app/styles/post.styl');

var React = require('react');
var Tracklist = require('app/components/tracklist');

var PostHeader = React.createClass({
  render: function() {
    return (
      <header>
        <div className='post-owner-icon'>
          <img src={this.props.owner.photo_50}></img>
        </div>
        <div className='post-owner-name'>{this.props.owner.name}</div>
        <span className='post-text'>{this.props.text.split('\n').map(function (t) { return <div>{t}</div>; } )}</span>
      </header>
    );
  }
});

var PostImage = React.createClass({
  render: function() {
    return (
      <div className='post-image'>{this.props.photo ? <img src={this.props.photo.photo_604}></img> : null}</div>
    );
  }
});

var Post = React.createClass({
  render: function() {
    return (
      <div className='post'>
        <PostHeader text={this.props.post.text} owner={this.props.owner}></PostHeader>
        <PostImage photo={this.props.post.primaryImage()}></PostImage>
        <Tracklist player={this.props.player} tracklist={this.props.post.tracklist()}></Tracklist>
      </div>
    );
  }
});

module.exports = Post;
