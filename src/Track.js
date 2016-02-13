import merge from 'app/merge';

export function fromVk(data, existingAlbums) {
  var albumIds = existingAlbums.map(v => v.id).toArray();
  var albumNames = existingAlbums.map(v => v.title).toArray();
  var idx = albumIds.indexOf(data.album_id);
  var audioTags = idx !== -1 ? [albumNames[idx]] : [];

  return {
    id: String(data.id),
    owner: data.owner_id,
    album: data.album_id,
    audioTags: audioTags,
    artist: data.artist,
    title: data.title,
    duration: data.duration,
    url: data.url
  };
};
