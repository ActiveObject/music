var React = require('react');
var dom = require('app/core/dom');

var Newsfeed = React.createClass({
  render: function() {
    return dom.div().className('newsfeed').make();
  }
});

module.exports = Newsfeed;
