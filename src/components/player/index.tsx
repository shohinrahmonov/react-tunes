import lanaMp3 from "@assets/lana.mp3";
import {Icons} from "@components/icons";
import {cn} from "@lib/utils";
import {Button} from "@ui/button";
import {Input} from "@ui/input";
import {Slider} from "@ui/slider";
import {useState, useRef, useEffect} from "react";
import ReactHowler from "react-howler";
import Timeline from "@components/player/timeline";
import {readAsDataURL} from "@lib/file";

const Player = () => {
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentSong, setCurrentSong] = useState([lanaMp3]);
  const [songIndex, setSongIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(50);
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

  const handleUploadSongs = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      try {
        const fileReadPromises = Array.from(files).map((file) =>
          readAsDataURL(file)
        );
        const results = await Promise.all(fileReadPromises);
        setCurrentSong((prevSongs) => [...prevSongs, ...(results as string[])]);
      } catch (error) {
        console.error("Error reading files:", error);
      }
    }
  };
  const onChangeSongNext = () => {
    if (currentSong[songIndex + 1]) {
      setSongIndex(songIndex + 1);
    }
  };
  const onChangeSongPrev = () => {
    if (currentSong[songIndex - 1]) {
      setSongIndex(songIndex - 1);
    }
  };
  return (
    <div className="flex justify-center flex-col-reverse px-2">
      <Button onClick={() => setPlaying(!playing)}>
        {playing ? "Pause" : "Play"}
      </Button>
      <div className="my-2 space-x-3">
        <Button onClick={onChangeSongPrev}>Prev</Button>
        <Button onClick={onChangeSongNext}>Next</Button>
      </div>
      <Input
        type="file"
        accept="audio/*"
        multiple
        className="my-4"
        onChange={(e) => handleUploadSongs(e)}
      />
      <div className="flex items-center my-4">
        {currentSong && (
          <ReactHowler
            src={currentSong[songIndex]}
            playing={playing}
            volume={volume / 100}
            onLoad={onPlayHandler}
            ref={(_player) => (playerRef.current = _player)}
          />
        )}
        <Timeline
          duration={duration}
          currentTime={currentTime}
          onSeek={(duration) =>
            playerRef.current && playerRef.current.seek(duration)
          }
        />
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
