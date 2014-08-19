var React = require('react');

module.exports = React.createClass({
  componentDidMount: function () {
    this.getDOMNode().innerHTML = '<use xlink:href="#' + this.props.id + '"></use>';
    this.getDOMNode().querySelector('use').addEventListener('click', this.props.onClick, false);
  },

  componentWillUnmount: function () {
    this.getDOMNode().querySelector('use').removeEventListener('click', this.props.onClick, false);
  },

  componentDidUpdate: function () {
    this.getDOMNode().querySelector('use').removeEventListener('click', this.props.onClick, false);
    this.getDOMNode().innerHTML = '<use xlink:href="#' + this.props.id + '"></use>';
    this.getDOMNode().querySelector('use').addEventListener('click', this.props.onClick, false);
  },

  render: function () {
    return React.DOM.svg({
      className: 'icon'
    });
  }
});