import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import LibraryTracklist from 'app/library/LibraryTracklist';
import { toggleShuffle } from 'app/actions';
import './Library.css';

let Library = ({ dispatch }) =>
  <div className='Library'>
    <div className='layer'>
      <div className='Library__body'>
        <div className='toolbar-container'>
          <div className='toolbar'>
            <span
              className={cx({ 'action': true, 'action--active': false })}
              onClick={() => dispatch(toggleShuffle())}>shuffle</span>
          </div>
        </div>
        <LibraryTracklist />
      </div>
    </div>
  </div>

export default connect()(Library);
