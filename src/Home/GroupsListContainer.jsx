import React from 'react';
import { Map } from 'immutable';
import app from 'app';
import { updateOn } from 'app/AppHost';
import GroupsList from './GroupsList';
import GroupsListPreview from './GroupsListPreview';
import GroupSync from './GroupSync';

class GroupsListContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      cache: Map()
    };
  }

  componentWillMount() {
    this.setState({
      cache: Map(JSON.parse(localStorage.getItem(':cache/groups')))
    });
  }

  render() {
    var groups = app.value.get(':db/groups')
      .filter(id => this.state.cache.has(id))
      .map(id => this.state.cache.get(id));

    return (
      <GroupSync cache={this.state.cache} onSync={c => this.updateCache(c)}>
        <GroupsListPreview isActive={groups.length === 0} numOfItems={5}>
          <GroupsList groups={groups} />
        </GroupsListPreview>
      </GroupSync>
    )
  }

  updateCache(cache) {
    this.setState({ cache });
    localStorage.setItem(':cache/groups', JSON.stringify(cache));
  }
}

export default updateOn(GroupsListContainer, ':db/groups');
