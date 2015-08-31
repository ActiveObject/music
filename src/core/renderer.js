var React = require('react');

module.exports = function render(mountNode) {
  return function renderRoot(root) {
    if (!document.hidden) {
      React.render(root, mountNode);
    }
  };
};
