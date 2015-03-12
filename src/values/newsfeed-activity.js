var hashCode = require('app/utils/hashCode');

function NewsfeedActivity(attrs) {
  this.id = attrs.id;
  this.date = attrs.date;
  this.owner = attrs.owner;
}

NewsfeedActivity.fromTransit = function (v) {
  return new NewsfeedActivity(v);
};

NewsfeedActivity.prototype.toJSON = function () {
  return {
    'app/values/newsfeed-activity': {
      id: this.id,
      date: this.date,
      owner: this.owner
    }
  };
};

NewsfeedActivity.prototype.transitTag = 'app-value';

NewsfeedActivity.prototype.tag = function () {
  return 'newsfeed-activity';
};

NewsfeedActivity.prototype.rep = function() {
  return this.toJSON()['app/values/newsfeed-activity'];
};

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
