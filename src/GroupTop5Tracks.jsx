import React from 'react';
import { List } from 'immutable';
import app from 'app';
import vk from 'app/vk';
import { fromVk } from 'app/Track';
import TrackCtrl from 'app/playlist/TrackCtrl';
import merge from 'app/merge';
import './TracklistPreview.css';

function loadLastWeekPosts(domain, offset, count, postsSoFar, time, callback) {
  vk.wall.get({
    domain: domain,
    offset: offset,
    count: count
  }, (err, res) => {
    if (err) {
      return callback(err);
    }

    var posts = res.response.items.filter(post => post.date * 1000 >= time);

    if (posts.length < res.response.items.length) {
      return callback(null, postsSoFar.concat(posts))
    }

    loadLastWeekPosts(domain, offset + count, count, postsSoFar.concat(posts), time, callback);
  });
}

function hasAudio(post) {
  return post.attachments && post.attachments.some(a => a.type === 'audio');
}

function top5(posts) {
  return posts
    .filter(hasAudio)
    .sort(function (postA, postB) {
      return postB.likes.count - postA.likes.count;
    })
    .slice(0, 5);
}

function topAudios(posts) {
  var audios = [];

  posts.forEach(function (post) {
    post.attachments.forEach(function (attachment) {
      if (attachment.type === 'audio') {
        audios.push(attachment.audio);
      }
    });
  });

  return audios;
}

var TrackPreview = () => (
  <div className='trackpreview'>
    <div className='trackpreview__order'>
      <div className='trackpreview__block' style={{ width: 10 }}></div>
    </div>
    <div className='trackpreview__artist'>
      <div className='trackpreview__block' style={{ width: 100 }}></div>
    </div>
    <div className='trackpreview__title'>
      <div className='trackpreview__block' style={{ width: 200 }}></div>
    </div>
    <div className='trackpreview__time'>
      <div className='trackpreview__block' style={{ width: 40 }}></div>
    </div>
  </div>
)

var TracklistPreview = () => (
  <div>
    <TrackPreview />
    <TrackPreview />
    <TrackPreview />
    <TrackPreview />
    <TrackPreview />
  </div>
)

const Tracklist = ({ tracks, limit }) =>
  <div>
    {tracks.slice(0, limit).map(t => <TrackCtrl key={t.id} track={t} tracklist={tracks} />)}
  </div>

class GroupTop5Tracks extends React.Component {
  constructor() {
    super();

    this.state = {
      isLoading: false,
      posts: []
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    loadLastWeekPosts(this.props.group, 0, 100, [], Date.now() - 7 * 24 * 60 * 60 * 10000, (err, posts) => {
      if (err) {
        return console.log(err);
      }

      this.setState({
        isLoading: false,
        posts: posts
      });
    });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div style={{ height: 200 }}>
          <TracklistPreview />
        </div>
      );
    }

    var tracks = List(topAudios(top5(this.state.posts))
        .map(x => fromVk(x, app.value.get(':db/albums')))
        .map((x, i) => merge(x, { audio: merge(x.audio, { index: i })}))
    );

    return <Tracklist tracks={tracks} limit={5} />;
  }
}

export default GroupTop5Tracks;
