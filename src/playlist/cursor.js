var _ = require('underscore');

function getOrDefault(obj, key, defaultValue) {
  return _.has(obj, key) ? obj[key] : defaultValue;
}

function range(page, pageSize, direction) {
  if (direction === 0) {
    return [(page - 3) * pageSize, (page + 3) * pageSize];
  }

  if (direction < 0) {
    return [(page - 3) * pageSize, (page + 5) * pageSize];
  }

  if (direction > 0) {
    return [(page - 5) * pageSize, (page + 4) * pageSize];
  }
}

function Cursor(items, options) {
  this.items = items;
  this.pageSize = options.pageSize;
  this.itemHeight = options.itemHeight;

  this.direction = getOrDefault(options, 'direction', 0);
  this.position = getOrDefault(options, 'position', 0);
}

Cursor.prototype.modify = function (items, attrs) {
  return new Cursor(items, _.extend({}, _.omit(this, 'items'), attrs));
};

Cursor.prototype.updatePosition = function (pos) {
  return this.modify(this.items, {
    position: pos,
    direction: pos - this.position
  });
};

Cursor.prototype.updateItems = function (newItems) {
  return this.modify(newItems, {
    position: newItems.length * this.itemHeight > Math.abs(this.position) ? this.position : 0
  });
};

Cursor.prototype.selection = function () {
  var r = this.range(),
      itemHeight = this.itemHeight;

  return this.items.slice(r[0], r[1]).map(function (item, i) {
    return {
      yOffset: (i + r[0]) * itemHeight,
      value: item
    };
  });
};

Cursor.prototype.range = function () {
  var pageSize = this.pageSize,
      direction = this.direction,
      itemHeight = this.itemHeight;

  if (this.position >= 0) {
    return [0, pageSize * 4];
  }

  var itemA = (-this.position / itemHeight) | 0,
      page = itemA / pageSize | 0,
      itemR = itemA % pageSize,
      r = range(page, pageSize, direction);

  if (r[0] < 0) {
    return [0, r[1]];
  }

  if (r[1] > this.items.length) {
    return [r[0], this.items.length];
  }

  return r;
};

Cursor.prototype.page = function () {
  return Math.abs(Math.floor(this.position / (this.itemHeight * this.pageSize)));
};

module.exports = Cursor;