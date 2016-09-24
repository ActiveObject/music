import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import { hasTag } from 'app/shared/Tag';
import LibraryTracklist from 'app/library/LibraryTracklist';
import Layer from 'app/shared/Layer';
import ProfileCtrl from 'app/shared/user-profile/ProfileCtrl';
import PlayBtnCtrl from 'app/shared/PlayBtn/PlayBtnCtrl';
import './Library.css';
import { toggleShuffle } from 'app/actions';

let Toolbar = ({ player, isShuffled, dispatch }) =>
  <div className='toolbar-container'>
    <div className='toolbar'>
      <span
        className={cx({ 'action': true, 'action--active': isShuffled })}
        onClick={() => dispatch(toggleShuffle())}>shuffle</span>
    </div>
  </div>

Toolbar = connect(state => ({ player: state.player, isShuffled: state.isShuffled }))(Toolbar);

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
