require('app/styles/tabs.styl');
require('app/styles/element.styl');

var React = require('react');
var dom = require('app/core/dom');

var Tabs = React.createClass({
  displayName: 'Tabs',

  render: function () {
    var items = this.props.items.map(function (item) {
      return dom.span()
        .className('element-link tabs-item')
        .className('tabs-item-active', item.isActive)
        .attr('onClick', this.onClick.bind(this, item.id))
        .append(item.text);
    }, this);

    return dom.div()
      .className('tabs')
      .append(items)
      .make();
  },

  onClick: function (id) {
    this.props.onChange(id);
  }
});

module.exports = Tabs;