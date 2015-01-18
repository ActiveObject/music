var Atom = require('app/core/atom');
var vk = require('app/vk');
var merge = require('app/utils/merge');
var newsfeed = require('app/values/newsfeed');

function chunkify(size, offset, count) {
  if (size <= 0) {
    throw new Error('chunk size should be a positive number, but given ' + size);
  }

  var result = [];
  var total = offset + count;

  do {
    result.push({
      offset: offset,
      count: (total - offset) >= size ? size : total - offset
    });
  } while((offset += size) < total);

  return result;
}

function NewsfeedLoader(attrs, inbox) {
  this.atom = new Atom(newsfeed);

  this.inbox = chunkify(2, attrs.offset, attrs.count).map(function (v) {
    return merge(v, { owner: attrs.owner });
  });
}

NewsfeedLoader.prototype.process = function () {
  if (this.inbox.length === 0) {
    return this.release();
  }

  var that = this;

  this.load(this.inbox[0], function (err, data) {
    if (err) {
      return console.log(err);
    }

    Atom.update(that, v => v.merge(newsfeed.fromVkResponse(data)));
    that.inbox.shift();
    that.process();
  });
};

NewsfeedLoader.prototype.load = function (req, callback) {
  vk.wall.get({
    owner_id: req.owner,
    offset: req.offset,
    count: req.count
  }, function(err, res) {
    if (err) {
      return callback(err);
    }

    callback(null, merge(res.response, { offset: req.offset }));
  });
};

NewsfeedLoader.prototype.release = function () {
  Atom.off(this);
};

module.exports = NewsfeedLoader;