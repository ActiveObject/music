function VkChunk(offset, count) {
  this.offset = offset;
  this.count = count;
}

VkChunk.is = function (x) {
  return x instanceof VkChunk;
};

VkChunk.prototype.next = function (amount) {
  return new VkChunk(this.offset + this.count, amount);
};

module.exports = VkChunk;