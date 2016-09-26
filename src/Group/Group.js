import React from 'react';
import MediaQuery from 'react-responsive';
import GroupProfile from './GroupProfile';
import GroupProfilePreview from './GroupProfilePreview';
import GroupTop5Tracks from './GroupTop5Tracks';
import GroupActivity from './GroupActivity';
import FetchGroup from './FetchGroup';
import 'app/shared/ResponsiveGrid.css';

const Group = ({ params }) =>
  <div className='Group'>
    <FetchGroup id={params.id}>
      {({ isLoading, group }) =>
        <GroupProfilePreview isActive={isLoading}>
          <GroupProfile group={group} />
        </GroupProfilePreview>
      }
    </FetchGroup>

    <MediaQuery minAspectRatio='2/3'>
      <section className='Group__activity'>
        <GroupActivity groupId={params.id} />
      </section>
    </MediaQuery>

    <section className='Group__content'>
      <header>Week top</header>
      <GroupTop5Tracks groupId={params.id} />
    </section>
  </div>

export default Group;
