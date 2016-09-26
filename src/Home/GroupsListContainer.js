import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import GroupSync from './GroupSync';
import Tracker from './Tracker';
import Group from 'app/Group';

class GroupsListContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      cache: Map(),
      usage: Map()
    };
  }

  componentWillMount() {
    this.setState({
      cache: Map(JSON.parse(localStorage.getItem(':cache/groups')))
    });

    this.setState({
      usage: Map(JSON.parse(localStorage.getItem(':cache/groups-usage')))
    });
  }

  render() {
    var groups = this.props.groups.sort(compareByUsage(this.state.usage));

    return (
      <Tracker value={this.state.usage} onChange={c => this.updateUsage(c)}>
        <GroupSync cache={this.state.cache} onSync={c => this.updateCache(c)}>
          <div className='groups-list'>
            {groups.map(id => <Group key={id} id={id} shape='list-item' />)}
          </div>
        </GroupSync>
      </Tracker>
    )
  }

  updateCache(cache) {
    this.setState({ cache });
    localStorage.setItem(':cache/groups', JSON.stringify(cache));
  }

  updateUsage(usage) {
    this.setState({ usage });
    localStorage.setItem(':cache/groups-usage', JSON.stringify(usage));
  }
}

function compareByUsage(usage) {
  function usageOf(id) {
    return usage.has(id) ? usage.get(id) : 0;
  }

  return function (a, b) {
    return usageOf(b) - usageOf(a);
  };
}

export default connect(state => ({ groups: state[':app/groups'] }))(GroupsListContainer);
