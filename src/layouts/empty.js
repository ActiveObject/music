var React = require('react');

function EmptyLayout() {

}

EmptyLayout.prototype.render = function(appstate) {
  return React.DOM.div({ className: 'empty-view' });
};

module.exports = EmptyLayout;
