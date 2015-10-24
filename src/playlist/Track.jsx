import cx from 'classnames';
import duration from 'app/fn/duration';
import './track.css';

const Track = ({ track, isActive = false, onTogglePlay }) =>
  <div className={ cx({ 'track': true, 'track--active': isActive }) } onClick={ () => onTogglePlay(track) }>
    <div className='track__index'>{track.audio.index + 1}</div>
    <div className='track__artist'>{track.audio.artist}</div>
    <div className='track__title'>{track.audio.title}</div>
    <div className='track__duration'>{duration(track.audio.duration)}</div>
  </div>

export default Track;