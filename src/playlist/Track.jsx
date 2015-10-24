import cx from 'classnames';
import './track.css';

const Track = ({ track, isActive = false, onTogglePlay }) =>
  <div className={ cx({ 'track': true, 'track--active': isActive }) } onClick={ () => onTogglePlay(track) }>
    <div className='track__index'>{track.audio.index + 1}</div>
    <div className='track__artist'>{track.audio.artist}</div>
    <div className='track__title'>{track.audio.title}</div>
    <div className='track__duration'>{duration(track.audio.duration)}</div>
  </div>

function pad(n) {
  return n < 10 ? '0' + n : n;
}

function duration(s) {
  if (s < 60) {
    return `00:${pad(s)}`;
  }

  if (s < 60 * 60) {
    let mm = pad(Math.floor(s / 60));
    let ss = pad(s % 60);

    return `${mm}:${ss}`;
  }

  if (s < 60 * 60 * 60) {
    let hh = pad(Math.floor(s / 3600));
    let mm = pad(Math.floor((s % 3600) / 60));
    let ss = pad(s % 3600 % 60);

    return `${hh}:${mm}:${ss}`;
  }
}

export default Track;