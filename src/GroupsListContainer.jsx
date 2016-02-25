import React from 'react';
import vk from 'app/vk';
import GroupsList from './GroupsList';
import GroupsListPreview from './GroupsListPreview';

class GroupsListContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      groups: []
    };
  }

  componentWillMount() {
    vk.groups.getById({
      group_ids: this.props.ids.join(','),
      fields: ['description'].join(',')
    }, (err, res) => {
      if (err) {
        return console.log(err);
      }

      this.setState({ groups: res.response }); });
  }

  render() {
    if (this.state.groups.length === 0) {
      return <GroupsListPreview numOfItems={5} />
    }

    return <GroupsList groups={this.state.groups} />
  }
}

export default GroupsListContainer;
