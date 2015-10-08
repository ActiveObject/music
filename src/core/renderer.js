var ReactDOM = require('react-dom');

module.exports = function render(mountNode) {
  return function renderRoot(root) {
    ReactDOM.render(root, mountNode);
  };
};
