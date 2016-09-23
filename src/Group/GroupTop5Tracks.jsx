import React from 'react';
import { connect } from 'react-redux';

import vk from 'app/shared/vk';
import { fromVk } from 'app/shared/Track';
import merge from 'app/shared/merge';
import StaticTracklist from 'app/shared/tracklist/StaticTracklist';
import TracklistTable from 'app/shared/tracklist/TracklistTable';
import TracklistPreview from 'app/shared/tracklist/TracklistPreview';

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
  if (Array.isArray(post.copy_history)) {
    return post.copy_history.some(hasAudio);
  }

  return post.attachments && post.attachments.some(a => a.type === 'audio');
}

function top5(posts) {
  return posts
    .filter(hasAudio)
    .sort((postA, postB) => postB.likes.count - postA.likes.count)
    .slice(0, 5);
}

function topAudios(posts) {
  var audios = [];

  posts.forEach(function (post) {
    if (Array.isArray(post.copy_history)) {
      audios.push(...topAudios(post.copy_history));
    } else {
      post.attachments.forEach(function (attachment) {
        if (attachment.type === 'audio') {
          audios.push(attachment.audio);
        }
      });
    }
  });

  return audios;
}

let TopTracks = ({ posts, albums }) => {
  var tracks = topAudios(top5(posts))
    .map(x => fromVk(x, albums))
    .map((x, i) => merge(x, { audio: merge(x.audio, { index: i })}))
    .slice(0, 5);

  return <StaticTracklist tracks={tracks} />;
}

TopTracks = connect(state => ({ albums: state.albums }))(TopTracks);

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
