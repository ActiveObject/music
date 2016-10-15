import React from 'react';
import { connect } from 'react-redux';

import vk from 'app/shared/vk';
import { pushGroups } from 'app/redux';

class VkGroupSync extends React.Component {
  componentWillMount() {
    this.stopUpdating = startUpdating(60 * 1000, groups => {
      this.props.dispatch(pushGroups(groups));
    });
  }

  componentWillUnmount() {
    this.stopUpdating();
  }

  render() {
    return null;
  }
}

function startUpdating(interval, callback) {
  var timer = null;

  function next() {
    vk.groups.get({}, (err, res) => {
      if (err) {
        return console.log(err);
      }

      callback(res.response.items.map(String));
    });

    timer = setTimeout(() => next(), interval);
  }

  next();

  return function () {
    clearTimeout(timer);
  };
}

export default connect()(VkGroupSync);
