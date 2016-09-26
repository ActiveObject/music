import React from 'react';
import Link from 'react-router/Link';
import MediaQuery from 'react-responsive';
import GroupTop5Tracks from './GroupTop5Tracks';
import GroupActivity from './GroupActivity';
import FetchGroup from './FetchGroup';
import 'app/shared/ResponsiveGrid.css';
import './Group.css'

let randomNum = (min, max) => min + Math.floor(Math.random() * (max - min));

const GroupListItemPreview = () =>
  <div className='track' style={{ height: 50 }}>
    <div className='GroupsList__image'>
      <div className='GroupsListPreview__image-block'></div>
    </div>
    <div className='GroupsList__title'>
      <div className='TracklistPreview__block' style={{ width: `${randomNum(50, 100)}%` }}></div>
    </div>
  </div>

const GroupListItem = ({ group }) =>
  <div className='track' style={{ height: 50 }}>
    <div className='GroupsList__image' style={{ width: 30, height: 30 }}>
      <img src={group.photo_50} width={30} height={30} />
    </div>
    <div className='GroupsList__name'>
      <Link to={`/groups/${group.id}`} data-track-key={group.id}>{group.name}</Link>
    </div>
  </div>

const GroupProfilePreview = () =>
  <div className='group-profile group-profile-preview'>
    <div className='group-image'>
      <div className='group-profile-preview__image' />
    </div>
    <span className='group-name'>
      <div className='group-profile-preview__name' />
    </span>
  </div>

const GroupProfile = ({ group }) =>
  <div className='group-profile'>
    <div className='group-image'>
      <img src={group.photo_200} />
    </div>
    <span className='group-name'>{group.name}</span>
  </div>

const GroupFullscreen = ({ id }) =>
  <div className='Group'>
    <FetchGroup id={id}>
      {({ isLoading, group }) => isLoading ? <GroupProfilePreview /> : <GroupProfile group={group} /> }
    </FetchGroup>

    <MediaQuery minAspectRatio='2/3'>
      <section className='Group__activity'>
        <GroupActivity groupId={id} />
      </section>
    </MediaQuery>

    <section className='Group__content'>
      <header>Week top</header>
      <GroupTop5Tracks groupId={id} />
    </section>
  </div>

const Group = ({ id, shape = 'fullscreen' }) => {
  if (shape === 'list-item') {
    return (
      <FetchGroup id={id}>
        {({ isLoading, group }) => isLoading ? <GroupListItemPreview /> : <GroupListItem group={group} /> }
      </FetchGroup>
    );
  }

  if (shape === 'fullscreen') {
    return <GroupFullscreen id={id} />
  }
}

export default Group;
