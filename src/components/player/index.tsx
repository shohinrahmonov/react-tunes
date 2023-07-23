import {Icons} from "@components/icons";
import {cn} from "@lib/utils";
import {Button} from "@ui/button";
import {Input} from "@ui/input";
import {Slider} from "@ui/slider";
import {useState, useRef, useEffect} from "react";
import ReactHowler from "react-howler";
import Timeline from "@components/player/timeline";
import {readAsDataURL} from "@lib/file";
import {PlaylistModel} from "src/models/playlist.model";
import Playlist from "@components/player/playlist";

const Player = () => {
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylist] = useState<PlaylistModel[]>([]);
  const [songIndex, setSongIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(50);
  const playerRef = useRef<ReactHowler | null>();

  useEffect(() => {
    const playerInterval = setInterval(() => {
      if (playerRef.current) {
        setDuration(playerRef.current.duration());
        setCurrentTime(playerRef.current.seek());
      }
    }, 1000);

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

    const newUploadedFiles = e.target.files
      ? Array.from(e.target.files).map((file) => ({
          title: file.name,
          file: file,
          song: "",
        }))
      : [];
    const filtredPlaylist = playlist
      .concat(newUploadedFiles)
      .filter((file, index, self) => {
        return self.findIndex((f) => f.title === file.title) === index;
      });

    if (files && files.length > 0) {
      try {
        const fileReadPromises = filtredPlaylist.map(async (file) => {
          const song = (await readAsDataURL(file.file)) as string;
          return {...file, song};
        });
        const results = await Promise.all(fileReadPromises);
        setPlaylist(results);
        setPlaying(true);
      } catch (error) {
        console.error("Error reading files:", error);
      }
    }
  };
  const onChangeSongNext = () => {
    if (playlist[songIndex + 1]) {
      setSongIndex(songIndex + 1);
    }
  };
  const onChangeSongPrev = () => {
    if (playlist[songIndex - 1]) {
      setSongIndex(songIndex - 1);
    }
  };
  return (
    <div className="flex justify-center flex-col px-2">
      <div className="my-2 space-x-3 flex justify-center">
        <Button
          variant={"ghost"}
          disabled={!playlist[songIndex - 1]}
          onClick={onChangeSongPrev}
        >
          <Icons.left className="h-6 w-6" />
        </Button>
        <Button
          variant={"ghost"}
          disabled={playlist.length < 1}
          onClick={() => setPlaying(!playing)}
        >
          {playing ? (
            <Icons.pause className="h-6 w-6" />
          ) : (
            <Icons.play className="h-6 w-6" />
          )}
        </Button>
        <Button
          variant={"ghost"}
          disabled={!playlist[songIndex + 1]}
          onClick={onChangeSongNext}
        >
          <Icons.right className="h-6 w-6" />
        </Button>
      </div>
      <div className="flex items-center my-4">
        {playlist.length > 0 && (
          <ReactHowler
            src={playlist[songIndex].song}
            playing={playing}
            volume={volume / 100}
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
        <div className="flex items-center justify-between w-40 ml-2">
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
      <Input
        type="file"
        accept="audio/*"
        multiple
        className="my-4"
        onChange={(e) => handleUploadSongs(e)}
      />
      <Playlist
        playlist={playlist}
        currentSongIndex={songIndex}
        setSongIndex={setSongIndex}
      />
    </div>
  );
};

export default Player;
