import merge from 'app/fn/merge';

export default function toggleTag(x, tag) {
  if (typeof x !== 'object' || x === null) {
    throw new TypeError('addTag does not support non-object values');
  }

  if (!x.tag) {
    return merge(x, {
      tag: [tag]
    });
  }

  if (Array.isArray(x.tag)) {
    if (x.tag.indexOf(tag) === -1) {
      return merge(x, {
        tag: x.tag.concat(tag)
      });
    }

    return merge(x, {
      tag: x.tag.filter(t => t !== tag)
    });
  }

  return merge(x, {
    tag: x.tag === tag ? [] : [tag]
  });
}