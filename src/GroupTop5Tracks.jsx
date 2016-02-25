import React from 'react';
import app from 'app';
import vk from 'app/vk';
import { fromVk } from 'app/Track';
import merge from 'app/merge';
import StaticTracklist from 'app/tracklist/StaticTracklist';
import TracklistTable from 'app/tracklist/TracklistTable';
import TracklistPreview from 'app/tracklist/TracklistPreview';

function loadLastWeekPosts(ownerId, offset, count, postsSoFar, time, callback) {
  vk.wall.get({
    owner_id: ownerId,
    offset,
    count
  }, (err, res) => {
    if (err) {
      return callback(err);
    }

    var posts = res.response.items.filter(post => post.date * 1000 >= time);

    if (posts.length < res.response.items.length) {
      return callback(null, postsSoFar.concat(posts))
    }

    loadLastWeekPosts(ownerId, offset + count, count, postsSoFar.concat(posts), time, callback);
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

let TopTracks = ({ posts }) => {
  var tracks = topAudios(top5(posts))
    .map(x => fromVk(x, app.value.get(':db/albums')))
    .map((x, i) => merge(x, { audio: merge(x.audio, { index: i })}))
    .slice(0, 5);

  return <StaticTracklist tracks={tracks} />;
}

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

    loadLastWeekPosts(-this.props.groupId, 0, 7 * 5, [], Date.now() - 7 * 24 * 60 * 60 * 1000, (err, posts) => {
      if (err) {
        return console.log(err);
      }

      this.setState({ isLoading: false, posts });
    });
  }

  render() {
    return (
      <TracklistTable>
        <TracklistPreview isActive={this.state.isLoading} numOfItems={5}>
          <TopTracks posts={this.state.posts} />
        </TracklistPreview>
      </TracklistTable>
    );
  }
}

export default GroupTop5Tracks;
