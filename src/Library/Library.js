import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { hasTag } from 'app/shared/Tag';
import LibraryTracklist from 'app/library/LibraryTracklist';
import UserProfileCtrl from 'app/shared/UserProfile/UserProfileCtrl';
import PlayBtnCtrl from 'app/shared/PlayBtn/PlayBtnCtrl';
import './Library.css';
import { toggleShuffle } from 'app/actions';

let Library = ({ player, isShuffled, dispatch }) =>
  <div className='Library'>
    <UserProfileCtrl />

    <div className='layer'>
      <div className='Library__body'>
        <div className='toolbar-container'>
          <div className='toolbar'>
            <span
              className={cx({ 'action': true, 'action--active': isShuffled })}
              onClick={() => dispatch(toggleShuffle())}>shuffle</span>
          </div>
        </div>
        <LibraryTracklist />
      </div>
    </div>

    <PlayBtnCtrl />
  </div>

export default connect(state => ({ player: state.player, isShuffled: state.isShuffled }))(Library);
