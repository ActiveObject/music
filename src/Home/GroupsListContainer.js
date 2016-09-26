import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import Link from 'react-router/Link';

import GroupsListPreview from './GroupsListPreview';
import GroupSync from './GroupSync';
import Tracker from './Tracker';

import './GroupsList.css';

let Group = ({ value }) =>
  <div className='track' style={{ height: 50 }}>
    <div className='GroupsList__image' style={{ width: 30, height: 30 }}>
      <img src={value.photo_50} width={30} height={30} />
    </div>
    <div className='GroupsList__name'>
      <Link to={`/groups/${value.id}`} data-track-key={value.id}>{value.name}</Link>
    </div>
  </div>

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
    var groups = this.props.groups
      .sort(compareByUsage(this.state.usage))
      .filter(id => this.state.cache.has(id))
      .map(id => this.state.cache.get(id));

    return (
      <Tracker value={this.state.usage} onChange={c => this.updateUsage(c)}>
        <GroupSync cache={this.state.cache} onSync={c => this.updateCache(c)}>
          <GroupsListPreview isActive={groups.length === 0} numOfItems={5}>
            <div className='groups-list'>
              {groups.map(v => <Group key={v.id} value={v} />)}
            </div>
          </GroupsListPreview>
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
