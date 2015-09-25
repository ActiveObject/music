var React = require('react/addons');
var App = require('app/ui/app');
var db = require('app/db');
var onValue = require('app/fn/onValue');

var MainLayout = React.createClass({
  render: function() {
    return (
      <App>Hello world!</App>
    );
  }
});

function updateOn(ComposedComponent, dbKey) {
  return React.createClass({
    componentDidMount: function () {
      var stream = db.changes.map(v => v.get(dbKey)).skipDuplicates();
      this.unsub = onValue(stream, () => this.forceUpdate());
    },

    componentWillUnmount: function () {
      this.unsub();
    },

    render: function () {
      return <ComposedComponent {...this.props} />;
    }
  });
}

module.exports = updateOn(MainLayout, ':db/tracks');
