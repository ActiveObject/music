var React = require('react');

var Icon = React.createClass({
  render: function () {
    return (
      <svg className='icon' viewBox='0 0 100 100'>
        <use xlinkHref={`#${this.props.id}`} />
      </svg>
    );
  }
});

module.exports = Icon;