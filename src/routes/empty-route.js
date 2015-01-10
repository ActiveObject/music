var React = require('react');

module.exports = {
  render: function(appstate) {
    return React.DOM.div({ className: 'empty-view' });
  },

  lifecycle: require('app/core/default-route-lifecycle')
};
