var React = require('react');

module.exports = React.createClass({
  render: function () {
    var link = React.DOM.a({
      href: this.props.url
    }, 'Authenticate with vk');

    return React.DOM.div({ className: 'auth-vk' }, link);
  }
});