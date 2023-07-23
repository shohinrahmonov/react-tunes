import {cn} from "@lib/utils";
import {PlaylistModel} from "src/models/playlist.model";

interface PlaylistProps {
  playlist: PlaylistModel[];
  setSongIndex: React.Dispatch<React.SetStateAction<number>>;
  currentSongIndex: number;
}

const Playlist = ({playlist, setSongIndex, currentSongIndex}: PlaylistProps) => {
  return (
    <>
      {playlist.length > 0 ? (
        <div className="space-y-2">
          {playlist.map((song, index) => (
            <div
              onClick={() => setSongIndex(index)}
              key={index}
              className={cn(
                "p-4 rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground",
                index === currentSongIndex ? "bg-accent" : ""
              )}
            >
              {song.title}
            </div>
          ))}
        </div>
      ) : (
        <div>No songs in playlist</div>
      )}
    </>
  );
};

export default Playlist;
