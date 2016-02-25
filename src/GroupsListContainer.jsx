import React from 'react';
import GroupsList from './GroupsList';
import vk from 'app/vk';

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
    return <GroupsList groups={this.state.groups} />
  }
}

export default GroupsListContainer;
