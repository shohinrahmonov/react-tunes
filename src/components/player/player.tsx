import {usePlayerStore} from "@store/player.store";
import {usePlaylistStore} from "@store/playlist.store";
import {useEffect, useRef, useState} from "react";
import ReactHowler from "react-howler";
import Timeline from "@components/player/timeline";

const PlayerSelf = () => {
  const {playing, volume} = usePlayerStore(
    (state) => state
  );
  const {playlist, activeSongIndex} = usePlaylistStore(
    (state) => state
  );
  const playerRef = useRef<ReactHowler | null>();
  const playerIntervalRef = useRef<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const updatePlayerInfo = () => {
      if (playerRef.current) {
        setDuration(playerRef.current.duration());
        setCurrentTime(playerRef.current.seek());
      }

      playerIntervalRef.current = requestAnimationFrame(updatePlayerInfo);
    };

    playerIntervalRef.current = requestAnimationFrame(updatePlayerInfo);

    return () => {
      if (playerIntervalRef.current) {
        cancelAnimationFrame(playerIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full">
      {playlist.length > 0 && playlist[activeSongIndex] && (
        <ReactHowler
          src={playlist[activeSongIndex].song}
          playing={playing}
          volume={volume / 100}
          ref={(_player) => (playerRef.current = _player)}
        />
      )}
      <Timeline
        currentTime={currentTime}
        duration={duration}
        onSeek={(duration) =>
          playerRef.current && playerRef.current.seek(duration)
        }
      />
    </div>
  );
};

export default PlayerSelf;
