import merge from 'app/merge';

export default { hasTag, addTag, removeTag, toggleTag };

export function hasTag(x, desiredTag) {
  var tag = tagOf(x);
  var tags = Array.isArray(tag) ? tag : [tag];
  var desiredTags = Array.isArray(desiredTag) ? desiredTag : [desiredTag];
  return desiredTags.every(t => tags.indexOf(t) !== -1);
}

export function addTag(x, tag) {
  if (typeof x !== 'object' || x === null) {
    throw new TypeError('addTag does not support non-object values');
  }

  if (!x.tag) {
    return merge(x, { tag: tag });
  }

  if (Array.isArray(x.tag)) {
    return merge(x, {
      tag: x.tag.filter(t => t !== tag).concat(tag)
    });
  }

  return merge(x, {
    tag: [x.tag, tag]
  });
}

export function removeTag(x, tag) {
  if (typeof x !== 'object' || x === null) {
    throw new TypeError('removeTag does not support non-object values');
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

export function toggleTag(x, tag) {
  if (typeof x !== 'object' || x === null) {
    throw new TypeError('toggleTag does not support non-object values');
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

function tagOf(v) {
  if (Array.isArray(v)) {
    return v[0];
  }

  if (typeof v.tag === 'function') {
    return v.tag();
  }

  if (v.tag) {
    return v.tag;
  }
}
