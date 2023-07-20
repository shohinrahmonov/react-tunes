import lanaMp3 from "@assets/lana.mp3";
import { convertSecondsToMinutesAndSeconds } from "@lib/timer";
import {Button} from "@ui/button";
import {useState, useRef, useEffect} from "react";
import ReactHowler from "react-howler";

const Player = () => {
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const playerRef = useRef<ReactHowler | null>();

  const playerInterval = setInterval(() => {
    if (playerRef.current) {
      setDuration(playerRef.current.duration());
      setCurrentTime(playerRef.current.seek());
    }
  }, 250);
  const onPlayHandler = () => {
    if (playerInterval) {
      clearInterval(playerInterval);
    }
  };
  const handleSeekTrack = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const xPos =
      (e.pageX - e.currentTarget.getBoundingClientRect().left) /
      e.currentTarget.offsetWidth;
    onSeekPlayer && onSeekPlayer(xPos * duration);
  };

  const onSeekPlayer = (seconds: number) => {
    playerRef.current && playerRef.current.seek(seconds);
  };

  useEffect(() => {
    return () => {
      if (playerInterval) {
        clearInterval(playerInterval);
      }
    };
  }, []);

  return (
    <div className="m-4 space-y-6">
      <ReactHowler
        src={lanaMp3}
        playing={playing}
        onLoad={onPlayHandler}
        onSeek={onSeekPlayer}
        ref={(_player) => (playerRef.current = _player)}
      />
      <Button onClick={() => setPlaying(!playing)}>
        {playing ? "Pause" : "Play"}
      </Button>
      <div
        className="h-4 w-full bg-secondary cursor-pointer overflow-hidden rounded-full"
        onClick={(e) => handleSeekTrack(e)}
      >
        <div
          className="bg-primary h-full transition-all easy-in duration-75"
          style={{
            width: `${((currentTime || 0) / (duration || 1)) * 100 || 0}%`,
          }}
        />
      </div>
      {convertSecondsToMinutesAndSeconds(currentTime)} / {convertSecondsToMinutesAndSeconds(duration)}
    </div>
  );
};

export default Player;
