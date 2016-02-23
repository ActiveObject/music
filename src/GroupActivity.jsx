import React from 'react';
import vk from 'app/vk';
import './GroupActivity.css';
import ActivityChart from 'app/ActivityChart';

class GroupActivity extends React.Component {
  constructor() {
    super();
    this.state = {
      activity: {}
    };
  }

  componentWillMount() {
    loadActivityForLastNWeeks(this.props.groupId, 44, (err, items) => {
      if (err) {
        return console.log(err);
      }

      items.forEach(t => {
        var d = new Date(t * 1000);
        var k = [d.getFullYear(), d.getMonth(), d.getDate()].join('-');

        if (this.state.activity[k]) {
          this.state.activity[k]++;
        } else {
          this.state.activity[k] = 1;
        }
      })

      this.forceUpdate();
    });
  }

  render() {
    return (
      <div className='group-activity'>
        <ActivityChart value={this.state.activity} size={16} margin={2} weeks={44} />
      </div>
    );
  }
}

function loadActivityForLastNWeeks(groupId, n, onLoad) {
  var timestamp = Date.now() - n * 7 * 24 * 60 * 60 * 1000;

  function next(latestTimestamp, offset, count) {
    if (latestTimestamp > timestamp) {
      loadGroupActivity(groupId, offset, count, (err, res) => {
        if (err) {
          return onLoad(err);
        }

        var items = res.response.reduce((acc, x) => acc.concat(x));
        onLoad(null, items);
        if (items.length === count) {
          next(items[items.length - 1] * 1000, offset + count, count);
        }
      });
    }
  }

  next(Date.now(), 0, 1000, onLoad);
}


function loadGroupActivity(groupId, offset, count, callback) {
  vk.execute({
    code: `
      var i = 10;
      var items = [];
      var offset = ${offset};

      while(i) {
        i = i - 1;
        var chunk = API.wall.get({
          owner_id: -${groupId},
          offset: offset,
          count: 100
        }).items@.date;

        offset = offset + 100;
        items.push(chunk);

        if (!chunk.length) {
          return items;
        }
      }

      return items;
    `
  }, callback);
}

export default GroupActivity;
