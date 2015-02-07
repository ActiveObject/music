var React = require('react');
var IScroll = require('iscroll');
var Tracklist = require('app/components/tracklist');

var ArtistProfile = React.createClass({
  componentDidMount: function() {
    this.scroll = new IScroll(this.refs.view.getDOMNode(), {
      mouseWheel: true,
      scrollX: false
    });
  },

  componentDidUpdate: function () {
    this.scroll.refresh();
  },

  render: function () {
    return (
      <div className='main-view artist-profile' ref='view'>
        <div className='main-container'>
          {this.props.artist}
          <Tracklist player={this.props.player} tracklist={this.props.tracklist}></Tracklist>
        </div>
      </div>
    );
  }
});

module.exports = ArtistProfile;