var hashCode = require('app/utils').hashCode;

function ActivityItem(date, news) {
  this.date = date;
  this.news = news;
}

ActivityItem.prototype.hashCode = function () {
  return 31 * hashCode(this.date) + 31 * hashCode(this.news);
};

ActivityItem.prototype.equals = function (other) {
  return this.date === other.date && this.news === other.news;
};

module.exports = ActivityItem;