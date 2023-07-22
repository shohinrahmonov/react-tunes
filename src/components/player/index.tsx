import lanaMp3 from "@assets/lana.mp3";
import {Icons} from "@components/icons";
import {convertSecondsToMinutesAndSeconds} from "@lib/timer";
import {cn} from "@lib/utils";
import {Button} from "@ui/button";
import {Slider} from "@ui/slider";
import {useState, useRef, useEffect} from "react";
import ReactHowler from "react-howler";

const Player = () => {
  console.log("lanaMp3", lanaMp3);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(100);
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
    playerRef.current && playerRef.current.seek(xPos * duration);
  };

  useEffect(() => {
    return () => {
      if (playerInterval) {
        clearInterval(playerInterval);
      }
    };
  }, []);

  const volumeHandler = (e: number[]) => {
    const value = e[0];
    setVolume(value);
    playerRef.current && playerRef.current.howler.volume(value / 100);
  };
  return (
    <div className="flex justify-center flex-col-reverse px-2">
      <Button onClick={() => setPlaying(!playing)}>
        {playing ? "Pause" : "Play"}
      </Button>
      <div className="flex items-center my-4">
        <ReactHowler
          src={lanaMp3}
          playing={playing}
          onLoad={onPlayHandler}
          ref={(_player) => (playerRef.current = _player)}
        />

        <div className="flex items-center w-full">
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
          <div className="mx-2">
            <span>{convertSecondsToMinutesAndSeconds(currentTime)}</span>/
            <span>{convertSecondsToMinutesAndSeconds(duration)}</span>
          </div>
        </div>
        <div className="flex items-center justify-between w-40">
          <Icons.volume
            className="cursor-pointer w-6 h-6"
            onClick={() => volumeHandler([0])}
          />
          <Slider
            max={100}
            defaultValue={[100]}
            value={[volume]}
            onValueChange={volumeHandler}
            className={cn("w-[60%]")}
          />
          <Icons.volumeUp
            className="cursor-pointer w-6 h-6"
            onClick={() => volumeHandler([100])}
          />
        </div>
      </div>
    </div>
  );
};

export default Player;
