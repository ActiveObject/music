import React from 'react';
import app from 'app';
import vk from 'app/vk';

class VkGroupSync extends React.Component {
  componentWillMount() {
    this.stopUpdating = startUpdating(60 * 1000);
  }

  componentWillUnmount() {
    this.stopUpdating();
  }

  render() {
    return <div />;
  }
}

function startUpdating(interval) {
  var timer = null;

  function next() {
    updateGroups();
    timer = setTimeout(() => next(), interval);
  }

  next();

  return function () {
    clearTimeout(timer);
  };
}

function updateGroups() {
  vk.groups.get({}, (err, res) => {
    if (err) {
      return console.log(err);
    }

    app.push({
      tag: ':app/groups',
      value: res.response.items.map(String)
    });
  });
}

export default VkGroupSync;
