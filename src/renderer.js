import ReactDOM from 'react-dom';

export default function render(mountNode) {
  return function renderRoot(root) {
    ReactDOM.render(root, mountNode);
  };
}
