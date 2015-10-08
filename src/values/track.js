import merge from 'app/fn/merge';

export function fromVk(data) {
  return {
    id: String(data.id),
    owner: data.owner_id,
    album: data.album_id,
    audio: {
      artist: data.artist,
      title: data.title,
      duration: data.duration,
      index: data.index,
      url: data.url
    }
  };
};
