import merge from 'app/fn/merge';

export default function removeTag(x, tag) {
  if (typeof x !== 'object' || x === null) {
    throw new TypeError('addTag does not support non-object values');
  }

  if (!x.tag) {
    return x;
  }

  if (Array.isArray(x.tag)) {
    return merge(x, {
      tag: x.tag.filter(t => t !== tag)
    });
  }

  return merge(x, {
    tag: []
  });
}
