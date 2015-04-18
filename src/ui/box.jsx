var React = require('react');

var Box = React.createClass({
  getInitialProps: function () {
    return { prefix: '' };
  },

  render: function () {
    return (
      <div className={this.props.prefix + 'bounding-box'}>
        <div className={this.props.prefix + 'content-box'}>
          {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = Box;
