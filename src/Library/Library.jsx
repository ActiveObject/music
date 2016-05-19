import React from 'react';
import cx from 'classnames';
import app from 'app';
import { hasTag } from 'app/shared/Tag';
import { updateOn } from 'app/AppHost';
import LibraryTracklist from 'app/library/LibraryTracklist';
import Layer from 'app/shared/Layer';
import ProfileCtrl from 'app/shared/user-profile/ProfileCtrl';
import PlayBtnCtrl from 'app/shared/PlayBtn/PlayBtnCtrl';
import './Library.css';

let Toolbar = updateOn(() => {
  var player = app.value.get(':db/player');
  var isShuffled = hasTag(player, ':player/is-shuffled');

  return (
    <div className='toolbar-container'>
      <div className='toolbar'>
        <span className={cx({ 'action': true, 'action--active': isShuffled })} onClick={shuffle}>shuffle</span>
      </div>
    </div>
  );
}, db => hasTag(db.get(':db/player'), ':player/is-shuffled'));

function shuffle() {
  app.push({
    tag: ':library/toggle-shuffle'
  });
}

let Library = () =>
  <div className='Library'>
    <Layer>
      <ProfileCtrl />
    </Layer>
    <Layer>
      <div className='Library__body'>
        <Toolbar />
        <LibraryTracklist />
      </div>
    </Layer>
    <PlayBtnCtrl />
  </div>

export default Library;
