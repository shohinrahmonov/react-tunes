import {Icons} from "@components/icons";
import {cn} from "@lib/utils";
import {Button} from "@ui/button";
import {Slider} from "@ui/slider";
import Playlist from "@components/player/playlist";
import {usePlayerStore} from "@store/player.store";
import Volume from "@components/player/volume";
import PlayerSelf from "@components/player/player";
import Wave from "@components/player/wave";
import Upload from "@components/player/upload";
import {usePlaylistStore} from "@store/playlist.store";

const Player = () => {
  const {playing, volume, updateVolume, updatePlaying} = usePlayerStore(
    (state) => state
  );
  const {playlist, activeSongIndex, updateActiveSongIndex} = usePlaylistStore(
    (state) => state
  );

  const volumeHandler = (e: number[]) => {
    const value = e[0];
    updateVolume(value);
  };

  const onChangeSongNext = () => {
    if (playlist[activeSongIndex + 1]) {
      updateActiveSongIndex(activeSongIndex + 1);
    }
  };
  const onChangeSongPrev = () => {
    if (playlist[activeSongIndex - 1]) {
      updateActiveSongIndex(activeSongIndex - 1);
    }
  };
  return (
    <div className="flex justify-center flex-col px-2">
      <div className="my-2 space-x-3 flex justify-center">
        <Button
          variant={"ghost"}
          disabled={!playlist[activeSongIndex - 1]}
          onClick={onChangeSongPrev}
        >
          <Icons.left className="h-6 w-6" />
        </Button>
        <Button
          variant={"ghost"}
          disabled={playlist.length < 1}
          onClick={() => updatePlaying(!playing)}
        >
          {playing ? (
            <Icons.pause className="h-6 w-6" />
          ) : (
            <Icons.play className="h-6 w-6" />
          )}
        </Button>
        <Button
          variant={"ghost"}
          disabled={!playlist[activeSongIndex + 1]}
          onClick={onChangeSongNext}
        >
          <Icons.right className="h-6 w-6" />
        </Button>
      </div>
      <div className="flex items-center my-4">
        <PlayerSelf />
        <Wave className="mx-2" />
        <div className="flex items-center justify-between w-40 ml-2">
          <Icons.volume
            className="cursor-pointer w-6 h-6"
            onClick={() => volumeHandler([0])}
          />
          <Slider
            max={100}
            step={10}
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
      <Upload />
      <Playlist />
      <Volume />
    </div>
  );
};

export default Player;
