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
  this.owner = attrs.owner;
  this.offset = attrs.offset;
  this.count = attrs.count;
}

NewsfeedLoader.prototype.go = function(input, output) {
  input.onValue(function(msg) {
    vk.wall.get({
      owner_id: msg.owner,
      offset: msg.offset,
      count: msg.count
    }, function(err, res) {
      if (err) {
        return output.error(err);
      }

      output.emit(newsfeed.fromVkResponse(res.response));
    });
  });

  chunkify(2, this.offset, this.count).forEach(function (v) {
    input.emit(merge(v, { owner: this.owner }));
  }, this);
};

NewsfeedLoader.prototype.toString = function() {
  return 'NewsfeedLoader(' + this.owner + ', ' + this.offset + ':' + this.count + ')';
};

module.exports = NewsfeedLoader;
