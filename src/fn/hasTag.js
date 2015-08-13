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

export default function hasTag(x, desiredTag) {
  var tag = tagOf(x);
  var tags = Array.isArray(tag) ? tag : [tag];
  var desiredTags = Array.isArray(desiredTag) ? desiredTag : [desiredTag];
  return desiredTags.every(t => tags.indexOf(t) !== -1);
}