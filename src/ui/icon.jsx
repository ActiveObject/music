var React = require('react/addons');

var Icon = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  componentDidMount: function () {
    this.getDOMNode().appendChild(this.makeXlink(this.props.id));
  },

  componentDidUpdate: function () {
    this.getDOMNode()
      .querySelector('use')
      .setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#' + this.props.id);
  },

  render: function () {
    return <svg className='icon' viewBox='0 0 100 100'></svg>;
  },

  makeXlink: function (id) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    el.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#' + id);
    return el;
  }
});

module.exports = Icon;