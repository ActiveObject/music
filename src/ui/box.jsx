var React = require('react');

var Box = React.createClass({
  getInitialProps: function () {
    return { name: '' };
  },

  render: function () {
    return (
      <div className={this.props.name + '__bounding-box'}>
        <div className={this.props.name + '__content-box'}>
          {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = Box;
