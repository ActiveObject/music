var hashCode = require('app/utils/hashCode');

function NewsfeedActivity(attrs) {
  this.id = attrs.id;
  this.date = attrs.date;
  this.owner = attrs.owner;
}

NewsfeedActivity.prototype.hashCode = function () {
  return hashCode(this.id);
};

NewsfeedActivity.prototype.equals = function (other) {
  return this.id === other.id;
};

NewsfeedActivity.prototype.toString = function () {
  return 'NewsfeedActivity(' + this.id + ')';
};

module.exports = NewsfeedActivity;
