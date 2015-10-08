var ReactDOM = require('react-dom');

module.exports = function render(mountNode) {
  return function renderRoot(root) {
    if (!document.hidden) {
      ReactDOM.render(root, mountNode);
    }
  };
};
