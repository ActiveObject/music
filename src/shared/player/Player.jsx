import React from 'react';
import app from 'app';
import { updateOn } from 'app/StartApp';
import { hasTag } from 'app/shared/Tag';
import AudioProgressLine from './AudioProgressLine';
import './Player.css';
import { Section, Content } from 'app/app/shared/ResponsiveGrid';

let Player = () => {
  var player = app.value.get(':db/player');

  if (hasTag(player, ':player/empty')) {
    return <div/>;
  }

  var track = {
    title: player.track.title.trim(),
    artist: player.track.artist.trim(),
    duration: formatDuration(player.track.duration),
    position: formatDuration(Math.floor(player.position / 1000))
  };

  return (
    <div className='player-bbox'>
      <Section>
        <Content>
          <div className='player-cbox'>
            <div className='player-desc' title={[track.artist, track.title].join(' – ')} >
              <span className='player-artist'>{track.artist}</span>
              <span className='player-separator'>-</span>
              <span className='player-title'>{track.title}</span>
            </div>

            <span className='player-time'>
              <span className='player-position'>{track.position}</span>
              <span>/</span>
              <span className='player-duration'>{track.duration}</span>
            </span>

            <div className='player-progress'>
              <AudioProgressLine player={player} />
            </div>
          </div>
        </Content>
      </Section>
    </div>
  );
}

function togglePlay() {
  vbus.emit(Player.togglePlay(this.props.player));
}

function formatDuration(s) {
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

function pad(n) {
  return n < 10 ? '0' + n : n;
}

export default updateOn(Player, ':db/player');
