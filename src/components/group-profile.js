var React = require('react');
var dom = React.DOM;

module.exports = React.createClass({
  displayName: 'group-profile',

  render: function () {
    var avatar = dom.img({
      src: this.props.group.photo_200
    });

    var name = dom.span(null, this.props.group.name);

    return dom.div({
      key: 'group-profile',
      className: 'main-view group-profile',
    }, [avatar, name]);
  }
});