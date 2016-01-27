import React from 'react';
import app from 'app';
import vk from 'app/vk';
import {difference} from 'underscore';
import merge from 'app/merge';

class VkIndexerDriver extends React.Component {
  componentWillMount() {
    this.stopUpdating = startTrackUpdating(2 * 60 * 1000);
  }

  render() {
    return <div />;
  }
}

function loadAllAudioIds(owner, callback) {
  vk.execute({
    code: `
      return API.audio.get({ owner_id: ${owner} }).items@.id;
    `
  }, callback);
}

function loadTracksById(items, callback) {
  vk.audio.getById({
    audios: items.map(({ owner, id }) => `${owner}_${id}`).join(',')
  }, callback);
}

function chunkify(items, itemsPerGroup) {
  if (items.length < itemsPerGroup) {
    return [items];
  }

  return [items.slice(0, itemsPerGroup), ...chunkify(items.slice(itemsPerGroup), itemsPerGroup)];
}

function startTrackUpdating(interval) {
  var timer = null;

  function next() {
    updateTracks();
    timer = setTimeout(() => next(), interval);
  }

  next();

  return function () {
    clearTimeout(timer);
  };
}

function updateTracks() {
  console.log('updateTracks');
  var user = app.value.get(':db/user');

  loadAllAudioIds(user.id, (err, res) => {
    if (err) {
      return console.log(err);
    }

    var tracks = app.value.get(':db/tracks');
    var existingIds = [...tracks.keys()];
    var updatedIds = res.response.map(String);
    var outdatedTrackIds = difference(existingIds, updatedIds);
    var newTrackIds = difference(updatedIds, existingIds);
    var itemsToLoad = newTrackIds.map(tid => ({ owner: user.id, id: tid }));

    console.log('new tracks', newTrackIds);
    console.log('outdated tracks', outdatedTrackIds);

    if (itemsToLoad.length > 0) {
      chunkify(itemsToLoad, 100).forEach(itemsGroup => {
        loadTracksById(itemsGroup, (err, res) => {
          if (err) {
            return console.log(err);
          }

          app.push({
            tag: ':vk/tracks',
            tracks: res.response.map(data => {
              return merge(data, {
                index: updatedIds.indexOf(String(data.id))
              });
            })
          });
        });
      });
    }
  });
}

export default VkIndexerDriver;
