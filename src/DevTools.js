import React from 'react';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
import FilterMonitor from 'redux-devtools-filter-actions';
import { PLAYER_UPDATE_POSITION, PLAYER_UPDATE_LOADING } from 'app/redux';

export default createDevTools(
  <DockMonitor toggleVisibilityKey='ctrl-h'
               changePositionKey='ctrl-q'
               defaultIsVisible={false}>
    <FilterMonitor blacklist={[PLAYER_UPDATE_POSITION, PLAYER_UPDATE_LOADING]}>
      <LogMonitor theme='tomorrow' />
    </FilterMonitor>
  </DockMonitor>
);
