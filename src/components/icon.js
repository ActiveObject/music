var React = require('react');

module.exports = React.createClass({
  displayName: 'Icon',

  shouldComponentUpdate: function (nextProps) {
    return nextProps.id !== this.props.id;
  },

  componentDidMount: function () {
    this.getDOMNode().innerHTML = this.makeXlink(this.props.id);
  },

  componentDidUpdate: function () {
    this.getDOMNode().innerHTML = this.makeXlink(this.props.id);
  },

  render: function () {
    return React.DOM.svg({ className: 'icon' });
  },

  makeXlink: function (id) {
    return '<use xlink:href="#' + id + '"></use>';
  }
});