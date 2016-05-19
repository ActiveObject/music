import React from 'react';
import vk from 'app/shared/vk';
import MediaQuery from 'react-responsive';
import { Section, Header, Content } from 'app/shared/ResponsiveGrid';
import PlayBtnCtrl from 'app/shared/play-btn/PlayBtnCtrl';
import GroupProfile from './GroupProfile';
import GroupProfilePreview from './GroupProfilePreview';
import GroupTop5Tracks from './GroupTop5Tracks';
import GroupActivity from './GroupActivity';

class Group extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false
    };
  }

  componentWillMount() {
    var cachedGroups = JSON.parse(localStorage.getItem(':cache/groups'));

    if (cachedGroups && cachedGroups[this.props.params.id]) {
      this.setState({
        group: cachedGroups[this.props.params.id]
      });
    } else {
      this.setState({ isLoading: true });

      vk.groups.getById({
        group_ids: this.props.params.id,
        fields: ['description']
      }, (err, res) => {
        if (err) {
          return console.log(err);
        }

        this.setState({
          isLoading: false,
          group: res.response[0]
        });
      });
    }
  }

  render() {
    return (
      <div className='Group'>
        <div className='scroll-container'>
          <Section>
            <GroupProfilePreview isActive={this.state.isLoading}>
              <GroupProfile group={this.state.group} />
            </GroupProfilePreview>
          </Section>

          <MediaQuery minAspectRatio='2/3'>
            <Section>
              <GroupActivity groupId={this.props.params.id} />
            </Section>
          </MediaQuery>

          <Section className='Group__content'>
            <Content>
              <Header>Week top</Header>
              <GroupTop5Tracks groupId={this.props.params.id} />
            </Content>
          </Section>
        </div>

        <div className='main-layout__play-btn'>
          <PlayBtnCtrl />
        </div>
      </div>
    )
  }
}

export default Group;
