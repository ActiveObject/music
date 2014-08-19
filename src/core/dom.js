var _ = require('underscore');
var React = require('react');
var _  = require('underscore');

function Element(tagName, constructor, attrs, body) {
  this.tagName = tagName;
  this.constructor = constructor;
  this.attrs = attrs;
  this.body = body;
}

Element.prototype.create = function (tagName, ctr, attrs, body) {
  return new Element(tagName, ctr, attrs, body);
};

Element.prototype.attr = function (name, value) {
  var newAttr = {};
  newAttr[name] = value;
  var attrs = _.extend({}, this.attrs, newAttr);
  return this.create(this.tagName, this.constructor, attrs, this.body);
};

Element.prototype.className = function (name, predicate) {
  if (_.isBoolean(predicate) && !predicate) {
    return this;
  }

  if (_.isBoolean(predicate) && predicate) {
    var cn = this.attrs.className;

    if (_.isString(cn)) {
      return this.attr('className', cn.split(' ').concat(name).join(' '));
    }

    return this.attr('className', name);
  }

  return this.attr('className', name);
};

Element.prototype.key = function (key) {
  return this.attr('key', key);
};

Element.prototype.append = function (items) {
  if (!_.isArray(items)) {
    items = Array.prototype.slice.call(arguments, 0);
  }

  return this.create(this.tagName, this.constructor, this.attrs, this.body.concat(items));
};

Element.prototype.make = function () {
  if (this.body.length === 0) {
    return this.constructor(this.attrs);
  }

  if (this.body.length === 1) {
    var body = this.body[0] instanceof Element ? this.body[0].make() : this.body[0];
    return this.constructor(this.attrs, body);
  }

  return this.constructor(this.attrs, this.body.map(function (el) {
    return el instanceof Element ? el.make() : el;
  }));
};

_.keys(React.DOM).forEach(function (el) {
  exports[el] = function () {
    return new Element(el, React.DOM[el], {}, []);
  };
});