require('app/styles/auth.styl');
require('app/styles/element.styl');

var React = require('react');
var dom = require('app/core/dom');
var Icon = require('app/components/icon');

module.exports = React.createClass({
  displayName: 'Auth',

  render: function () {
    var vkIcon = new Icon({
      id: 'shape-vkcom',
      className: 'auth-vk-icon'
    });

    var text = dom.div()
      .className('auth-vk-desc')
      .append('login with vk');

    var circle = dom.div()
      .className('auth-bg-circle')
      .append(vkIcon, text);

    var link = dom.a()
      .className('element-link auth-link')
      .attr('href', this.props.url)
      .append(circle);

    return dom.div()
      .className('auth')
      .append(link)
      .make();
  }
});